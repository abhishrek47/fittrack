// ============================================================
// FITTRACK — APP.JS
// Multi-profile · localStorage · Supabase sync
// ============================================================

// ── PROFILE STORE ─────────────────────────────────────────
// localStorage keys:
//   ft_profiles            → array of profile metadata objects
//   ft_active_profile      → profileId string
//   ft_logs_{profileId}    → diet/workout/habit logs per profile
//   ft_wkstate_{profileId} → selected variation per profile

function getAllProfiles()        { return JSON.parse(localStorage.getItem('ft_profiles') || '[]'); }
function saveAllProfiles(arr)   { localStorage.setItem('ft_profiles', JSON.stringify(arr)); }
function getActiveProfileId()   { return localStorage.getItem('ft_active_profile') || null; }
function setActiveProfileId(id) { localStorage.setItem('ft_active_profile', id); }
function generateId()           { return 'p_' + Math.random().toString(36).slice(2, 10); }

function getProfile(id) {
  return getAllProfiles().find(p => p.id === id) || null;
}
function saveProfile(profile) {
  const all = getAllProfiles();
  const idx = all.findIndex(p => p.id === profile.id);
  if (idx >= 0) all[idx] = profile; else all.push(profile);
  saveAllProfiles(all);
  // Mirror to cloud
  if (typeof syncProfileToCloud === 'function') {
    syncProfileToCloud(profile).catch(()=>{});
  }
}
function deleteProfile(id) {
  const all = getAllProfiles().filter(p => p.id !== id);
  saveAllProfiles(all);
  localStorage.removeItem(`ft_logs_${id}`);
  localStorage.removeItem(`ft_wkstate_${id}`);
}

// Logs — namespaced per profile
function loadLogs(profileId)    { return JSON.parse(localStorage.getItem(`ft_logs_${profileId}`) || '{}'); }
function saveLogs(profileId, logs) { localStorage.setItem(`ft_logs_${profileId}`, JSON.stringify(logs)); }
function loadWkState(profileId) { return JSON.parse(localStorage.getItem(`ft_wkstate_${profileId}`) || '{}'); }
function saveWkState(profileId, s) { localStorage.setItem(`ft_wkstate_${profileId}`, JSON.stringify(s)); }

// ── APP STATE ─────────────────────────────────────────────
let ACTIVE_PROFILE = null;  // full profile object
let LOG = {};               // logs for active profile
let STATE = {
  currentDate:   todayStr(),
  activeSection: 'dashboard',
  workout: { selectedVariation: 1, enrolledPlanId: null, enrolledDay: 1 },
};

// ── DATE HELPERS ──────────────────────────────────────────
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function formatDate(str) {
  const d = new Date(str+'T00:00:00');
  return d.toLocaleDateString('en-IN',{weekday:'short',month:'short',day:'numeric'});
}
function offsetDate(str, days) {
  const d = new Date(str+'T00:00:00');
  d.setDate(d.getDate()+days);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function isToday(str) { return str === todayStr(); }

// ── LOG HELPERS ───────────────────────────────────────────
function getLog(dateStr) {
  if (!LOG[dateStr]) {
    LOG[dateStr] = {
      meals:   { breakfast:[], lunch:[], dinner:[], snacks:[] },
      water:   0, smoke: 0, alcohol: 0,
      workout: { variation: STATE.workout.selectedVariation, activeDay: 1, completedExercises: [] },
      weight:  null,
    };
  }
  return LOG[dateStr];
}
function persistLogs(dateStr) {
  saveLogs(ACTIVE_PROFILE.id, LOG);
  // Sync to cloud if Supabase is configured
  if (typeof syncLogToCloud === 'function' && dateStr) {
    syncLogToCloud(ACTIVE_PROFILE.id, dateStr, LOG[dateStr]).catch(()=>{});
  }
}

function persistLogsForDate(dateStr) {
  persistLogs(dateStr);
}

// ── NUTRITION CALC ─────────────────────────────────────────
function logTotals(dateStr) {
  const log = getLog(dateStr);
  let cal=0,pro=0,carb=0,fat=0,fiber=0,sodium=0,calcium=0,iron=0,vitC=0;
  Object.values(log.meals).flat().forEach(item=>{
    const m = item.qty||1;
    cal    += (item.cal   ||0)*m;
    pro    += (item.pro   ||0)*m;
    carb   += (item.carb  ||0)*m;
    fat    += (item.fat   ||0)*m;
    fiber  += (item.fiber ||0)*m;
    sodium += (item.sodium||0)*m;
    calcium+= (item.calcium||0)*m;
    iron   += (item.iron  ||0)*m;
    vitC   += (item.vitC  ||0)*m;
  });
  return { cal:Math.round(cal), pro:Math.round(pro), carb:Math.round(carb), fat:Math.round(fat),
           fiber:Math.round(fiber), sodium:Math.round(sodium), calcium:Math.round(calcium),
           iron:+iron.toFixed(1), vitC:Math.round(vitC) };
}

function workoutCalsBurned(dateStr) {
  const log     = getLog(dateStr);
  const plan    = WORKOUT_PLANS.find(p=>p.id===log.workout.variation) || WORKOUT_PLANS[0];
  const dayPlan = plan.days.find(d=>d.day===(log.workout.activeDay||1)) || plan.days[0];
  const progress = log.workout.exerciseProgress || {};
  const removed  = new Set(log.workout.removedExercises || []);
  // Plan exercises (skip removed)
  let cals = dayPlan.exercises.reduce((sum, ex) => {
    if (removed.has(ex.key)) return sum;
    const prog = progress[ex.key];
    if (prog && prog.done) {
      return sum + getActualCalsBurned(ex.key, ex.reps, prog.sets || ex.sets, prog.reps || parseInt(ex.reps)||10, ACTIVE_PROFILE?.weight||70);
    }
    if ((log.workout.completedExercises||[]).includes(ex.key)) {
      return sum + getCalsBurned(ex.key, ex.sets, ACTIVE_PROFILE?.weight||70);
    }
    return sum;
  }, 0);
  // Custom exercises
  (log.workout.customExercises||[]).forEach(ex => {
    const prog = progress[ex.key];
    if (prog && prog.done) {
      cals += getActualCalsBurned(ex.key, ex.reps, prog.sets || ex.sets, prog.reps || ex.reps, ACTIVE_PROFILE?.weight||70);
    }
  });
  return cals;
}

function getActualCalsBurned(key, plannedReps, actualSets, actualReps, weight) {
  const ex = EXERCISES[key];
  if (!ex) return 0;
  const plannedRepsNum = parseInt(plannedReps) || 10;
  const factor = actualReps / Math.max(1, plannedRepsNum);
  return Math.round(ex.calsPerSet * actualSets * factor * (weight / 70));
}

function changeExerciseSets(key, delta) {
  const log = getLog(STATE.currentDate);
  if (!log.workout.exerciseProgress) log.workout.exerciseProgress = {};
  if (!log.workout.exerciseProgress[key]) {
    const plan    = WORKOUT_PLANS.find(p=>p.id===STATE.workout.selectedVariation)||WORKOUT_PLANS[0];
    const dayPlan = plan.days.find(d=>d.day===workoutDayNum)||plan.days[0];
    const ex      = dayPlan.exercises.find(e=>e.key===key);
    log.workout.exerciseProgress[key] = { sets: ex ? ex.sets : 3, reps: parseInt(ex?.reps)||10, done: false };
  }
  const prog = log.workout.exerciseProgress[key];
  prog.sets = Math.max(0, (prog.sets||0) + delta);
  prog.done = prog.sets > 0;
  // Sync into old completedExercises for backward compat
  if (!log.workout.completedExercises) log.workout.completedExercises = [];
  const idx = log.workout.completedExercises.indexOf(key);
  if (prog.done && idx < 0) log.workout.completedExercises.push(key);
  if (!prog.done && idx >= 0) log.workout.completedExercises.splice(idx, 1);
  persistLogs(STATE.currentDate);
  // Update just the display elements without full re-render
  const setsEl = document.getElementById(`sets_${key}`);
  if (setsEl) setsEl.value = prog.sets;
  const plan    = WORKOUT_PLANS.find(p=>p.id===STATE.workout.selectedVariation)||WORKOUT_PLANS[0];
  const dayPlan = plan.days.find(d=>d.day===workoutDayNum)||plan.days[0];
  const exPlan  = dayPlan.exercises.find(e=>e.key===key);
  const calEl   = document.getElementById(`cal_${key}`);
  if (calEl && exPlan) calEl.textContent = `~${getActualCalsBurned(key, exPlan.reps, prog.sets, prog.reps||parseInt(exPlan.reps)||10, ACTIVE_PROFILE?.weight||70)} kcal`;
  const card = document.getElementById(`ex_card_${key}`);
  if (card) {
    card.classList.toggle('completed', prog.done);
    card.classList.toggle('selected',  prog.done);
  }
  // Update totals
  _updateWorkoutTotals();
  renderDashboard();
  // Start rest timer when a set is marked done
  if (prog.done && delta > 0) startRestTimer(_rt.duration || 90);
}

function changeExerciseReps(key, delta) {
  const log = getLog(STATE.currentDate);
  if (!log.workout.exerciseProgress) log.workout.exerciseProgress = {};
  if (!log.workout.exerciseProgress[key]) {
    const plan    = WORKOUT_PLANS.find(p=>p.id===STATE.workout.selectedVariation)||WORKOUT_PLANS[0];
    const dayPlan = plan.days.find(d=>d.day===workoutDayNum)||plan.days[0];
    const ex      = dayPlan.exercises.find(e=>e.key===key);
    log.workout.exerciseProgress[key] = { sets: ex ? ex.sets : 3, reps: parseInt(ex?.reps)||10, done: false };
  }
  const prog = log.workout.exerciseProgress[key];
  prog.reps = Math.max(1, (prog.reps||10) + delta);
  persistLogs(STATE.currentDate);
  const repsEl = document.getElementById(`reps_${key}`);
  if (repsEl) repsEl.value = prog.reps;
  const plan    = WORKOUT_PLANS.find(p=>p.id===STATE.workout.selectedVariation)||WORKOUT_PLANS[0];
  const dayPlan = plan.days.find(d=>d.day===workoutDayNum)||plan.days[0];
  const exPlan  = dayPlan.exercises.find(e=>e.key===key);
  const calEl   = document.getElementById(`cal_${key}`);
  if (calEl && exPlan) calEl.textContent = `~${getActualCalsBurned(key, exPlan.reps, prog.sets||0, prog.reps, ACTIVE_PROFILE?.weight||70)} kcal`;
}

function setExerciseSetsDirectly(key, rawVal) {
  const val = Math.max(0, Math.min(20, parseInt(rawVal) || 0));
  const log = getLog(STATE.currentDate);
  if (!log.workout.exerciseProgress) log.workout.exerciseProgress = {};
  if (!log.workout.exerciseProgress[key]) {
    const plan    = WORKOUT_PLANS.find(p=>p.id===STATE.workout.selectedVariation)||WORKOUT_PLANS[0];
    const dayPlan = plan.days.find(d=>d.day===workoutDayNum)||plan.days[0];
    const ex      = dayPlan.exercises.find(e=>e.key===key);
    log.workout.exerciseProgress[key] = { sets: ex ? ex.sets : 3, reps: parseInt(ex?.reps)||10, done: false };
  }
  const prog = log.workout.exerciseProgress[key];
  prog.sets = val;
  prog.done = val > 0;
  if (!log.workout.completedExercises) log.workout.completedExercises = [];
  const idx = log.workout.completedExercises.indexOf(key);
  if (prog.done && idx < 0) log.workout.completedExercises.push(key);
  if (!prog.done && idx >= 0) log.workout.completedExercises.splice(idx, 1);
  persistLogs(STATE.currentDate);
  // Sync input value to clamped result
  const setsEl = document.getElementById(`sets_${key}`);
  if (setsEl) setsEl.value = val;
  const card = document.getElementById(`ex_card_${key}`);
  if (card) { card.classList.toggle('completed', prog.done); card.classList.toggle('selected', prog.done); }
  const plan    = WORKOUT_PLANS.find(p=>p.id===STATE.workout.selectedVariation)||WORKOUT_PLANS[0];
  const dayPlan = plan.days.find(d=>d.day===workoutDayNum)||plan.days[0];
  const exPlan  = dayPlan.exercises.find(e=>e.key===key);
  const calEl   = document.getElementById(`cal_${key}`);
  if (calEl && exPlan) calEl.textContent = `~${getActualCalsBurned(key, exPlan.reps, val, prog.reps||parseInt(exPlan.reps)||10, ACTIVE_PROFILE?.weight||70)} kcal`;
  _updateWorkoutTotals();
  renderDashboard();
}

function setExerciseRepsDirectly(key, rawVal) {
  const val = Math.max(1, Math.min(200, parseInt(rawVal) || 1));
  const log = getLog(STATE.currentDate);
  if (!log.workout.exerciseProgress) log.workout.exerciseProgress = {};
  if (!log.workout.exerciseProgress[key]) {
    const plan    = WORKOUT_PLANS.find(p=>p.id===STATE.workout.selectedVariation)||WORKOUT_PLANS[0];
    const dayPlan = plan.days.find(d=>d.day===workoutDayNum)||plan.days[0];
    const ex      = dayPlan.exercises.find(e=>e.key===key);
    log.workout.exerciseProgress[key] = { sets: ex ? ex.sets : 3, reps: parseInt(ex?.reps)||10, done: false };
  }
  const prog = log.workout.exerciseProgress[key];
  prog.reps = val;
  persistLogs(STATE.currentDate);
  const repsEl = document.getElementById(`reps_${key}`);
  if (repsEl) repsEl.value = val;
  const plan    = WORKOUT_PLANS.find(p=>p.id===STATE.workout.selectedVariation)||WORKOUT_PLANS[0];
  const dayPlan = plan.days.find(d=>d.day===workoutDayNum)||plan.days[0];
  const exPlan  = dayPlan.exercises.find(e=>e.key===key);
  const calEl   = document.getElementById(`cal_${key}`);
  if (calEl && exPlan) calEl.textContent = `~${getActualCalsBurned(key, exPlan.reps, prog.sets||0, val, ACTIVE_PROFILE?.weight||70)} kcal`;
}

function _updateWorkoutTotals() {
  const log      = getLog(STATE.currentDate);
  const plan     = WORKOUT_PLANS.find(p=>p.id===STATE.workout.selectedVariation)||WORKOUT_PLANS[0];
  const dayPlan  = plan.days.find(d=>d.day===workoutDayNum)||plan.days[0];
  const customEx = log.workout.customExercises || [];
  const total    = dayPlan.exercises.length + customEx.length;
  const doneCnt  = Object.values(log.workout.exerciseProgress||{}).filter(p=>p.done).length
                   || (log.workout.completedExercises||[]).length;
  const doneCal  = workoutCalsBurned(STATE.currentDate);
  setText('workout_done_count',  doneCnt);
  setText('workout_total_count', total);
  setText('workout_cal_burned',  doneCal);
  setBar('workout_progress_bar', total>0 ? Math.round(doneCnt/total*100) : 0);
}

function getGoals() {
  const p = ACTIVE_PROFILE;
  if (!p) return { calories:2000, protein:150, carbs:250, fat:67, water:8 };
  const bmr  = calculateBMR(p.weight, p.height, p.age, p.gender);
  const tdee = calculateTDEE(bmr, p.activity);
  const cal  = calculateGoalCalories(tdee, p.goal);
  const mac  = calculateMacros(cal, p.weight, p.goal);
  return { calories:cal, protein:mac.protein, carbs:mac.carbs, fat:mac.fat, water:p.water||8 };
}

// ── AUTH STATE ────────────────────────────────────────────
let AUTH_USER_ID = null;

// ── AUTH FUNCTIONS ────────────────────────────────────────
async function signIn() {
  if (!supabaseClient) { _proceedAfterAuth(null); return; }
  const email    = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  const errEl    = document.getElementById('authError');
  errEl.textContent = ''; errEl.classList.remove('visible');
  if (!email || !password) {
    errEl.textContent = 'Please enter your email and password.';
    errEl.classList.add('visible'); return;
  }
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) { errEl.textContent = error.message; errEl.classList.add('visible'); return; }
    await _proceedAfterAuth(data.session);
  } catch(e) {
    errEl.textContent = 'Sign in failed. Check your connection.';
    errEl.classList.add('visible');
  }
}

async function signUp() {
  if (!supabaseClient) { _proceedAfterAuth(null); return; }
  const email    = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  const errEl    = document.getElementById('authError');
  errEl.textContent = ''; errEl.classList.remove('visible');
  if (!email || !password) {
    errEl.textContent = 'Please enter an email and password (min 6 chars).';
    errEl.classList.add('visible'); return;
  }
  if (password.length < 6) {
    errEl.textContent = 'Password must be at least 6 characters.';
    errEl.classList.add('visible'); return;
  }
  try {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) { errEl.textContent = error.message; errEl.classList.add('visible'); return; }
    // Auto sign-in after signup if session returned, else prompt email confirm
    if (data.session) {
      await _proceedAfterAuth(data.session);
    } else {
      errEl.textContent = 'Account created! Check your email to confirm, then sign in.';
      errEl.classList.add('visible');
      errEl.style.background = 'rgba(45,122,45,0.08)';
      errEl.style.borderColor = 'rgba(45,122,45,0.3)';
      errEl.style.color = 'var(--success)';
    }
  } catch(e) {
    errEl.textContent = 'Sign up failed. Check your connection.';
    errEl.classList.add('visible');
  }
}

async function sendMagicLink() {
  if (!supabaseClient) { _proceedAfterAuth(null); return; }
  const email = document.getElementById('authEmail').value.trim();
  const errEl = document.getElementById('authError');
  errEl.textContent = ''; errEl.classList.remove('visible');
  if (!email) {
    errEl.textContent = 'Enter your email first.';
    errEl.classList.add('visible');
    return;
  }
  try {
    const { error } = await supabaseClient.auth.signInWithOtp({ email });
    if (error) throw error;
    errEl.textContent = '✓ Magic link sent! Check your email and tap the link on this device.';
    errEl.classList.add('visible');
    errEl.style.color = 'var(--success)';
  } catch(e) {
    errEl.textContent = 'Could not send magic link. Try again.';
    errEl.classList.add('visible');
  }
}
window.sendMagicLink = sendMagicLink;

async function signOut() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut().catch(() => {});
  }
  AUTH_USER_ID   = null;
  ACTIVE_PROFILE = null;
  LOG            = {};
  document.getElementById('authScreen').style.display = 'block';
  document.getElementById('profilePickerScreen').style.display = 'none';
  document.getElementById('setupScreen').style.display = 'none';
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
}

// Merge cloud profiles into local, deduplicating by ID and by name
function _mergeProfiles(local, cloudProfiles) {
  const seenIds   = new Set(local.map(p => p.id));
  const seenNames = new Set(local.map(p => p.name.trim().toLowerCase()));
  let changed = false;
  cloudProfiles.forEach(cp => {
    if (!cp?.id || !cp?.name) return;
    const nameKey = cp.name.trim().toLowerCase();
    if (!seenIds.has(cp.id) && !seenNames.has(nameKey)) {
      local.push(cp);
      seenIds.add(cp.id);
      seenNames.add(nameKey);
      changed = true;
    }
  });
  return changed;
}

async function _proceedAfterAuth(session) {
  AUTH_USER_ID = session?.user?.id || null;
  document.getElementById('authScreen').style.display = 'none';

  // Always pull cloud profiles and merge — no auth required (personal app, anon key)
  if (typeof pullProfilesFromCloud === 'function') {
    try {
      const cloudProfiles = await pullProfilesFromCloud(null);
      if (Array.isArray(cloudProfiles) && cloudProfiles.length > 0) {
        const local = getAllProfiles();
        if (_mergeProfiles(local, cloudProfiles)) saveAllProfiles(local);
      }
    } catch(e) { /* non-blocking */ }

    // Backfill: push any local-only profiles to cloud
    if (typeof syncProfileToCloud === 'function') {
      getAllProfiles().forEach(p => syncProfileToCloud(p).catch(() => {}));
    }
  }

  const profiles = getAllProfiles();
  const activeId = getActiveProfileId();

  if (profiles.length === 0) {
    if (AUTH_USER_ID) {
      // Authenticated but no profiles — show sync screen before setup
      document.getElementById('syncScreen').style.display = 'block';
    } else {
      showSetup();
    }
  } else if (profiles.length === 1) {
    // Only one profile — activate it directly (no picker needed)
    activateProfile(activeId || profiles[0].id);
  } else if (activeId && profiles.find(p => p.id === activeId)) {
    // Multiple profiles, but one was last active on this device — go straight in
    activateProfile(activeId);
  } else {
    showProfilePicker();
  }
}

// Re-attempt cloud sync — used by the sync screen and the profile menu button
async function retrySyncProfiles() {
  // Hide sync screen while retrying
  const syncScreen = document.getElementById('syncScreen');
  const retryBtn   = document.getElementById('syncRetryBtn');
  if (retryBtn) { retryBtn.textContent = '↻ Syncing…'; retryBtn.disabled = true; }

  try {
    if (typeof pullProfilesFromCloud === 'function') {
      const cloudProfiles = await pullProfilesFromCloud(null);
      if (Array.isArray(cloudProfiles) && cloudProfiles.length > 0) {
        const local = getAllProfiles();
        if (_mergeProfiles(local, cloudProfiles)) saveAllProfiles(local);
      }
    }
  } catch(e) { /* non-blocking */ }

  if (syncScreen) syncScreen.style.display = 'none';
  if (retryBtn)   { retryBtn.textContent = '↻ Sync Profiles from Cloud'; retryBtn.disabled = false; }

  const profiles = getAllProfiles();
  const activeId = getActiveProfileId();
  if (profiles.length === 0) {
    showToast('No profiles found in cloud. Please set up a new profile.', '');
    showSetup();
  } else if (profiles.length === 1) {
    activateProfile(activeId || profiles[0].id);
  } else {
    showProfilePicker();
  }
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // No login screen — personal app, sync via anon Supabase key
  await _proceedAfterAuth(null);
});

async function activateProfile(id) {
  ACTIVE_PROFILE = getProfile(id);
  window.ACTIVE_PROFILE = ACTIVE_PROFILE; // expose for recipes.js
  if (!ACTIVE_PROFILE) { showProfilePicker(); return; }
  setActiveProfileId(id);
  LOG = loadLogs(id);
  const wk = loadWkState(id);
  if (wk.selectedVariation) STATE.workout.selectedVariation = wk.selectedVariation;
  if (wk.enrolledPlanId)    STATE.workout.enrolledPlanId    = wk.enrolledPlanId;
  if (wk.enrolledDay)       STATE.workout.enrolledDay       = wk.enrolledDay;
  // Hide all overlays
  document.getElementById('profilePickerScreen').style.display = 'none';
  document.getElementById('setupScreen').style.display = 'none';
  // Pull from cloud and merge (non-blocking — app loads immediately)
  // Cloud always wins: this device may be fresh with no local data
  if (typeof pullLogsFromCloud === 'function') {
    pullLogsFromCloud(id).then(cloudLogs => {
      if (cloudLogs && typeof cloudLogs === 'object' && Object.keys(cloudLogs).length > 0) {
        Object.assign(LOG, cloudLogs);
        saveLogs(id, LOG);
        switchSection(STATE.activeSection);
      }
    }).catch(()=>{});
  }
  initApp();
}

function initApp() {
  renderNav();
  renderAllDateNavs();
  switchSection('dashboard');
  setupEventListeners();
  startLiveSyncPoll();          // begin 5-second live sync
}

async function refreshApp() {
  if (!ACTIVE_PROFILE) {
    // No profile loaded — re-trigger the auth/profile loading flow
    showToast('Refreshing…', '');
    switchSection(STATE.activeSection);
    return;
  }
  const logo = document.querySelector('.nav-logo');
  if (logo) { logo.style.opacity = '0.5'; logo.style.pointerEvents = 'none'; }

  try {
    // Pull fresh logs from cloud
    if (typeof pullLogsFromCloud === 'function') {
      const cloudLogs = await pullLogsFromCloud(ACTIVE_PROFILE.id);
      if (cloudLogs && typeof cloudLogs === 'object') {
        Object.keys(cloudLogs).forEach(date => {
          if (!LOG[date]) LOG[date] = cloudLogs[date];
          else LOG[date] = cloudLogs[date]; // cloud wins on refresh
        });
        saveLogs(ACTIVE_PROFILE.id, LOG);
      }
    }
    // Pull fresh profiles from cloud
    if (typeof pullProfilesFromCloud === 'function') {
      const cloudProfiles = await pullProfilesFromCloud(null);
      if (Array.isArray(cloudProfiles) && cloudProfiles.length > 0) {
        const local = getAllProfiles();
        if (_mergeProfiles(local, cloudProfiles)) saveAllProfiles(local);
      }
    }
    showToast('Data synced ✓', 'success');
  } catch(e) {
    showToast('Sync failed — check connection', '');
  } finally {
    if (logo) { logo.style.opacity = ''; logo.style.pointerEvents = ''; }
  }

  // Re-render current section with fresh data
  switchSection(STATE.activeSection);
}

// ── PROFILE PICKER ─────────────────────────────────────────
function showProfilePicker() {
  document.getElementById('profilePickerScreen').style.display = 'flex';
  document.getElementById('setupScreen').style.display = 'none';
  renderProfileList();
}

function renderProfileList() {
  const profiles = getAllProfiles();
  const container = document.getElementById('profileList');
  if (!container) return;
  const goalShort = g => {
    const map = { aggressive_loss:'Cut', loss:'Lose', maintain:'Maintain', recomp:'Recomp', gain:'Build', aggressive_gain:'Bulk' };
    return map[g] || (g||'').replace('_',' ');
  };
  const profileCards = profiles.map(p => `
    <div class="profile-card" onclick="activateProfile('${p.id}')">
      <div class="profile-avatar" style="background:${p.avatarColor||'var(--accent)'}">
        ${p.name.charAt(0).toUpperCase()}
      </div>
      <div class="profile-info">
        <div class="profile-name">${p.name}</div>
        <div class="profile-meta">${goalShort(p.goal)} · ${p.weight}kg · ${p.age}y</div>
      </div>
    </div>
  `).join('');
  const addCard = `
    <div class="profile-card-add" onclick="showSetup(true)">
      <div class="profile-add-avatar">＋</div>
      <div class="profile-add-label">Add Profile</div>
    </div>
  `;
  container.innerHTML = profileCards + addCard;
}

// ── SETUP FLOW ─────────────────────────────────────────────
let setupData = {};
let setupStep = 1;
const SETUP_TOTAL = 3;
const AVATAR_COLORS = ['#c0392b','#1e3a5f','#2d7a2d','#8b5e3c','#5d3a7a','#c87d0e','#2980b9'];

function showSetup(isAdditional = false) {
  setupData = { isAdditional };
  setupStep = 1;
  document.getElementById('setupScreen').style.display = 'block';
  document.getElementById('profilePickerScreen').style.display = 'none';
  renderSetupStep(1);
}

function renderSetupStep(step) {
  setupStep = step;
  document.querySelectorAll('.setup-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`setup-step-${step}`)?.classList.add('active');
  const fill = document.getElementById('setupProgressFill');
  if (fill) fill.style.width = `${(step/SETUP_TOTAL)*100}%`;
}

function clearSetupErrors(step) {
  const err = document.getElementById(`setupError${step}`);
  if (err) { err.textContent = ''; err.classList.remove('visible'); }
  document.querySelectorAll('.form-input.invalid, .form-select.invalid').forEach(el => el.classList.remove('invalid'));
}
function showSetupError(step, msg, ...fieldIds) {
  const err = document.getElementById(`setupError${step}`);
  if (err) { err.textContent = msg; err.classList.add('visible'); }
  fieldIds.forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('invalid'); });
}

function setupNext() {
  if (setupStep === 1) {
    clearSetupErrors(1);
    const name   = document.getElementById('s_name').value.trim();
    const age    = parseInt(document.getElementById('s_age').value);
    const gender = document.getElementById('s_gender').value;
    const height = parseFloat(document.getElementById('s_height').value);
    const weight = parseFloat(document.getElementById('s_weight').value);
    const missing = [];
    if (!name)   missing.push('s_name');
    if (!age)    missing.push('s_age');
    if (!gender) missing.push('s_gender');
    if (!height) missing.push('s_height');
    if (!weight) missing.push('s_weight');
    if (missing.length > 0) {
      showSetupError(1, 'Please fill in all fields to continue.', ...missing);
      return;
    }
    setupData = { ...setupData, name, age, gender, height, weight };
    renderSetupStep(2);
  } else if (setupStep === 2) {
    clearSetupErrors(2);
    if (!setupData.goal) {
      showSetupError(2, 'Please select a goal to continue.');
      return;
    }
    const activity = document.getElementById('s_activity').value;
    const water    = parseInt(document.getElementById('s_water').value)||8;
    setupData.activity = activity;
    setupData.water    = water;
    renderSetupStep(3);
    // Show preview
    const bmr  = calculateBMR(setupData.weight,setupData.height,setupData.age,setupData.gender);
    const tdee = calculateTDEE(bmr, activity);
    const cal  = calculateGoalCalories(tdee, setupData.goal);
    const mac  = calculateMacros(cal, setupData.weight, setupData.goal);
    const bmi  = calculateBMI(setupData.weight, setupData.height);
    const bmiCat = getBMICategory(bmi);
    setText('preview_cal', cal);
    setText('preview_pro', mac.protein+'g');
    setText('preview_carb', mac.carbs+'g');
    setText('preview_fat', mac.fat+'g');
    setText('preview_bmi', bmi);
    setText('preview_bmicat', bmiCat.label);
    setText('preview_bmr', bmr);
    setText('preview_tdee', tdee);
  }
}

function selectGoal(goal) {
  setupData.goal = goal;
  document.querySelectorAll('.goal-option').forEach(o => o.classList.remove('selected'));
  document.querySelector(`.goal-option[data-goal="${goal}"]`)?.classList.add('selected');
}

function finishSetup() {
  const id = generateId();
  const color = AVATAR_COLORS[getAllProfiles().length % AVATAR_COLORS.length];
  const profile = { id, avatarColor: color, ...setupData };
  delete profile.isAdditional;
  saveProfile(profile);
  ACTIVE_PROFILE = profile;
  window.ACTIVE_PROFILE = ACTIVE_PROFILE; // keep in sync for recipes.js
  setActiveProfileId(id);
  LOG = {};
  persistLogs(STATE.currentDate);
  const wk = { selectedVariation: 1 };
  saveWkState(id, wk);
  STATE.workout.selectedVariation = 1;
  document.getElementById('setupScreen').style.display = 'none';
  initApp();
  showToast(`Welcome, ${profile.name.split(' ')[0]}! 💪`, 'success');
}

// ── NAV ───────────────────────────────────────────────────
function renderNav() {
  const p = ACTIVE_PROFILE;
  const btn = document.getElementById('profileBtn');
  if (btn) {
    btn.textContent = p ? p.name.charAt(0).toUpperCase() : '?';
    btn.style.background = p?.avatarColor || 'var(--accent)';
  }
}

function renderAllDateNavs() {
  const onToday = isToday(STATE.currentDate);
  document.querySelectorAll('.date-display').forEach(el => {
    el.textContent = formatDate(STATE.currentDate);
  });
  document.querySelectorAll('.date-today-btn').forEach(btn => {
    btn.style.display = onToday ? '' : 'none';
  });
}

// ── SYNC INDICATOR ────────────────────────────────────────
function _setSyncDot(state) {
  // state: 'syncing' | 'ok' | 'idle'
  document.querySelectorAll('.sync-dot').forEach(dot => {
    dot.setAttribute('data-state', state);
    dot.title = state === 'syncing' ? 'Syncing…'
               : state === 'ok'      ? `Synced ${new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}`
               : 'Live sync active';
  });
}

function switchSection(name) {
  STATE.activeSection = name;
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById(`section-${name}`)?.classList.add('active');
  document.querySelector(`.bottom-nav-item[data-section="${name}"]`)?.classList.add('active');
  if (name==='dashboard') renderDashboard();
  if (name==='diet')      { renderDiet(); renderAllTemplateButtons(); }
  if (name==='bmi')       { renderBMI(); renderTodayPhoto(); renderPhotoGallery(); }
  if (name==='workout') {
    // If user has an enrolled plan, jump directly to their current day
    if (STATE.workout.enrolledPlanId && workoutView === 'plans') {
      STATE.workout.selectedVariation = STATE.workout.enrolledPlanId;
      workoutDayNum = STATE.workout.enrolledDay || 1;
      workoutView   = 'day';
    }
    renderWorkout();
  }
  if (name==='habits')    renderHabits();
  if (name==='recipes')   renderRecipes();
}

// ── DASHBOARD ─────────────────────────────────────────────
function renderDashboard() {
  const p      = ACTIVE_PROFILE;
  const goals  = getGoals();
  const totals = logTotals(STATE.currentDate);
  const burned = workoutCalsBurned(STATE.currentDate);
  const log    = getLog(STATE.currentDate);
  const net    = Math.max(0, totals.cal - burned);
  const remaining = Math.max(0, goals.calories - net);

  setText('dash_greeting', `Hello, ${p?.name?.split(' ')[0] || 'Athlete'}.`);
  setText('dash_sub', isToday(STATE.currentDate) ? "Here's where you stand today." : `Summary for ${formatDate(STATE.currentDate)}`);

  // Calorie ring
  const pct    = Math.min(1, net / goals.calories);
  const RADIUS = 42, CIRC = 2*Math.PI*RADIUS;
  const ring   = document.getElementById('calRingPath');
  if (ring) {
    ring.setAttribute('stroke-dasharray', CIRC);
    ring.setAttribute('stroke-dashoffset', CIRC*(1-pct));
    ring.setAttribute('stroke', net > goals.calories ? '#e74c3c' : ACTIVE_PROFILE?.avatarColor || '#c0392b');
  }
  setText('dash_cal_num',  net);
  setText('dash_consumed', totals.cal);
  setText('dash_burned',   burned);
  setText('dash_remaining',remaining);

  ['protein','carbs','fat'].forEach(m => {
    const val  = m==='protein' ? totals.pro : m==='carbs' ? totals.carb : totals.fat;
    const goal = goals[m] || 1;
    setBar(`dash_bar_${m}`, Math.min(100,Math.round(val/goal*100)));
    setText(`dash_lbl_${m}`, `${val}g / ${goal}g`);
  });

  const waterPct = Math.min(100, Math.round((log.water/goals.water)*100));
  setBar('dash_water_bar', waterPct);
  setText('dash_water_val', `${log.water} / ${goals.water} glasses`);

  // Workout status — show enrolled plan's current day if enrolled
  const enrolledId   = STATE.workout.enrolledPlanId;
  const displayPlanId = enrolledId || STATE.workout.selectedVariation;
  const plan    = WORKOUT_PLANS.find(p=>p.id===displayPlanId)||WORKOUT_PLANS[0];
  const dayN    = enrolledId ? (STATE.workout.enrolledDay || 1) : (log.workout.activeDay||1);
  const dayPlan = plan.days.find(d=>d.day===dayN)||plan.days[0];
  const customEx   = (log.workout.customExercises||[]);
  const removedSet = new Set(log.workout.removedExercises||[]);
  const done    = Object.values(log.workout.exerciseProgress||{}).filter(p=>p.done).length
                  || (log.workout.completedExercises||[]).length;
  const total   = dayPlan.exercises.filter(e=>!removedSet.has(e.key)).length + customEx.length;
  setText('dash_workout_name', enrolledId ? `${plan.shortName} · Day ${dayN} ✓ Enrolled` : `${plan.shortName} · Day ${dayN}`);
  setText('dash_workout_day',  dayPlan.name);
  setText('dash_workout_prog', `${done}/${total} exercises`);
  setBar('dash_workout_bar', total>0 ? Math.round(done/total*100) : 0);

  // Enroll nudge — show if not enrolled
  const enrollNudge = document.getElementById('dash_enroll_nudge');
  if (enrollNudge) enrollNudge.style.display = enrolledId ? 'none' : 'block';

  renderStreaks();
  renderWeightDash();
  renderWeeklySummary();
  renderMeasurementsDash();
}

function renderStreaks() {
  const goals = getGoals();
  // Logging streak — consecutive days with any food logged
  let logStreak = 0, d = STATE.currentDate;
  for (let i=0;i<365;i++) {
    const l = LOG[d];
    if (l && Object.values(l.meals).flat().length>0) { logStreak++; d=offsetDate(d,-1); }
    else break;
  }
  setText('streak_log', logStreak);

  // Workout streak — consecutive days with ≥1 exercise done
  let wkStreak = 0; d = STATE.currentDate;
  for (let i=0;i<365;i++) {
    const l = LOG[d];
    const done = l ? (Object.values(l.workout?.exerciseProgress||{}).filter(p=>p.done).length
                      || (l.workout?.completedExercises||[]).length) : 0;
    if (done > 0) { wkStreak++; d=offsetDate(d,-1); }
    else break;
  }
  setText('streak_workout', wkStreak);

  // Protein streak — consecutive days hitting ≥90% protein goal
  let proStreak = 0; d = STATE.currentDate;
  for (let i=0;i<365;i++) {
    const l = LOG[d];
    if (l) {
      const t = logTotals(d);
      if (t.pro >= goals.protein * 0.9) { proStreak++; d=offsetDate(d,-1); }
      else break;
    } else break;
  }
  setText('streak_protein', proStreak);
}

// ── QUICK-ADD (one-tap food log without opening search modal) ─
function quickAddFood(foodId, meal) {
  const food = FOODS.find(f => f.id === foodId);
  if (!food) return;
  const log = getLog(STATE.currentDate);
  if (!log.meals[meal]) log.meals[meal] = [];
  log.meals[meal].push({ ...food, qty: 1 });
  persistLogs(STATE.currentDate);
  renderDiet();
  renderDashboard();
  showToast(`${food.emoji || ''} ${food.name} added to ${meal} ✓`, 'success');
}

function quickAddCombo(foodIds, meal, label) {
  const log = getLog(STATE.currentDate);
  if (!log.meals[meal]) log.meals[meal] = [];
  let added = 0;
  foodIds.forEach(id => {
    const food = FOODS.find(f => f.id === id);
    if (!food) return;
    log.meals[meal].push({ ...food, qty: 1 });
    added++;
  });
  if (!added) return;
  persistLogs(STATE.currentDate);
  renderDiet();
  renderDashboard();
  showToast(`${label} added to ${meal} ✓`, 'success');
}
window.quickAddCombo = quickAddCombo;

// ── YOUTUBE PLAYER ────────────────────────────────────────
function playYouTube(key, videoId) {
  const wrap = document.getElementById(`video_${key}`);
  if (!wrap) return;
  // Replace thumbnail with live iframe (autoplay=1 so user gets instant playback)
  wrap.innerHTML = `<iframe
    src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1"
    allowfullscreen
    allow="autoplay; encrypted-media"
    loading="lazy"
    style="width:100%;height:100%;border:none"
  ></iframe>`;
}

// ── DIET ──────────────────────────────────────────────────
let dietActiveSearch = null;

function renderDiet() {
  const goals  = getGoals();
  const totals = logTotals(STATE.currentDate);

  setBar('diet_cal_bar',  Math.min(100,Math.round(totals.cal/goals.calories*100)));
  setBar('diet_pro_bar',  Math.min(100,Math.round(totals.pro/goals.protein*100)));
  setBar('diet_carb_bar', Math.min(100,Math.round(totals.carb/goals.carbs*100)));
  setBar('diet_fat_bar',  Math.min(100,Math.round(totals.fat/goals.fat*100)));

  setText('diet_cal_val',  `${totals.cal} / ${goals.calories} kcal`);
  setText('diet_pro_val',  `${totals.pro}g / ${goals.protein}g`);
  setText('diet_carb_val', `${totals.carb}g / ${goals.carbs}g`);
  setText('diet_fat_val',  `${totals.fat}g / ${goals.fat}g`);

  setText('chip_cal',  totals.cal);
  setText('chip_pro',  totals.pro+'g');
  setText('chip_carb', totals.carb+'g');
  setText('chip_fat',  totals.fat+'g');

  setText('micro_fiber',   totals.fiber+'g');
  setText('micro_sodium',  totals.sodium+'mg');
  setText('micro_calcium', totals.calcium+'mg');
  setText('micro_iron',    totals.iron+'mg');
  setText('micro_vitc',    totals.vitC+'mg');

  ['breakfast','lunch','dinner','snacks'].forEach(m => renderMealItems(m));

  const diff = totals.cal - goals.calories;
  const statusEl = document.getElementById('diet_status');
  if (statusEl) {
    statusEl.textContent = diff > 0
      ? `${diff} kcal over goal`
      : `${Math.abs(diff)} kcal remaining`;
    statusEl.className = `text-xs font-mono ${diff>0?'text-accent':'text-success'}`;
  }
}

function renderMealItems(meal) {
  const log   = getLog(STATE.currentDate);
  const items = log.meals[meal]||[];
  const container = document.getElementById(`meal_items_${meal}`);
  if (!container) return;
  if (items.length === 0) {
    container.innerHTML = `<div style="padding:0.75rem 1rem;font-size:0.8rem;color:var(--text-muted)">Nothing logged yet</div>`;
    return;
  }
  container.innerHTML = items.map((item,i) => `
    <div class="meal-item">
      <div class="meal-item-info">
        <div class="meal-item-name">${item.emoji||''} ${item.name}</div>
        <div class="meal-item-meta">
          <span class="qty-stepper">
            <button class="qty-btn" onclick="changeItemQty('${meal}',${i},-0.5)">−</button>
            <span class="qty-val">${+(item.qty||1)}×</span>
            <button class="qty-btn" onclick="changeItemQty('${meal}',${i},0.5)">+</button>
          </span>
          ${item.unit} · P:${Math.round((item.pro||0)*(item.qty||1))}g C:${Math.round((item.carb||0)*(item.qty||1))}g F:${Math.round((item.fat||0)*(item.qty||1))}g
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
        <span class="meal-item-cal">${Math.round((item.cal||0)*(item.qty||1))}</span>
        <button class="meal-item-remove" onclick="removeFood('${meal}',${i})">×</button>
      </div>
    </div>
  `).join('');
  const total = items.reduce((s,it) => s+(it.cal||0)*(it.qty||1), 0);
  const badge = document.getElementById(`meal_cal_${meal}`);
  if (badge) badge.textContent = Math.round(total)+' kcal';
}

function toggleMeal(meal) {
  const body = document.getElementById(`meal_body_${meal}`);
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
}

function closeFoodModal() {
  clearInterval(_foodSearchPoll); _foodSearchPoll = null;
  document.getElementById('foodSearchModal').classList.remove('open');
  document.getElementById('foodSearchInput').value = '';
  document.getElementById('foodSearchResults').innerHTML = '';
}

function openFoodSearch(meal) {
  dietActiveSearch = meal;
  const input = document.getElementById('foodSearchInput');
  if (input) input.value = '';
  document.getElementById('foodSearchResults').innerHTML = '';
  document.getElementById('foodSearchModal').classList.add('open');

  // Polling approach — bulletproof on iOS Safari where oninput can silently fail inside modals
  clearInterval(_foodSearchPoll);
  let _lastVal = '';
  _foodSearchPoll = setInterval(() => {
    const inp = document.getElementById('foodSearchInput');
    if (!inp) { clearInterval(_foodSearchPoll); return; }
    const v = inp.value;
    if (v !== _lastVal) { _lastVal = v; handleFoodSearch(v); }
  }, 150);

  setTimeout(() => document.getElementById('foodSearchInput')?.focus(), 150);
}

let pendingFood = null;
let _foodSearchPoll = null;

function handleFoodSearch(val) {
  const results    = searchFoods(val);
  const container  = document.getElementById('foodSearchResults');
  if (!val.trim()) { container.innerHTML=''; return; }
  if (results.length===0) {
    container.innerHTML='<div style="padding:1rem;text-align:center;color:var(--text-muted);font-size:0.85rem">No foods found</div>';
    return;
  }
  container.innerHTML = results.slice(0,30).map(f => `
    <div class="search-result-item" onclick="selectFood(${f.id})">
      <div>
        <div class="food-name">${f.emoji||''} ${f.name}</div>
        <div class="food-meta">${f.serving} ${f.unit} · P:${f.pro}g C:${f.carb}g F:${f.fat}g</div>
      </div>
      <span class="food-cal">${f.cal} kcal</span>
    </div>
  `).join('');
}

function selectFood(id) {
  pendingFood = FOODS.find(f => f.id===id);
  if (!pendingFood) return;
  document.getElementById('foodSearchModal').classList.remove('open');
  setText('qtyFoodName', `${pendingFood.emoji||''} ${pendingFood.name}`);
  setText('qtyFoodMeta', `${pendingFood.serving} ${pendingFood.unit} = ${pendingFood.cal} kcal`);
  document.getElementById('qtyValue').value = 1;
  setText('qtyCalPreview', pendingFood.cal);
  document.getElementById('qtyModal').classList.add('open');
}

function updateQtyPreview() {
  if (!pendingFood) return;
  const qty = parseFloat(document.getElementById('qtyValue').value)||1;
  setText('qtyCalPreview', Math.round(pendingFood.cal * qty));
}

function changeQty(delta) {
  const inp = document.getElementById('qtyValue');
  let val = (parseFloat(inp.value)||1) + delta;
  if (val < 0.5) val = 0.5;
  inp.value = +val.toFixed(1);
  updateQtyPreview();
}

function confirmAddFood() {
  if (!pendingFood || !dietActiveSearch) return;
  const qty  = parseFloat(document.getElementById('qtyValue').value)||1;
  const log  = getLog(STATE.currentDate);
  log.meals[dietActiveSearch].push({ ...pendingFood, qty });
  persistLogs(STATE.currentDate);
  document.getElementById('qtyModal').classList.remove('open');
  const added = pendingFood;
  pendingFood = null;
  renderDiet();
  renderDashboard();
  showToast(`Added ${added.name} ✓`, 'success');
}

function changeItemQty(meal, index, delta) {
  const log = getLog(STATE.currentDate);
  const item = log.meals[meal]?.[index];
  if (!item) return;
  const newQty = Math.max(0.5, +((item.qty||1) + delta).toFixed(1));
  item.qty = newQty;
  persistLogs(STATE.currentDate);
  renderMealItems(meal);
  renderDashboard();
}

function removeFood(meal, index) {
  const log = getLog(STATE.currentDate);
  log.meals[meal].splice(index, 1);
  persistLogs(STATE.currentDate);
  renderMealItems(meal);
  renderDiet();
  renderDashboard();
}

function addCustomFood() {
  const name  = document.getElementById('customFoodName').value.trim();
  const cal   = parseFloat(document.getElementById('customFoodCal').value)||0;
  const pro   = parseFloat(document.getElementById('customFoodPro').value)||0;
  const carb  = parseFloat(document.getElementById('customFoodCarb').value)||0;
  const fat   = parseFloat(document.getElementById('customFoodFat').value)||0;
  if (!name||!cal) { showToast('Name and calories required','error'); return; }
  const meal = dietActiveSearch || 'breakfast';
  const log  = getLog(STATE.currentDate);
  log.meals[meal].push({ id:Date.now(), name, cal, pro, carb, fat, fiber:0, sodium:0, calcium:0, iron:0, vitC:0, serving:1, unit:'serving', qty:1 });
  persistLogs(STATE.currentDate);
  document.getElementById('customFoodModal').classList.remove('open');
  ['customFoodName','customFoodCal','customFoodPro','customFoodCarb','customFoodFat'].forEach(id => {
    const el = document.getElementById(id); if(el) el.value='';
  });
  renderDiet();
  renderDashboard();
  showToast(`Added ${name} ✓`, 'success');
}

// ── WORKOUT ───────────────────────────────────────────────
let workoutView  = 'plans';
let workoutDayNum = 1;

function renderWorkout() {
  if (workoutView==='plans') renderWorkoutPlans();
  else renderWorkoutDay();
}

function renderWorkoutPlans() {
  document.getElementById('workout_plans_view').style.display = 'block';
  document.getElementById('workout_day_view').style.display   = 'none';

  const rec = getWorkoutRecommendation(ACTIVE_PROFILE);

  // Tips banner (shown once above the list)
  let tipsBanner = '';
  if (rec && rec.tips.length > 0) {
    tipsBanner = `
      <div class="rec-tips-card">
        <div class="rec-tips-title">💡 Personalised notes for you</div>
        ${rec.tips.map(t => `<div class="rec-tip-item">· ${t}</div>`).join('')}
      </div>`;
  }

  const enrolledId = STATE.workout.enrolledPlanId;

  const cards = WORKOUT_PLANS.map(plan => {
    const isActive   = STATE.workout.selectedVariation === plan.id;
    const isEnrolled = enrolledId === plan.id;
    const isRec      = rec && rec.planId === plan.id;
    const extraClass = isEnrolled ? 'enrolled' : isActive ? 'selected' : isRec ? 'recommended' : '';

    const recBanner = isRec && !isEnrolled ? `
      <div class="rec-banner">
        <span class="rec-star">★</span> Recommended for you
        <span class="rec-reason">${rec.reason}</span>
      </div>` : '';

    const enrolledBanner = isEnrolled ? `
      <div class="enrolled-banner">
        <span class="enrolled-star">✓</span> Enrolled — Day ${STATE.workout.enrolledDay || 1} of 6
        <span class="enrolled-sub">Workout auto-loads when you open the tab</span>
      </div>` : '';

    const actionButtons = isEnrolled
      ? `<div style="display:flex;gap:8px;margin-top:0.875rem">
           <button class="btn btn-primary btn-sm" style="flex:1"
             onclick="event.stopPropagation();openEnrolledDay()">
             Continue Day ${STATE.workout.enrolledDay || 1} →
           </button>
           <button class="btn btn-ghost btn-sm"
             onclick="event.stopPropagation();unenrollPlan()">
             Unenroll
           </button>
         </div>`
      : `<div style="display:flex;gap:8px;margin-top:0.875rem">
           <button class="btn btn-primary btn-sm" style="flex:1"
             onclick="event.stopPropagation();enrollPlan(${plan.id})">
             Enroll →
           </button>
           <button class="btn btn-ghost btn-sm"
             onclick="event.stopPropagation();workoutView='day';openVariationDay(${plan.id},1)">
             Preview
           </button>
         </div>`;

    return `
      <div class="variation-card ${extraClass}" onclick="selectVariation(${plan.id})">
        ${enrolledBanner}${recBanner}
        <div class="variation-header">
          <div>
            <div class="variation-title">${plan.name}</div>
            <div class="variation-level">${plan.level} · ${plan.goal}</div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-shrink:0">
            ${isEnrolled ? '<span class="variation-badge enrolled-badge">Enrolled</span>' : ''}
            ${isActive && !isEnrolled ? '<span class="variation-badge">Active</span>' : ''}
            ${isRec && !isActive && !isEnrolled ? '<span class="variation-badge rec-badge">Best fit</span>' : ''}
          </div>
        </div>
        <div class="variation-meta">
          <p class="variation-desc">${plan.description}</p>
          <div class="variation-days">
            ${plan.days.map(d => `<span class="day-pill ${isEnrolled && d.day === (STATE.workout.enrolledDay||1) ? 'active-day-pill' : ''}" style="color:${d.color};border-color:${d.color};background:${d.color}18">D${d.day}: ${d.name.split('—')[0].trim().split('–')[0].trim()}</span>`).join('')}
          </div>
          ${actionButtons}
        </div>
      </div>`;
  }).join('');

  document.getElementById('workout_variations').innerHTML = tipsBanner + cards;
}

function selectVariation(id) {
  STATE.workout.selectedVariation = id;
  saveWkState(ACTIVE_PROFILE.id, { selectedVariation: id });
  const log = getLog(STATE.currentDate);
  log.workout.variation = id;
  log.workout.completedExercises = [];
  persistLogs(STATE.currentDate);
  renderWorkoutPlans();
  showToast('Workout plan updated','success');
}

function openVariationDay(varId, dayNum) {
  workoutView   = 'day';
  if (varId) STATE.workout.selectedVariation = varId;
  workoutDayNum = dayNum || 1;
  const log = getLog(STATE.currentDate);
  log.workout.variation  = STATE.workout.selectedVariation;
  log.workout.activeDay  = workoutDayNum;
  persistLogs(STATE.currentDate);
  renderWorkoutDay();
}

function renderWorkoutDay() {
  document.getElementById('workout_plans_view').style.display='none';
  document.getElementById('workout_day_view').style.display='block';

  const plan    = WORKOUT_PLANS.find(p=>p.id===STATE.workout.selectedVariation)||WORKOUT_PLANS[0];
  const log     = getLog(STATE.currentDate);
  const completed = log.workout.completedExercises||[];
  const isEnrolled = STATE.workout.enrolledPlanId === plan.id;

  document.getElementById('workout_day_tabs').innerHTML = plan.days.map(d => {
    const isEnrolledDay = isEnrolled && d.day === (STATE.workout.enrolledDay || 1);
    return `<button class="tab-btn ${workoutDayNum===d.day?'active':''} ${isEnrolledDay?'enrolled-tab':''}" onclick="switchWorkoutDay(${d.day})">Day ${d.day}${isEnrolledDay?' ●':''}</button>`;
  }).join('');

  const dayPlan = plan.days.find(d=>d.day===workoutDayNum)||plan.days[0];
  setText('workout_day_title', dayPlan.name);
  setText('workout_day_focus', dayPlan.focus);
  setText('workout_plan_name_badge', plan.shortName);

  // Enrolled badge in header
  const enrolledBadgeEl = document.getElementById('workout_enrolled_badge');
  if (enrolledBadgeEl) {
    if (isEnrolled) {
      enrolledBadgeEl.textContent = `Enrolled · Day ${STATE.workout.enrolledDay || 1}`;
      enrolledBadgeEl.style.display = 'inline-flex';
    } else {
      enrolledBadgeEl.style.display = 'none';
    }
  }

  const removedExs = new Set(log.workout.removedExercises || []);

  function renderExCard(key, sets, reps, note, isCustom) {
    const exData = EXERCISES[key];
    if (!exData) return '';
    const exerciseProgress = log.workout.exerciseProgress || {};
    const prog     = exerciseProgress[key];
    const isSel    = prog ? prog.done : completed.includes(key);
    const doneSets = prog ? prog.sets : (isSel ? sets : 0);
    const doneReps = prog ? prog.reps : (parseInt(reps) || 10);
    const calsBurned = getActualCalsBurned(key, reps, doneSets, doneReps, ACTIVE_PROFILE?.weight||70);
    const customTag  = isCustom ? '<span class="custom-ex-tag">+Custom</span>' : '';
    const removeBtn  = `<button class="ex-remove-btn" onclick="event.stopPropagation();removeExercise('${key}',${isCustom})" title="Remove exercise">×</button>`;
    return `
    <div class="exercise-card ${isSel?'completed selected':''}" id="ex_card_${key}">
      <div class="exercise-header">
        <div class="exercise-info" onclick="toggleExerciseDetail('${key}')" style="cursor:pointer;flex:1">
          <div class="exercise-name">${exData.name} ${customTag}</div>
          <div class="exercise-meta">${exData.equipment}${note?' · '+note:''}</div>
        </div>
        <div class="reps-tracker" onclick="event.stopPropagation()">
          <span class="reps-planned">Plan: ${sets}×${reps}</span>
          <div class="reps-input-row">
            <label class="reps-label">Sets:</label>
            <button class="reps-btn" onclick="changeExerciseSets('${key}',-1)">−</button>
            <input class="reps-val-input" id="sets_${key}" type="number" min="0" max="20" value="${doneSets}"
              onchange="setExerciseSetsDirectly('${key}',this.value)"
              onblur="setExerciseSetsDirectly('${key}',this.value)">
            <button class="reps-btn" onclick="changeExerciseSets('${key}',1)">+</button>
          </div>
          <div class="reps-input-row">
            <label class="reps-label">Reps:</label>
            <button class="reps-btn" onclick="changeExerciseReps('${key}',-1)">−</button>
            <input class="reps-val-input" id="reps_${key}" type="number" min="1" max="200" value="${doneReps}"
              onchange="setExerciseRepsDirectly('${key}',this.value)"
              onblur="setExerciseRepsDirectly('${key}',this.value)">
            <button class="reps-btn" onclick="changeExerciseReps('${key}',1)">+</button>
          </div>
          <div class="reps-cals" id="cal_${key}">~${calsBurned} kcal</div>
        </div>
        ${removeBtn}
        <button class="exercise-expand-btn" onclick="toggleExerciseDetail('${key}')">▼</button>
      </div>
      <div class="exercise-detail" id="ex_detail_${key}">
        <div class="video-wrap" id="video_${key}">
          <img class="yt-thumb" src="https://img.youtube.com/vi/${exData.youtubeId}/hqdefault.jpg" alt="${exData.name}" loading="lazy">
          <button class="yt-play-btn" onclick="playYouTube('${key}','${exData.youtubeId}')" aria-label="Watch ${exData.name} on YouTube">▶</button>
        </div>
        <div class="form-tips">
          <h4>Form Cues</h4>
          ${exData.form.map((tip,i) => `<div class="form-tip-item"><span class="form-tip-num">${i+1}</span><span>${tip}</span></div>`).join('')}
        </div>
        <div class="exercise-tip-box">💡 ${exData.tips}</div>
      </div>
    </div>`;
  }

  const exerciseProgress = log.workout.exerciseProgress || {};
  // Filter out removed plan exercises
  const activePlanExs = dayPlan.exercises.filter(ex => !removedExs.has(ex.key));
  const planCards    = activePlanExs.map(ex => renderExCard(ex.key, ex.sets, ex.reps, ex.note, false)).join('');
  const customExs    = (log.workout.customExercises || []);
  const customCards  = customExs.map(ex => renderExCard(ex.key, ex.sets, ex.reps, ex.note, true)).join('');

  const addExBtn = `
    <button class="btn btn-ghost btn-sm add-ex-btn" onclick="openExerciseSearch()" style="width:100%;margin-top:0.5rem;border-style:dashed">
      + Add Exercise from Full Database
    </button>`;

  const totalExCount = activePlanExs.length + customExs.length;
  const doneCnt  = Object.values(exerciseProgress).filter(p=>p.done).length || completed.length;

  // Complete Day button (only show when enrolled and on enrolled day)
  const showCompleteBtn = isEnrolled && (workoutDayNum === (STATE.workout.enrolledDay || 1));
  const allDone = totalExCount > 0 && doneCnt >= totalExCount;
  const completeDayBtn = showCompleteBtn ? `
    <button class="btn ${allDone ? 'btn-primary' : 'btn-ghost'} complete-day-btn"
      onclick="completeDayAndAdvance()"
      style="width:100%;margin-top:1rem">
      ${allDone ? '🎉 Complete Day & Advance to Next →' : 'Mark Day Complete & Move On →'}
    </button>` : '';

  document.getElementById('workout_exercises').innerHTML = planCards + customCards + addExBtn + completeDayBtn;

  const doneCal = workoutCalsBurned(STATE.currentDate);
  setText('workout_done_count',  doneCnt);
  setText('workout_total_count', totalExCount);
  setText('workout_cal_burned',  doneCal);
  setBar('workout_progress_bar', totalExCount>0 ? Math.round(doneCnt/totalExCount*100) : 0);
}

function completeDayAndAdvance() {
  advanceEnrolledDay();
  workoutView = 'plans';
  renderWorkoutPlans();
}

function switchWorkoutDay(dayNum) {
  workoutDayNum = dayNum;
  const log = getLog(STATE.currentDate);
  log.workout.activeDay          = dayNum;
  log.workout.completedExercises = [];
  persistLogs(STATE.currentDate);
  renderWorkoutDay();
}

function toggleExerciseSelect(key) {
  const log = getLog(STATE.currentDate);
  if (!log.workout.completedExercises) log.workout.completedExercises=[];
  const idx = log.workout.completedExercises.indexOf(key);
  if (idx>=0) log.workout.completedExercises.splice(idx,1);
  else log.workout.completedExercises.push(key);
  persistLogs(STATE.currentDate);
  renderWorkoutDay();
  renderDashboard();
}

function toggleExerciseDetail(key) {
  document.getElementById(`ex_detail_${key}`)?.classList.toggle('open');
}

function backToPlans() {
  workoutView = 'plans';
  renderWorkoutPlans();
}

// ── ENROLLMENT ────────────────────────────────────────────
function enrollPlan(planId) {
  STATE.workout.enrolledPlanId    = planId;
  STATE.workout.enrolledDay       = 1;
  STATE.workout.selectedVariation = planId;
  _saveEnrollmentState();
  showToast('Enrolled! Your workout auto-loads from now on.', 'success');
  openEnrolledDay();
}

function unenrollPlan() {
  STATE.workout.enrolledPlanId = null;
  STATE.workout.enrolledDay    = 1;
  _saveEnrollmentState();
  workoutView = 'plans';
  showToast('Unenrolled from plan', 'info');
  renderWorkoutPlans();
}

function openEnrolledDay() {
  const planId = STATE.workout.enrolledPlanId;
  const day    = STATE.workout.enrolledDay || 1;
  if (!planId) { workoutView = 'plans'; renderWorkoutPlans(); return; }
  STATE.workout.selectedVariation = planId;
  workoutDayNum = day;
  workoutView   = 'day';
  const log = getLog(STATE.currentDate);
  log.workout.variation = planId;
  log.workout.activeDay = day;
  persistLogs(STATE.currentDate);
  renderWorkoutDay();
}

function advanceEnrolledDay() {
  if (!STATE.workout.enrolledPlanId) return;
  const plan    = WORKOUT_PLANS.find(p => p.id === STATE.workout.enrolledPlanId);
  if (!plan) return;
  const maxDay  = plan.days.length;
  const nextDay = (STATE.workout.enrolledDay >= maxDay) ? 1 : STATE.workout.enrolledDay + 1;
  STATE.workout.enrolledDay = nextDay;
  _saveEnrollmentState();
  showToast(`Day complete! Next: Day ${nextDay} — ${plan.days.find(d=>d.day===nextDay)?.name || ''}`, 'success');
  renderDashboard();
}

function _saveEnrollmentState() {
  const wk = loadWkState(ACTIVE_PROFILE.id);
  wk.enrolledPlanId = STATE.workout.enrolledPlanId;
  wk.enrolledDay    = STATE.workout.enrolledDay;
  if (STATE.workout.selectedVariation) wk.selectedVariation = STATE.workout.selectedVariation;
  saveWkState(ACTIVE_PROFILE.id, wk);
}

// ── CUSTOM EXERCISE SEARCH ────────────────────────────────
let exSearchQuery = '';

function openExerciseSearch() {
  document.getElementById('exerciseSearchModal').classList.add('open');
  const inp = document.getElementById('exSearchInput');
  if (inp) { inp.value = ''; inp.focus(); }
  renderExerciseSearchResults('');
}

function closeExerciseSearch() {
  document.getElementById('exerciseSearchModal').classList.remove('open');
}

function onExSearchInput(val) {
  exSearchQuery = val;
  renderExerciseSearchResults(val);
}

function renderExerciseSearchResults(query) {
  const container = document.getElementById('exSearchResults');
  if (!container) return;
  const q = (query || '').toLowerCase().trim();

  // Get keys already in today's day (plan + custom), minus any the user removed
  const log = getLog(STATE.currentDate);
  const plan    = WORKOUT_PLANS.find(p => p.id === STATE.workout.selectedVariation) || WORKOUT_PLANS[0];
  const dayPlan = plan.days.find(d => d.day === workoutDayNum) || plan.days[0];
  const removed = new Set(log.workout.removedExercises || []);
  // Plan exercises still active (not removed)
  const planKeys = new Set(dayPlan.exercises.filter(e => !removed.has(e.key)).map(e => e.key));
  const customKeys = new Set((log.workout.customExercises || []).map(e => e.key));

  const results = Object.entries(EXERCISES).filter(([key, ex]) => {
    if (!q) return true;
    return ex.name.toLowerCase().includes(q)
        || ex.muscle.toLowerCase().includes(q)
        || ex.equipment.toLowerCase().includes(q);
  }).slice(0, 30);

  if (results.length === 0) {
    container.innerHTML = `<div class="ex-search-empty">No exercises found for "${query}"</div>`;
    return;
  }

  container.innerHTML = results.map(([key, ex]) => {
    const alreadyIn = planKeys.has(key) || customKeys.has(key);
    const muscleCol = getMuscleColor(ex.muscle);
    return `
      <div class="ex-search-item ${alreadyIn ? 'ex-search-added' : ''}" onclick="${alreadyIn ? '' : `addCustomExercise('${key}')`}">
        <div class="ex-search-info">
          <div class="ex-search-name">${ex.name}</div>
          <div class="ex-search-meta" style="color:${muscleCol}">${ex.muscle} · ${ex.equipment}</div>
        </div>
        <div class="ex-search-action">
          ${alreadyIn
            ? `<span class="ex-search-done">✓ Added</span>`
            : `<button class="btn btn-primary btn-xs">+ Add</button>`}
        </div>
      </div>`;
  }).join('');
}

function filterExSearch(btn, muscle) {
  document.querySelectorAll('.ex-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const inp = document.getElementById('exSearchInput');
  if (inp) inp.value = '';
  exSearchQuery = muscle;
  renderExerciseSearchResults(muscle);
}

function addCustomExercise(key) {
  const exData = EXERCISES[key];
  if (!exData) return;
  const log = getLog(STATE.currentDate);
  if (!log.workout.customExercises) log.workout.customExercises = [];
  // Avoid duplicates
  if (log.workout.customExercises.some(e => e.key === key)) return;
  log.workout.customExercises.push({ key, sets: 3, reps: 10, note: 'Custom' });
  persistLogs(STATE.currentDate);
  showToast(`${exData.name} added to today's workout`, 'success');
  // Update search results to mark as added
  renderExerciseSearchResults(exSearchQuery);
  // Re-render exercises list in background
  renderWorkoutDay();
}

function removeExercise(key, isCustom) {
  const log = getLog(STATE.currentDate);
  if (isCustom) {
    // Remove from custom list
    log.workout.customExercises = (log.workout.customExercises || []).filter(e => e.key !== key);
  } else {
    // Mark plan exercise as removed for today
    if (!log.workout.removedExercises) log.workout.removedExercises = [];
    if (!log.workout.removedExercises.includes(key)) log.workout.removedExercises.push(key);
  }
  // Clear any tracked progress for this exercise
  if (log.workout.exerciseProgress) delete log.workout.exerciseProgress[key];
  persistLogs(STATE.currentDate);
  renderWorkoutDay();
}

// Keep old name as alias so any cached HTML calling it still works
function removeCustomExercise(key) { removeExercise(key, true); }

function getMuscleColor(muscle) {
  const m = { Chest:'#c0392b', Back:'#1e3a5f', Shoulders:'#8b5e3c', Arms:'#2d7a2d', Legs:'#5d3a7a', Core:'#c87d0e', 'Full Body':'#1a1a1a' };
  return m[muscle]||'#888';
}

// ── BMI & GOALS ────────────────────────────────────────────
function renderBMI() {
  const p = ACTIVE_PROFILE;
  if (!p) return;
  const bmi    = calculateBMI(p.weight, p.height);
  const bmiCat = getBMICategory(bmi);
  const bmr    = calculateBMR(p.weight, p.height, p.age, p.gender);
  const tdee   = calculateTDEE(bmr, p.activity);
  const goals  = getGoals();

  setText('bmi_number', bmi);
  setText('bmi_cat_label', bmiCat.label);
  const catEl = document.getElementById('bmi_cat_label');
  if (catEl) catEl.style.color = bmiCat.color;

  const scaleEl = document.getElementById('bmi_scale_marker');
  if (scaleEl) {
    const pct = Math.min(100, Math.max(0, ((bmi-15)/25)*100));
    scaleEl.style.left = pct+'%';
    scaleEl.style.backgroundColor = bmiCat.color;
  }

  setText('met_height', p.height+' cm');
  setText('met_weight', p.weight+' kg');
  setText('met_age',    p.age+' yrs');
  setText('met_gender', p.gender.charAt(0).toUpperCase()+p.gender.slice(1));
  const h = p.height/100;
  setText('met_ideal_wt', `${+(18.5*h*h).toFixed(1)}–${+(24.9*h*h).toFixed(1)} kg`);
  setText('met_bmr',  bmr+' kcal');
  setText('met_tdee', tdee+' kcal');
  setText('met_goal_cal',  goals.calories+' kcal');
  setText('met_goal_pro',  goals.protein+'g');
  setText('met_goal_carb', goals.carbs+'g');
  setText('met_goal_fat',  goals.fat+'g');

  // pre-fill update form
  document.getElementById('edit_height').value   = p.height;
  document.getElementById('edit_weight').value   = p.weight;
  document.getElementById('edit_goal').value     = p.goal;
  document.getElementById('edit_activity').value = p.activity;

  renderWeightLog();
}

function updateProfile() {
  const h = parseFloat(document.getElementById('edit_height').value);
  const w = parseFloat(document.getElementById('edit_weight').value);
  const goal     = document.getElementById('edit_goal').value;
  const activity = document.getElementById('edit_activity').value;
  if (!h||!w) { showToast('Enter height and weight','error'); return; }
  const log = getLog(STATE.currentDate);
  log.weight = w;
  ACTIVE_PROFILE = { ...ACTIVE_PROFILE, height:h, weight:w, goal, activity };
  saveProfile(ACTIVE_PROFILE);
  persistLogs(STATE.currentDate);
  document.getElementById('updateProfileModal').classList.remove('open');
  renderBMI();
  renderDashboard();
  showToast('Profile updated ✓','success');
}

function renderWeightLog() {
  const entries = Object.entries(LOG).filter(([,l])=>l.weight).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,10);
  const container = document.getElementById('weight_log_list');
  if (!container) return;
  if (entries.length===0) { container.innerHTML='<div style="padding:1rem;font-size:0.8rem;color:var(--text-muted)">No weight entries yet. Update your weight daily for trend tracking.</div>'; return; }
  container.innerHTML = entries.map(([date,log],i) => {
    const prev = entries[i+1];
    let trend = '';
    if (prev&&prev[1].weight) {
      const diff = +(log.weight-prev[1].weight).toFixed(1);
      if (diff!==0) trend = `<span class="weight-trend ${diff<0?'down':'up'}">${diff>0?'+':''}${diff} kg</span>`;
    }
    return `<div class="weight-log-item">
      <span class="weight-log-date">${formatDate(date)}</span>
      <div style="display:flex;align-items:center;gap:8px">${trend}<span class="weight-log-val">${log.weight} kg</span></div>
    </div>`;
  }).join('');
}

// ── HABITS ────────────────────────────────────────────────
function renderHabits() {
  const log = getLog(STATE.currentDate);
  renderHabitDots('water',   log.water,   12, 'filled-water');
  renderHabitDots('smoke',   log.smoke,   20, 'filled-smoke');
  renderHabitDots('alcohol', log.alcohol, 10, 'filled-alco');
  setText('water_count',   log.water);
  setText('smoke_count',   log.smoke);
  setText('alcohol_count', log.alcohol);
  updateHabitMessages();
}

function renderHabitDots(type, count, max, fillClass) {
  const dots = document.getElementById(`${type}_dots`);
  if (!dots) return;
  dots.innerHTML = Array.from({length:max},(_,i) =>
    `<div class="habit-dot ${i<count?fillClass:''}"></div>`
  ).join('');
}

function updateHabitMessages() {
  const log   = getLog(STATE.currentDate);
  const goals = getGoals();
  const wn = document.getElementById('water_note');
  if (wn) {
    const rem = goals.water - log.water;
    wn.textContent = rem<=0 ? `🎯 Goal reached! ${log.water} glasses today.` : `${rem} more glasses to hit your goal of ${goals.water}.`;
    wn.className = `habit-note ${rem<=0?'success':''}`;
  }
  const sn = document.getElementById('smoke_note');
  if (sn) {
    sn.textContent = log.smoke===0 ? '✅ Smoke-free today. Keep it up.' : log.smoke<=5 ? `${log.smoke} cigarettes. Each avoided = 11 minutes added to your life.` : `${log.smoke} cigarettes today. 1 pack/day shortens lifespan by ~10 years on average.`;
    sn.className = `habit-note ${log.smoke===0?'success':log.smoke>5?'danger':''}`;
  }
  const an = document.getElementById('alcohol_note');
  if (an) {
    an.textContent = log.alcohol===0 ? '✅ Alcohol-free today.' : log.alcohol<=2 ? `${log.alcohol} unit(s) — within moderate range.` : log.alcohol<=4 ? `${log.alcohol} units — above moderate limit.` : `${log.alcohol} units — disrupts sleep, recovery, and testosterone for 48–72h.`;
    an.className = `habit-note ${log.alcohol===0?'success':log.alcohol>4?'danger':''}`;
  }
}

function changeHabit(type, delta) {
  const log = getLog(STATE.currentDate);
  log[type] = Math.max(0, (log[type]||0)+delta);
  persistLogs(STATE.currentDate);
  renderHabits();
  renderDashboard();
  if (type==='water'&&delta>0) showToast('Hydration logged 💧');
}

// ── DATE NAVIGATION ────────────────────────────────────────
function changeDate(delta) {
  STATE.currentDate = offsetDate(STATE.currentDate, delta);
  renderAllDateNavs();
  switchSection(STATE.activeSection);
  syncCurrentDateFromCloud();   // fetch fresh data for newly selected date
}
function goToToday() {
  STATE.currentDate = todayStr();
  renderAllDateNavs();
  switchSection(STATE.activeSection);
  syncCurrentDateFromCloud();
}

// ── LIVE CLOUD SYNC ───────────────────────────────────────
let _syncPollInterval = null;

async function syncCurrentDateFromCloud() {
  if (!ACTIVE_PROFILE) { console.warn('[Sync] No active profile'); return; }
  if (typeof pullLogForDate !== 'function') { console.warn('[Sync] pullLogForDate not available'); return; }
  _setSyncDot('syncing');
  try {
    const cloudLog = await pullLogForDate(ACTIVE_PROFILE.id, STATE.currentDate);
    if (!cloudLog) {
      console.log(`[Sync] No cloud data for ${STATE.currentDate}`);
      _setSyncDot('ok');
      return;
    }
    const localJson = JSON.stringify(LOG[STATE.currentDate] || {});
    const cloudJson = JSON.stringify(cloudLog);
    if (localJson === cloudJson) {
      _setSyncDot('ok');
      return;  // no change
    }
    console.log(`[Sync] Updated ${STATE.currentDate} from cloud`);
    LOG[STATE.currentDate] = cloudLog;
    saveLogs(ACTIVE_PROFILE.id, LOG);
    _setSyncDot('ok');
    switchSection(STATE.activeSection);
  } catch(e) {
    console.error('[Sync] Error:', e);
    _setSyncDot('idle');
  }
}

function startLiveSyncPoll() {
  if (_syncPollInterval) clearInterval(_syncPollInterval);
  _syncPollInterval = setInterval(syncCurrentDateFromCloud, 5000);
}
function stopLiveSyncPoll() {
  if (_syncPollInterval) { clearInterval(_syncPollInterval); _syncPollInterval = null; }
}

// ── PROFILE MANAGEMENT ────────────────────────────────────
function openProfileMenu() {
  // De-dupe localStorage in case cloud sync created duplicates by name
  const raw = getAllProfiles();
  const seenNames = new Set();
  const deduped = raw.filter(p => {
    const key = p.name.trim().toLowerCase();
    if (seenNames.has(key)) return false;
    seenNames.add(key); return true;
  });
  if (deduped.length !== raw.length) saveAllProfiles(deduped);

  const profiles = getAllProfiles();
  const menu = document.getElementById('profileMenuModal');

  // Populate hero section
  const p = ACTIVE_PROFILE;
  const heroAvatar = document.getElementById('pmHeroAvatar');
  const heroName   = document.getElementById('pmHeroName');
  const heroMeta   = document.getElementById('pmHeroMeta');
  if (heroAvatar) {
    heroAvatar.textContent = p ? p.name.charAt(0).toUpperCase() : '?';
    heroAvatar.style.background = p?.avatarColor || 'var(--accent)';
  }
  if (heroName) heroName.textContent = p?.name || 'Unknown';
  if (heroMeta) {
    const goalLabel = { aggressive_loss:'Fast Loss', loss:'Steady Loss', recomp:'Body Recomp', maintain:'Maintain', gain:'Muscle Gain' }[p?.goal] || (p?.goal || '');
    heroMeta.textContent = [p?.weight ? p.weight+'kg' : null, p?.age ? p.age+'y' : null, goalLabel].filter(Boolean).join(' · ');
  }

  // Populate profile switcher list — only OTHER profiles (active shown in hero)
  const list = document.getElementById('profileSwitchList');
  if (list) {
    const others = profiles.filter(p => p.id !== ACTIVE_PROFILE?.id);
    const lbl = document.getElementById('pmProfilesLabel');
    if (others.length === 0) {
      list.innerHTML = '';
      if (lbl) lbl.style.display = 'none';
    } else {
      if (lbl) lbl.style.display = '';
      const goalShort = { aggressive_loss:'Fast Loss', loss:'Steady Loss', recomp:'Recomp', maintain:'Maintain', gain:'Muscle Gain' };
      list.innerHTML = others.map(p => `
        <div class="pm-profile-row" onclick="switchProfile('${p.id}')">
          <div class="pm-profile-avatar" style="background:${p.avatarColor||'#2a4f80'}">${p.name.charAt(0).toUpperCase()}</div>
          <div class="pm-profile-text">
            <div class="pm-profile-name">${p.name}</div>
            <div class="pm-profile-meta">${[p.weight?p.weight+'kg':null, p.age?p.age+'y':null, goalShort[p.goal]||p.goal||null].filter(Boolean).join(' · ')}</div>
          </div>
          <span class="pm-profile-arrow">›</span>
        </div>
      `).join('');
    }
  }
  if (menu) menu.classList.add('open');
}

function switchProfile(id) {
  document.getElementById('profileMenuModal')?.classList.remove('open');
  activateProfile(id);
}

function addNewProfile() {
  document.getElementById('profileMenuModal')?.classList.remove('open');
  showSetup(true);
}

// ── EVENT LISTENERS ────────────────────────────────────────
function setupEventListeners() {
  document.querySelectorAll('.bottom-nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchSection(btn.dataset.section));
  });
  const si = document.getElementById('foodSearchInput');
  if (si) {
    let _searchTimer = null;
    const debouncedSearch = (val) => {
      clearTimeout(_searchTimer);
      _searchTimer = setTimeout(() => handleFoodSearch(val), 150);
    };
    si.addEventListener('input', e => debouncedSearch(e.target.value));
    si.addEventListener('keyup', e => debouncedSearch(e.target.value));
  }
  document.querySelectorAll('.modal-overlay').forEach(ov => {
    ov.addEventListener('click', e => { if (e.target===ov) ov.classList.remove('open'); });
  });
  document.getElementById('profileBtn')?.addEventListener('click', openProfileMenu);
}

// ── WATER QUICK-ADD (dashboard) ───────────────────────────
function addWaterDash() {
  const log = getLog(STATE.currentDate);
  const goals = getGoals();
  log.water = Math.min(log.water + 1, goals.water + 4);
  persistLogs(STATE.currentDate);
  renderDashboard();
  renderHabits();
  showToast('Hydration logged 💧');
}

// ── WEIGHT LOG (dashboard) ────────────────────────────────
function logWeightToday() {
  const inp = document.getElementById('dash_weight_input');
  const val = parseFloat(inp?.value);
  if (!val || val < 20 || val > 300) { showToast('Enter a valid weight (20–300 kg)', 'error'); return; }
  const log = getLog(STATE.currentDate);
  log.weight = val;
  persistLogs(STATE.currentDate);
  renderWeightDash();
  renderWeightLog();
  if (inp) inp.blur();
  showToast(`Weight logged: ${val} kg ✓`, 'success');
}

function renderWeightDash() {
  const log     = getLog(STATE.currentDate);
  const valEl   = document.getElementById('dash_weight_val');
  const trendEl = document.getElementById('dash_weight_trend');
  const inp     = document.getElementById('dash_weight_input');
  if (valEl) valEl.textContent = log.weight ? `${log.weight} kg` : '—';
  if (inp && log.weight) inp.value = log.weight;
  if (trendEl) {
    const yday = offsetDate(STATE.currentDate, -1);
    const ylog = LOG[yday];
    if (log.weight && ylog?.weight) {
      const diff = +(log.weight - ylog.weight).toFixed(1);
      trendEl.textContent = diff === 0 ? '=' : (diff > 0 ? `↑${diff}` : `↓${Math.abs(diff)}`) + ' kg';
      trendEl.className   = 'dash-weight-trend ' + (diff < 0 ? 'clr-success' : diff > 0 ? 'clr-accent' : 'clr-muted');
    } else { trendEl.textContent = ''; }
  }
}

// ── WEEKLY SUMMARY ────────────────────────────────────────
function renderWeeklySummary() {
  const container = document.getElementById('weekly_summary_stats');
  if (!container) return;
  const goals = getGoals();
  let calSum = 0, calDays = 0, proHit = 0, proDays = 0, workoutDays = 0;
  const weights = [];
  for (let i = 6; i >= 0; i--) {
    const d   = offsetDate(STATE.currentDate, -i);
    const log = LOG[d];
    if (!log) continue;
    const t = logTotals(d);
    if (t.cal > 0) {
      calSum += t.cal; calDays++;
      proDays++;
      if (t.pro >= goals.protein * 0.9) proHit++;
    }
    const wkDone = Object.values(log.workout?.exerciseProgress || {}).filter(p => p.done).length
                   || (log.workout?.completedExercises || []).length;
    if (wkDone > 0) workoutDays++;
    if (log.weight) weights.push(log.weight);
  }
  const avgCal  = calDays  > 0 ? Math.round(calSum / calDays) : 0;
  const proRate = proDays  > 0 ? Math.round(proHit / proDays * 100) : 0;
  const wtTrend = weights.length >= 2 ? +(weights[weights.length-1] - weights[0]).toFixed(1) : null;
  const wtHtml  = wtTrend !== null
    ? `<div class="weekly-stat"><div class="weekly-val ${wtTrend<0?'clr-success':wtTrend>0?'clr-accent':''}">${wtTrend>0?'+':''}${wtTrend} kg</div><div class="weekly-lbl">Weight</div></div>`
    : `<div class="weekly-stat"><div class="weekly-val clr-muted">—</div><div class="weekly-lbl">Weight</div></div>`;
  container.innerHTML = `
    <div class="weekly-stat"><div class="weekly-val">${avgCal||'—'}</div><div class="weekly-lbl">Avg kcal</div></div>
    <div class="weekly-stat"><div class="weekly-val ${proRate>=80?'clr-success':''}">${proRate}%</div><div class="weekly-lbl">Protein</div></div>
    <div class="weekly-stat"><div class="weekly-val">${workoutDays}/7</div><div class="weekly-lbl">Workouts</div></div>
    ${wtHtml}`;
}

// ── COPY YESTERDAY'S MEALS ────────────────────────────────
function copyYesterdayMeals() {
  const today     = STATE.currentDate;
  const yesterday = offsetDate(today, -1);
  const yLog = LOG[yesterday];
  if (!yLog || Object.values(yLog.meals).every(m => m.length === 0)) {
    showToast('No meals logged yesterday', ''); return;
  }
  const todayLog  = getLog(today);
  const hasMeals  = Object.values(todayLog.meals).some(m => m.length > 0);
  if (hasMeals) { showToast('Today already has meals logged', ''); return; }
  todayLog.meals = JSON.parse(JSON.stringify(yLog.meals));
  persistLogs(today);
  renderDiet();
  renderDashboard();
  showToast("Yesterday's meals copied ✓", 'success');
}

// ── MEAL TEMPLATES ────────────────────────────────────────
function getMealTemplates() {
  if (!ACTIVE_PROFILE) return {};
  return JSON.parse(localStorage.getItem(`ft_templates_${ACTIVE_PROFILE.id}`) || '{}');
}
function saveMealTemplatesStore(t) {
  if (!ACTIVE_PROFILE) return;
  localStorage.setItem(`ft_templates_${ACTIVE_PROFILE.id}`, JSON.stringify(t));
}
function saveAsMealTemplate(meal) {
  const log   = getLog(STATE.currentDate);
  const items = log.meals[meal] || [];
  if (items.length === 0) { showToast('No items to save as template', ''); return; }
  const name = prompt(`Template name:`, `My ${meal.charAt(0).toUpperCase()+meal.slice(1)}`);
  if (!name?.trim()) return;
  const t = getMealTemplates();
  if (!t[meal]) t[meal] = {};
  t[meal][name.trim()] = JSON.parse(JSON.stringify(items));
  saveMealTemplatesStore(t);
  renderTemplateButtons(meal);
  showToast(`Template "${name.trim()}" saved ✓`, 'success');
}
function loadMealTemplate(meal, name) {
  const t     = getMealTemplates();
  const items = t[meal]?.[name];
  if (!items) return;
  const log = getLog(STATE.currentDate);
  log.meals[meal] = [...(log.meals[meal]||[]), ...JSON.parse(JSON.stringify(items))];
  persistLogs(STATE.currentDate);
  renderDiet(); renderDashboard();
  showToast(`"${name}" loaded ✓`, 'success');
}
function deleteMealTemplate(meal, name) {
  const t = getMealTemplates();
  if (t[meal]) delete t[meal][name];
  saveMealTemplatesStore(t);
  renderTemplateButtons(meal);
  showToast('Template deleted', '');
}
function renderTemplateButtons(meal) {
  const container = document.getElementById(`template_btns_${meal}`);
  if (!container) return;
  const t     = getMealTemplates();
  const names = Object.keys(t[meal] || {});
  container.innerHTML = names.map(n =>
    `<div class="template-chip">
       <span onclick="loadMealTemplate('${meal}','${n.replace(/'/g,"\\'")}')">${n}</span>
       <button onclick="deleteMealTemplate('${meal}','${n.replace(/'/g,"\\'")}')">×</button>
     </div>`).join('');
}
function renderAllTemplateButtons() {
  ['breakfast','lunch','dinner','snacks'].forEach(m => renderTemplateButtons(m));
}

// ── REST TIMER ────────────────────────────────────────────
const _rt = { active:false, remaining:0, duration:90, _iv:null };
function startRestTimer(secs) {
  stopRestTimer();
  _rt.duration  = secs || 90;
  _rt.remaining = _rt.duration;
  _rt.active    = true;
  _renderRestTimerBar();
  _rt._iv = setInterval(() => {
    _rt.remaining--;
    _renderRestTimerBar();
    if (_rt.remaining <= 0) {
      stopRestTimer();
      if (navigator.vibrate) navigator.vibrate([200,100,200]);
      showToast('Rest done — next set! 💪', 'success');
    }
  }, 1000);
}
function stopRestTimer() {
  clearInterval(_rt._iv); _rt.active = false; _rt._iv = null;
  _renderRestTimerBar();
}
function setRestDuration(secs) {
  if (_rt.active) startRestTimer(secs);
  else { _rt.duration = secs; }
  document.querySelectorAll('.rest-dur-btn').forEach(b => b.classList.toggle('active', +b.dataset.secs===secs));
}
function _renderRestTimerBar() {
  const bar = document.getElementById('restTimerBar');
  if (!bar) return;
  if (!_rt.active) { bar.style.display = 'none'; return; }
  bar.style.display = 'flex';
  const m = Math.floor(_rt.remaining/60), s = _rt.remaining%60;
  const pct = Math.round((_rt.remaining/_rt.duration)*100);
  const countEl = document.getElementById('restTimerCount');
  const progEl  = document.getElementById('restTimerProgress');
  if (countEl) countEl.textContent = `${m}:${String(s).padStart(2,'0')}`;
  if (progEl)  progEl.style.width  = pct + '%';
}

// ── BODY MEASUREMENTS ─────────────────────────────────────
function openMeasurementsModal() {
  const log = getLog(STATE.currentDate);
  const m   = log.measurements || {};
  ['chest','waist','hips','arms','neck'].forEach(k => {
    const el = document.getElementById(`meas_${k}`);
    if (el) el.value = m[k] || '';
  });
  document.getElementById('measurementsModal').classList.add('open');
}
function closeMeasurementsModal() {
  document.getElementById('measurementsModal').classList.remove('open');
}
function saveMeasurements() {
  const log = getLog(STATE.currentDate);
  const m   = {};
  ['chest','waist','hips','arms','neck'].forEach(k => {
    const v = parseFloat(document.getElementById(`meas_${k}`)?.value);
    if (v > 0) m[k] = v;
  });
  log.measurements = m;
  persistLogs(STATE.currentDate);
  closeMeasurementsModal();
  renderMeasurementsDash();
  showToast('Measurements saved ✓', 'success');
}
function renderMeasurementsDash() {
  const container = document.getElementById('dash_measurements');
  if (!container) return;
  const log  = getLog(STATE.currentDate);
  const m    = log.measurements;
  const keys = m ? Object.keys(m) : [];
  if (keys.length === 0) {
    container.innerHTML = `<div class="meas-empty">Tap + to log today's measurements</div>`;
    return;
  }
  const labels = { chest:'Chest', waist:'Waist', hips:'Hips', arms:'Arms', neck:'Neck' };
  container.innerHTML = keys.map(k =>
    `<div class="meas-chip"><span class="meas-val">${m[k]}</span><span class="meas-lbl">${labels[k]||k}</span></div>`
  ).join('');
}

// ── PROGRESS PHOTOS ───────────────────────────────────────
async function uploadProgressPhoto(input) {
  const file = input.files?.[0];
  if (!file || !ACTIVE_PROFILE) return;
  if (!supabaseClient) { showToast('Sign in to save photos to cloud', 'error'); return; }
  if (file.size > 8 * 1024 * 1024) { showToast('Photo must be under 8 MB', 'error'); return; }
  const ext  = file.type.includes('png') ? 'png' : 'jpg';
  const path = `${ACTIVE_PROFILE.id}/${STATE.currentDate}.${ext}`;
  showToast('Uploading…', '');
  try {
    const { error } = await supabaseClient.storage
      .from('progress-photos').upload(path, file, { upsert: true, contentType: file.type });
    if (error) throw error;
    const log = getLog(STATE.currentDate);
    log.photoPath = path;
    persistLogs(STATE.currentDate);
    renderTodayPhoto();
    showToast('Photo saved ✓', 'success');
  } catch(e) {
    showToast('Upload failed — check connection', 'error');
    console.warn('[FitTrack] Photo upload:', e);
  }
}
async function _getPhotoUrl(path) {
  if (!supabaseClient || !path) return null;
  try {
    return supabaseClient.storage.from('progress-photos').getPublicUrl(path).data?.publicUrl || null;
  } catch(e) { return null; }
}
async function renderTodayPhoto() {
  const container = document.getElementById('today_photo_wrap');
  if (!container) return;
  const log = getLog(STATE.currentDate);
  if (!log.photoPath) {
    container.innerHTML = `<label class="photo-upload-area" for="photoFileInput">
      <span class="photo-upload-icon">📷</span>
      <span class="photo-upload-lbl">Add progress photo</span>
      <input type="file" id="photoFileInput" accept="image/*" capture="environment" style="display:none" onchange="uploadProgressPhoto(this)">
    </label>`; return;
  }
  const url = await _getPhotoUrl(log.photoPath);
  if (url) container.innerHTML = `<div class="today-photo-wrap">
    <img src="${url}" class="today-photo-img" onclick="openPhotoFullscreen('${url}')" alt="Today">
    <label class="photo-retake-btn" for="photoFileInput">📷 Retake
      <input type="file" id="photoFileInput" accept="image/*" capture="environment" style="display:none" onchange="uploadProgressPhoto(this)">
    </label></div>`;
}
async function renderPhotoGallery() {
  const container = document.getElementById('photoGalleryGrid');
  if (!container) return;
  const photoDates = Object.entries(LOG).filter(([,l]) => l.photoPath)
    .sort((a,b) => b[0].localeCompare(a[0])).slice(0,24);
  if (photoDates.length === 0) {
    container.innerHTML = '<div class="photo-gallery-empty">No progress photos yet</div>'; return;
  }
  container.innerHTML = '<div class="photo-loading">Loading…</div>';
  const items = await Promise.all(photoDates.map(async ([date, l]) => {
    const url = await _getPhotoUrl(l.photoPath);
    if (!url) return '';
    return `<div class="photo-thumb" onclick="openPhotoFullscreen('${url}')">
      <img src="${url}" loading="lazy" alt="${date}">
      <span>${formatDate(date)}</span></div>`;
  }));
  container.innerHTML = items.filter(Boolean).join('') || '<div class="photo-gallery-empty">No photos available</div>';
}
function openPhotoFullscreen(url) {
  const ov = document.getElementById('photoFullscreenOverlay');
  const im = document.getElementById('photoFullscreenImg');
  if (ov && im) { im.src = url; ov.classList.add('open'); }
}
function closePhotoFullscreen() {
  document.getElementById('photoFullscreenOverlay')?.classList.remove('open');
}

// ── RECIPES ───────────────────────────────────────────────

const _RS = {           // recipe section state
  cat:   'all',
  sort:  'recommended',
  query: '',
};

// Render the category tab buttons
function renderRecipeCatTabs() {
  const container = document.getElementById('recipeCatTabs');
  if (!container) return;
  container.innerHTML = RECIPE_CATS.map(c =>
    `<button class="recipe-cat-btn${_RS.cat === c.id ? ' active' : ''}"
       onclick="setRecipeCat('${c.id}')">${c.emoji} ${c.label}</button>`
  ).join('');
}

// Called by sort buttons
function setRecipeSort(mode) {
  _RS.sort = mode;
  document.querySelectorAll('.recipe-sort-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.sort === mode);
  });
  renderRecipeGrid();
}

// Called by category tab buttons
function setRecipeCat(catId) {
  _RS.cat = catId;
  renderRecipeCatTabs();
  renderRecipeSuggestBanner();
  renderRecipeGrid();
}

// Called by search input
function filterRecipes(query) {
  _RS.query = query || '';
  renderRecipeGrid();
}

// Main render — full recipes section
function renderRecipes() {
  renderRecipeCatTabs();
  renderRecipeSuggestBanner();
  renderRecipeGrid();
  // Keep subtitle count in sync with actual array length
  const sub = document.getElementById('recipesSubtitle');
  if (sub && typeof RECIPES !== 'undefined') {
    sub.textContent = `${RECIPES.length} high-protein vegetarian · no soy`;
  }
}

// Suggest banner — top recommendation
function renderRecipeSuggestBanner() {
  const banner = document.getElementById('recipeSuggestBanner');
  const allTriedBanner = document.getElementById('recipeAllTriedBanner');
  if (!banner) return;

  const tried = loadTriedRecipes();
  const suggestion = getTopSuggestion(_RS.cat, null);

  if (!suggestion) {
    banner.classList.remove('visible');
    if (allTriedBanner) { allTriedBanner.textContent = '🏆 You\'ve tried every recipe in this category! Explore another.'; allTriedBanner.classList.add('visible'); }
    return;
  }

  if (allTriedBanner) allTriedBanner.classList.remove('visible');

  // Check if all in this category are tried
  const catRecipes = _RS.cat === 'all' ? RECIPES : RECIPES.filter(r => r.cat === _RS.cat);
  const allTried = catRecipes.every(r => tried[r.id]);
  if (allTried) {
    banner.classList.remove('visible');
    if (allTriedBanner) { allTriedBanner.textContent = '🏆 You\'ve tried every recipe in this category! Explore another.'; allTriedBanner.classList.add('visible'); }
    return;
  }

  const triedCount = catRecipes.filter(r => tried[r.id]).length;
  const triedLabel = triedCount > 0 ? `· ${triedCount}/${catRecipes.length} tried` : '';

  banner.classList.add('visible');
  banner.innerHTML = `
    <div class="recipe-suggest-label">✨ Try something new ${triedLabel}</div>
    <div class="recipe-suggest-title">${suggestion.emoji} ${suggestion.name}</div>
    <div class="recipe-suggest-meta">
      ${suggestion.protein}g protein · ${suggestion.cal} kcal · ${suggestion.prepTime}min
      &nbsp;·&nbsp; ${suggestion.desc}
    </div>
    <div class="recipe-suggest-add-row">
      ${suggestion.bestMeal.map(m =>
        `<button class="recipe-suggest-btn" onclick="addRecipeToMeal(${suggestion.id},'${m}')">
           + ${getMealLabel(m)}
         </button>`
      ).join('')}
    </div>
  `;
}

// Render the recipe grid cards
function renderRecipeGrid() {
  const grid      = document.getElementById('recipeGrid');
  const countLine = document.getElementById('recipeCountLine');
  if (!grid) return;

  const recipes = getScoredRecipes(_RS.cat, _RS.sort, _RS.query, null);
  const tried   = loadTriedRecipes();

  if (countLine) {
    const triedTotal = RECIPES.filter(r => tried[r.id]).length;
    countLine.textContent = `${recipes.length} recipes shown · ${triedTotal} / ${RECIPES.length} tried`;
  }

  if (recipes.length === 0) {
    grid.innerHTML = `<div class="recipe-empty">
      <div class="big-emoji">🔍</div>
      <div>No recipes match your search.</div>
    </div>`;
    return;
  }

  grid.innerHTML = recipes.map(r => _buildRecipeCard(r, tried[r.id])).join('');
}

// Build a single recipe card HTML
function _buildRecipeCard(recipe, triedData) {
  const triedBadge = triedData
    ? `<div class="recipe-tried-badge">✓ ${triedData.count}×</div>`
    : '';

  const mealBadges = recipe.bestMeal.map(m =>
    `<span class="recipe-meal-badge ${m}">${_mealIcon(m)} ${getMealLabel(m)}</span>`
  ).join('');

  const addButtons = recipe.bestMeal.map(m =>
    `<button class="recipe-add-btn" onclick="addRecipeToMeal(${recipe.id},'${m}')">${getMealLabel(m)}</button>`
  ).join('');

  // Difficulty dot
  const diffDot = `<span class="recipe-diff-dot ${recipe.difficulty}"></span>`;

  // Watch YouTube button — use pinned ytId if available, else search fallback
  const watchBtn = `<button class="recipe-watch-btn" onclick="watchRecipe(${recipe.id})">▶ Watch Recipe</button>`;

  // Share button
  const shareBtn = `<button class="recipe-share-btn" onclick="shareRecipe(${recipe.id})" title="Share recipe"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></button>`;

  return `
    <div class="recipe-card${triedData ? ' tried' : ''}" id="rcard_${recipe.id}">
      ${triedBadge}
      <div class="recipe-card-header">
        <div class="recipe-emoji">${recipe.emoji}</div>
        <div class="recipe-name">${recipe.name}</div>
        <div class="recipe-cat-badge">${getRecipeCatLabel(recipe.cat)}</div>
        ${shareBtn}
      </div>
      <div class="recipe-protein-row">
        <span class="recipe-protein-val">${recipe.protein}g</span>
        <span class="recipe-protein-lbl">protein</span>
        <span class="recipe-cal-val">· ${recipe.cal} kcal</span>
      </div>
      <div class="recipe-meal-badges">${mealBadges}</div>
      <div class="recipe-prep-row">
        ${diffDot}${_capFirst(recipe.difficulty)} · ${recipe.prepTime} min
      </div>
      <div class="recipe-card-actions">
        ${watchBtn}
        <div class="recipe-add-row">${addButtons}</div>
      </div>
    </div>`;
}

function _mealIcon(meal) {
  const m = { breakfast:'🌅', lunch:'☀️', snacks:'🍎', dinner:'🌙' };
  return m[meal] || '';
}
function _capFirst(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

// Add recipe nutrition to a meal log + mark as tried
function addRecipeToMeal(recipeId, meal) {
  const recipe = RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;

  const log = getLog(STATE.currentDate);
  if (!log.meals[meal]) log.meals[meal] = [];

  // Add as a food item — compatible with the existing diet rendering
  log.meals[meal].push({
    id:      `recipe_${recipe.id}`,
    name:    recipe.name,
    emoji:   recipe.emoji,
    cat:     'recipe',
    cal:     recipe.cal,
    pro:     recipe.protein,
    carb:    recipe.carbs,
    fat:     recipe.fat,
    fiber:   recipe.fiber,
    sodium:  recipe.sodium,
    calcium: recipe.calcium,
    iron:    recipe.iron,
    vitC:    recipe.vitC,
    servingSize: recipe.servingSize,
    qty: 1,
    isRecipe: true,
  });

  persistLogs(STATE.currentDate);
  markRecipeTried(recipeId, meal);

  // Refresh the recipe card to show tried badge
  const card = document.getElementById(`rcard_${recipeId}`);
  if (card) {
    const tried = loadTriedRecipes();
    card.outerHTML = _buildRecipeCard(recipe, tried[recipeId]);
  }

  // Refresh the suggest banner (something new might surface)
  renderRecipeSuggestBanner();

  // Update diet + dashboard totals
  renderDiet();
  renderDashboard();

  showToast(`${recipe.emoji} ${recipe.name} added to ${getMealLabel(meal)} ✓`, 'success');
}

// Share recipe via native share sheet (WhatsApp, iMessage, etc.) or clipboard fallback
function shareRecipe(recipeId) {
  const recipe = RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;
  const ytLink = recipe.ytId ? `\n▶ Watch: https://www.youtube.com/watch?v=${recipe.ytId}` : '';
  const text = `${recipe.emoji} *${recipe.name}*\n${recipe.desc}\n\n💪 ${recipe.protein}g protein · ${recipe.cal} kcal · ${recipe.prepTime} min${ytLink}`;
  if (navigator.share) {
    navigator.share({ title: recipe.name, text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.querySelector(`#rcard_${recipeId} .recipe-share-btn`);
      if (btn) {
        btn.classList.add('copied');
        btn.title = 'Copied!';
        setTimeout(() => { btn.classList.remove('copied'); btn.title = 'Share recipe'; }, 2000);
      }
    }).catch(() => {});
  }
}

// Open YouTube — direct video if ytId is set, else search fallback
function watchRecipe(recipeId) {
  const recipe = RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;
  const url = recipe.ytId
    ? `https://www.youtube.com/watch?v=${recipe.ytId}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.name + ' recipe Ranveer Brar')}`;
  window.open(url, '_blank', 'noopener');
}

// ── UTILITIES ──────────────────────────────────────────────
function setText(id, val) { const el=document.getElementById(id); if(el) el.textContent=val; }
function setBar(id, pct) {
  const el=document.getElementById(id);
  if (!el) return;
  el.style.width = pct+'%';
  el.classList.toggle('over', pct>100);
}

function showToast(msg, type='') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity 0.3s'; setTimeout(()=>t.remove(),400); }, 2400);
}

// Globals (for onclick= attributes in HTML)
window.signIn               = signIn;
window.signUp               = signUp;
window.signOut              = signOut;
window.closeFoodModal       = closeFoodModal;
window.changeExerciseSets   = changeExerciseSets;
window.changeExerciseReps   = changeExerciseReps;
window.selectGoal           = selectGoal;
window.setupNext            = setupNext;
window.finishSetup          = finishSetup;
window.switchSection        = switchSection;
window.changeDate           = changeDate;
window.goToToday            = goToToday;
window.syncCurrentDateFromCloud = syncCurrentDateFromCloud;
window.startLiveSyncPoll    = startLiveSyncPoll;
window.stopLiveSyncPoll     = stopLiveSyncPoll;
window.openFoodSearch       = openFoodSearch;
window.handleFoodSearch     = handleFoodSearch;
window.selectFood           = selectFood;
window.updateQtyPreview     = updateQtyPreview;
window.changeQty            = changeQty;
window.confirmAddFood       = confirmAddFood;
window.changeItemQty        = changeItemQty;
window.removeFood           = removeFood;
window.toggleMeal           = toggleMeal;
window.addCustomFood        = addCustomFood;
window.selectVariation      = selectVariation;
window.openVariationDay     = openVariationDay;
window.switchWorkoutDay     = switchWorkoutDay;
window.toggleExerciseSelect = toggleExerciseSelect;
window.toggleExerciseDetail = toggleExerciseDetail;
window.backToPlans          = backToPlans;
window.removeExercise       = removeExercise;
window.removeCustomExercise = removeCustomExercise;
window.retrySyncProfiles    = retrySyncProfiles;
window.refreshApp           = refreshApp;
window.changeHabit          = changeHabit;
window.updateProfile        = updateProfile;
window.openProfileMenu      = openProfileMenu;
window.switchProfile        = switchProfile;
window.addNewProfile        = addNewProfile;
window.activateProfile      = activateProfile;
window.STATE                = STATE;
// New features
window.addWaterDash         = addWaterDash;
window.logWeightToday       = logWeightToday;
window.copyYesterdayMeals   = copyYesterdayMeals;
window.saveAsMealTemplate   = saveAsMealTemplate;
window.loadMealTemplate     = loadMealTemplate;
window.deleteMealTemplate   = deleteMealTemplate;
window.startRestTimer       = startRestTimer;
window.stopRestTimer        = stopRestTimer;
window.setRestDuration      = setRestDuration;
window.openMeasurementsModal  = openMeasurementsModal;
window.closeMeasurementsModal = closeMeasurementsModal;
window.saveMeasurements     = saveMeasurements;
window.uploadProgressPhoto  = uploadProgressPhoto;
window.openPhotoFullscreen  = openPhotoFullscreen;
window.closePhotoFullscreen = closePhotoFullscreen;
window.renderPhotoGallery   = renderPhotoGallery;
window.playYouTube              = playYouTube;
window.quickAddFood             = quickAddFood;
window.setExerciseSetsDirectly  = setExerciseSetsDirectly;
window.setExerciseRepsDirectly  = setExerciseRepsDirectly;
// Recipes
window.renderRecipes            = renderRecipes;
window.setRecipeSort            = setRecipeSort;
window.setRecipeCat             = setRecipeCat;
window.filterRecipes            = filterRecipes;
window.addRecipeToMeal          = addRecipeToMeal;
window.watchRecipe              = watchRecipe;
window.shareRecipe              = shareRecipe;
// Reports
window.openReportModal          = openReportModal;
window.setReportPreset          = setReportPreset;
window.generateAndOpenReport    = generateAndOpenReport;

// ── REPORTS ────────────────────────────────────────────────
function openReportModal() {
  const today = todayStr();
  const sevenAgo = offsetDate(today, -6);
  document.getElementById('reportFromDate').value = sevenAgo;
  document.getElementById('reportToDate').value   = today;
  document.getElementById('reportModal').classList.add('open');
}

function setReportPreset(days) {
  const today = todayStr();
  document.getElementById('reportFromDate').value = offsetDate(today, -(days - 1));
  document.getElementById('reportToDate').value   = today;
}

function generateAndOpenReport() {
  const from = document.getElementById('reportFromDate').value;
  const to   = document.getElementById('reportToDate').value;
  if (!from || !to || from > to) { showToast('Pick a valid date range','error'); return; }
  document.getElementById('reportModal').classList.remove('open');
  const html = buildReportHTML(from, to);
  const w = window.open('', '_blank');
  if (!w) { showToast('Pop-up blocked — allow pop-ups and try again','error'); return; }
  w.document.write(html);
  w.document.close();
}

function buildReportHTML(fromStr, toStr) {
  const profile = ACTIVE_PROFILE || {};
  const name    = profile.name || 'You';
  const goal    = profile.goal || 'recomp';
  const weight  = profile.weight || 70;
  const height  = profile.height || 170;
  // getGoals() uses ACTIVE_PROFILE and returns { calories, protein, carbs, fat, water(glasses) }
  const goals   = getGoals();

  // Build daily data array
  const days = [];
  let d = new Date(fromStr + 'T00:00:00');
  const end = new Date(toStr + 'T00:00:00');
  while (d <= end) {
    const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const log = LOG[ds];
    if (log) {
      let cal=0,pro=0,carb=0,fat=0,fiber=0;
      if (log.meals) Object.values(log.meals).flat().forEach(item=>{
        const m=item.qty||1;
        cal  +=(item.cal  ||0)*m;
        pro  +=(item.pro  ||0)*m;
        carb +=(item.carb ||0)*m;
        fat  +=(item.fat  ||0)*m;
        fiber+=(item.fiber||0)*m;
      });
      // water stored as glasses; convert to litres (1 glass = 250ml = 0.25L)
      const waterL = +((log.water || 0) * 0.25).toFixed(2);
      const wt = log.weight || null;
      const smoke = log.smoke || 0;
      const workout = log.workout ? (log.workout.completedExercises||[]).length + Object.values(log.workout.exerciseProgress||{}).filter(p=>p.done).length : 0;
      days.push({ ds, cal:Math.round(cal), pro:Math.round(pro), carb:Math.round(carb), fat:Math.round(fat),
                  fiber:Math.round(fiber), water:waterL, weight:wt, smoke, workoutDone: workout > 0 });
    } else {
      days.push({ ds, cal:0, pro:0, carb:0, fat:0, fiber:0, water:0, weight:null, smoke:0, workoutDone:false });
    }
    d.setDate(d.getDate()+1);
  }

  const n = days.length;
  const loggedDays = days.filter(d=>d.cal>0);
  const avgCal  = loggedDays.length ? Math.round(loggedDays.reduce((s,d)=>s+d.cal,0)/loggedDays.length) : 0;
  const avgPro  = loggedDays.length ? Math.round(loggedDays.reduce((s,d)=>s+d.pro,0)/loggedDays.length) : 0;
  const avgCarb = loggedDays.length ? Math.round(loggedDays.reduce((s,d)=>s+d.carb,0)/loggedDays.length) : 0;
  const avgFat  = loggedDays.length ? Math.round(loggedDays.reduce((s,d)=>s+d.fat,0)/loggedDays.length) : 0;
  // avgWater already in litres (converted above)
  const allWaterDays = days.filter(d=>d.water>0);
  const avgWater= allWaterDays.length ? +(allWaterDays.reduce((s,d)=>s+d.water,0)/allWaterDays.length).toFixed(1) : 0;
  const workoutCount = days.filter(d=>d.workoutDone).length;
  const weightDays = days.filter(d=>d.weight !== null);
  const firstWeight = weightDays.length ? weightDays[0].weight : null;
  const lastWeight  = weightDays.length ? weightDays[weightDays.length-1].weight : null;
  const weightChange = (firstWeight && lastWeight) ? +(lastWeight - firstWeight).toFixed(1) : null;

  const labels    = JSON.stringify(days.map(d => { const dt = new Date(d.ds+'T00:00:00'); return dt.toLocaleDateString('en-IN',{month:'short',day:'numeric'}); }));
  const calData   = JSON.stringify(days.map(d => d.cal));
  const proData   = JSON.stringify(days.map(d => d.pro));
  const carbData  = JSON.stringify(days.map(d => d.carb));
  const fatData   = JSON.stringify(days.map(d => d.fat));
  const waterData = JSON.stringify(days.map(d => d.water));
  const wtData    = JSON.stringify(days.map(d => d.weight));
  const calGoal   = goals.calories;
  const proGoal   = goals.protein;
  // water goal from getGoals() is in glasses; convert to litres
  const waterGoal = +((goals.water || 8) * 0.25).toFixed(1);

  const goalLabel = { aggressive_loss:'Aggressive Loss', loss:'Steady Loss', recomp:'Body Recomp', maintain:'Maintain', gain:'Muscle Gain' }[goal] || goal;
  const dateRangeLabel = `${new Date(fromStr+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})} – ${new Date(toStr+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}`;

  const rowsHTML = days.map(d => {
    const dt = new Date(d.ds+'T00:00:00');
    const label = dt.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});
    const calPct = calGoal ? Math.min(Math.round(d.cal/calGoal*100), 200) : 0;
    const calBg = d.cal === 0 ? 'transparent' : (calPct > 115 ? '#fde8e8' : calPct >= 85 ? '#e8f5e8' : '#fef3e2');
    return `<tr style="background:${calBg}">
      <td>${label}</td>
      <td>${d.cal || '—'}</td>
      <td>${d.pro || '—'}g</td>
      <td>${d.carb || '—'}g</td>
      <td>${d.fat || '—'}g</td>
      <td>${d.water ? d.water+'L' : '—'}</td>
      <td>${d.weight !== null ? d.weight+'kg' : '—'}</td>
      <td style="text-align:center">${d.workoutDone ? '✓' : '—'}</td>
    </tr>`;
  }).join('');

  const insightsHTML = (() => {
    const insights = [];
    if (loggedDays.length === 0) {
      insights.push({ label:'No data', msg:'No days were logged in this period. Start tracking to see insights here.' });
    } else {
      const streak = (() => { let max=0,cur=0; days.forEach(d=>{if(d.cal>0){cur++;max=Math.max(max,cur);}else{cur=0;}}); return max; })();
      if (streak >= 3) insights.push({ label:'🔥 Streak', msg:`Longest logging streak: ${streak} consecutive days. Consistency is everything.` });
      if (avgPro >= proGoal * 0.9) insights.push({ label:'💪 Protein on track', msg:`Averaged ${avgPro}g — meeting your ${proGoal}g target. Muscle preservation is solid.` });
      else insights.push({ label:'⚠️ Protein gap', msg:`Only ${avgPro}g avg vs ${proGoal}g target. Add paneer, Greek yogurt, or dal daily.` });
      if (avgCal > 0 && Math.abs(avgCal - calGoal) > calGoal * 0.15) insights.push({ label:'📉 Calorie drift', msg:`Avg intake ${avgCal} kcal is >15% off your ${calGoal} kcal goal. Review portions.` });
      if (workoutCount >= Math.round(n*0.6)) insights.push({ label:'🏋️ Workouts', msg:`${workoutCount}/${n} days — ${Math.round(workoutCount/n*100)}% consistency. Great work.` });
      else insights.push({ label:'🏋️ Workouts', msg:`${workoutCount}/${n} days. Aim for ${Math.ceil(n*0.6)}+ workouts in this period.` });
      if (weightChange !== null) {
        const days_between = weightDays.length >= 2 ? (new Date(weightDays[weightDays.length-1].ds) - new Date(weightDays[0].ds)) / 86400000 : 0;
        const weeklyRate = days_between > 0 ? +(weightChange / (days_between/7)).toFixed(2) : null;
        if (weeklyRate !== null) insights.push({ label:'⚖️ Weight rate', msg:`${weightChange>0?'+':''}${weightChange}kg over period (~${weeklyRate>0?'+':''}${weeklyRate}kg/week). ${goal==='recomp'&&Math.abs(weeklyRate)<0.15?'Stable — ideal for recomp.':''}` });
      }
      if (avgWater < waterGoal * 0.75) insights.push({ label:'💧 Hydration low', msg:`Avg ${avgWater}L/day is under 75% of your ${waterGoal}L goal.` });
    }
    return insights.map(i=>`<div class="insight"><span class="i-label">${i.label}:</span> ${i.msg}</div>`).join('');
  })();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>FitTrack Report — ${name}</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script>
<style>
/* ── Reset ── */
*{box-sizing:border-box;margin:0;padding:0}

/* ── Brand tokens ── */
:root{
  --bg:#f5f0eb; --bg2:#ede8e1; --card:#ffffff;
  --navy:#1e3a5f; --navy2:#2a4f80;
  --red:#c0392b;
  --text:#1a1a1a; --muted:#6b6b6b;
  --border:#e0d8d0;
  --green:#2d7a2d; --amber:#c87d0e;
}

/* ── Screen layout ── */
body{
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  background:var(--bg); color:var(--text);
  padding:1.5rem; max-width:900px; margin:0 auto;
}

/* ── Print layout: A4, single page ── */
@media print{
  @page{ size:A4 portrait; margin:8mm 10mm; }
  body{ background:#fff!important; padding:0; max-width:100%; font-size:8pt; }
  .no-print{ display:none!important }
  .page-break{ break-before:avoid!important; }   /* no forced breaks */
  .card{ box-shadow:none!important; border:1px solid #e0e0e0!important; background:#fff!important; }
  .chart-wrap{ box-shadow:none!important; border:1px solid #e0e0e0!important; background:#fff!important; }
  .stat{ border:1px solid #e0e0e0!important; background:#fafafa!important; }
  /* All canvases compact */
  canvas{ max-height:85px!important; }
  /* Donut stays square */
  .donut-container{ width:90px!important; height:90px!important; margin:0 auto!important; }
  .donut-container canvas{ width:90px!important; height:90px!important; max-width:90px!important; max-height:90px!important; }
  /* Grids */
  .two-col{ display:grid!important; grid-template-columns:1fr 1fr!important; gap:4px!important; margin-bottom:4px!important; }
  .three-col{ display:grid!important; grid-template-columns:1fr 1fr 1fr!important; gap:4px!important; margin-bottom:4px!important; }
  .stats-grid{ grid-template-columns:repeat(4,1fr)!important; gap:3px!important; margin-bottom:4px!important; }
  /* Compact spacing */
  .stat{ padding:4px 6px!important; border-radius:4px!important; }
  .stat-val{ font-size:13pt!important; margin-bottom:1px!important; }
  .stat-label{ font-size:5.5pt!important; }
  .stat-sub{ font-size:5.5pt!important; }
  .card, .chart-wrap{ padding:5px 7px!important; margin-bottom:4px!important; border-radius:4px!important; }
  h3{ font-size:6pt!important; margin-bottom:3px!important; letter-spacing:0.05em!important; }
  .goal-row{ margin-bottom:4px!important; }
  .goal-top{ font-size:7pt!important; margin-bottom:2px!important; }
  .bar-bg{ height:5px!important; }
  .bar-fill{ height:5px!important; }
  table{ font-size:6.5pt!important; }
  td,th{ padding:2px 4px!important; }
  .insight{ padding:3px 6px!important; margin-bottom:3px!important; font-size:6.5pt!important; line-height:1.3!important; }
  .i-label{ font-size:6.5pt!important; }
  .header{ margin-bottom:5px!important; }
  h1{ font-size:13pt!important; }
  .header-meta{ font-size:7pt!important; }
  .badge{ font-size:6pt!important; padding:1px 4px!important; }
  .footer{ margin-top:4px!important; padding-top:3px!important; font-size:6pt!important; }
}

/* ── Typography ── */
h1{ font-size:1.7rem; font-weight:800; color:var(--navy); letter-spacing:-0.3px; }
h3{ font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.07em; color:var(--muted); margin-bottom:0.65rem; }

/* ── Header ── */
.header{ display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.75rem; }
.badge{ display:inline-block; font-size:0.68rem; font-weight:700; padding:0.18rem 0.55rem; border-radius:999px; background:var(--navy); color:#fff; margin-left:0.45rem; vertical-align:middle; }
.header-meta{ font-size:0.78rem; color:var(--muted); margin-top:0.2rem; }
.print-btn{ background:var(--navy); color:#fff; border:none; border-radius:8px; padding:0.55rem 1.2rem; font-size:0.85rem; font-weight:600; cursor:pointer; }
.print-btn:hover{ background:var(--navy2); }

/* ── Stats grid ── */
.stats-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:0.6rem; margin-bottom:0.75rem; }
.stat{ background:var(--card); border-radius:10px; padding:0.8rem 0.9rem; border:1px solid var(--border); }
.stat-val{ font-size:1.5rem; font-weight:800; line-height:1; margin-bottom:0.15rem; color:var(--navy); }
.stat-val.green{ color:var(--green); }
.stat-val.amber{ color:var(--amber); }
.stat-val.red{ color:var(--red); }
.stat-label{ font-size:0.62rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--muted); font-weight:700; }
.stat-sub{ font-size:0.65rem; color:var(--muted); margin-top:0.1rem; }

/* ── Cards ── */
.card{ background:var(--card); border-radius:12px; padding:1rem 1.1rem; margin-bottom:0.7rem; border:1px solid var(--border); }

/* ── Goal bars ── */
.goal-row{ margin-bottom:0.75rem; }
.goal-row:last-child{ margin-bottom:0; }
.goal-top{ display:flex; justify-content:space-between; font-size:0.78rem; margin-bottom:0.25rem; font-weight:600; }
.goal-top .goal-name{ color:var(--text); }
.goal-top .goal-val{ color:var(--muted); }
.bar-bg{ background:var(--bg2); border-radius:999px; height:7px; overflow:hidden; }
.bar-fill{ height:7px; border-radius:999px; }

/* ── Grid layouts ── */
.two-col{ display:grid; grid-template-columns:1fr 1fr; gap:0.7rem; margin-bottom:0.7rem; }
.three-col{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.7rem; margin-bottom:0.7rem; }
.chart-wrap{ background:var(--card); border-radius:12px; padding:1rem 1.1rem; border:1px solid var(--border); }

/* ── Table ── */
table{ width:100%; border-collapse:collapse; font-size:0.75rem; }
th{ text-align:left; padding:0.45rem 0.5rem; color:var(--muted); font-weight:700; text-transform:uppercase; font-size:0.6rem; letter-spacing:0.05em; border-bottom:2px solid var(--border); }
td{ padding:0.38rem 0.5rem; border-bottom:1px solid var(--bg2); }
tr:last-child td{ border-bottom:none; }

/* ── Insights ── */
.insight{ background:var(--bg2); border-left:3px solid var(--navy); padding:0.6rem 0.9rem; border-radius:0 8px 8px 0; margin-bottom:0.5rem; font-size:0.78rem; line-height:1.5; }
.i-label{ font-weight:700; color:var(--navy); margin-right:0.25rem; }

/* ── Donut: always square ── */
.donut-container{ width:180px; height:180px; margin:0 auto; }
.donut-container canvas{ width:180px!important; height:180px!important; }

/* ── Footer ── */
.footer{ text-align:center; color:var(--muted); font-size:0.68rem; margin-top:1rem; padding-top:0.75rem; border-top:1px solid var(--border); }
</style>
</head>
<body>

<!-- ═══ PAGE 1 ═══ -->

<!-- Header -->
<div class="header">
  <div>
    <h1>📊 FitTrack Report <span class="badge">${goalLabel}</span></h1>
    <div class="header-meta">${name} &nbsp;·&nbsp; ${dateRangeLabel} &nbsp;·&nbsp; ${n} days</div>
  </div>
  <button class="print-btn no-print" onclick="window.print()">🖨 Print / Save PDF</button>
</div>

<!-- Stats (8 cells, 4 per row) -->
<div class="stats-grid">
  <div class="stat"><div class="stat-val">${avgCal||'—'}</div><div class="stat-label">Avg Calories</div><div class="stat-sub">Goal: ${calGoal} kcal</div></div>
  <div class="stat"><div class="stat-val ${avgPro>=proGoal*0.9?'green':'red'}">${avgPro||'—'}g</div><div class="stat-label">Avg Protein</div><div class="stat-sub">Goal: ${proGoal}g</div></div>
  <div class="stat"><div class="stat-val">${avgCarb||'—'}g</div><div class="stat-label">Avg Carbs</div></div>
  <div class="stat"><div class="stat-val">${avgFat||'—'}g</div><div class="stat-label">Avg Fat</div></div>
  <div class="stat"><div class="stat-val ${avgWater>=waterGoal*0.85?'green':'amber'}">${avgWater||'—'}L</div><div class="stat-label">Avg Water</div><div class="stat-sub">Goal: ${waterGoal}L</div></div>
  <div class="stat"><div class="stat-val ${workoutCount>=Math.round(n*0.6)?'green':'amber'}">${workoutCount}/${n}</div><div class="stat-label">Workouts</div></div>
  <div class="stat"><div class="stat-val ${weightChange!==null?(weightChange<=0?'green':'amber'):''}">${weightChange!==null?(weightChange>0?'+':'')+weightChange+'kg':'—'}</div><div class="stat-label">Weight Change</div><div class="stat-sub">${firstWeight?firstWeight+'→'+lastWeight+'kg':'No data'}</div></div>
  <div class="stat"><div class="stat-val">${loggedDays.length}/${n}</div><div class="stat-label">Days Logged</div></div>
</div>

<!-- Goal Progress -->
<div class="card">
  <h3>Goal Progress — period average vs targets</h3>
  <div class="goal-row">
    <div class="goal-top"><span class="goal-name">Calories</span><span class="goal-val">${avgCal} / ${calGoal} kcal</span></div>
    <div class="bar-bg"><div class="bar-fill" style="width:${Math.min(calGoal?avgCal/calGoal*100:0,100)}%;background:${avgCal>=calGoal*0.85&&avgCal<=calGoal*1.15?'#2d7a2d':'#c87d0e'}"></div></div>
  </div>
  <div class="goal-row">
    <div class="goal-top"><span class="goal-name">Protein</span><span class="goal-val">${avgPro}g / ${proGoal}g</span></div>
    <div class="bar-bg"><div class="bar-fill" style="width:${Math.min(proGoal?avgPro/proGoal*100:0,100)}%;background:${avgPro>=proGoal*0.9?'#2d7a2d':'#c0392b'}"></div></div>
  </div>
  <div class="goal-row">
    <div class="goal-top"><span class="goal-name">Hydration</span><span class="goal-val">${avgWater}L / ${waterGoal}L</span></div>
    <div class="bar-bg"><div class="bar-fill" style="width:${Math.min(waterGoal?avgWater/waterGoal*100:0,100)}%;background:${avgWater>=waterGoal*0.85?'#2d7a2d':'#c87d0e'}"></div></div>
  </div>
</div>

<!-- Charts row 1: Calorie + Protein -->
<div class="two-col">
  <div class="chart-wrap"><h3>Calorie Trend</h3><canvas id="calChart"></canvas></div>
  <div class="chart-wrap"><h3>Protein Trend</h3><canvas id="proChart"></canvas></div>
</div>

<!-- Charts row 2: Weight + Macro donut — on page 1 to fill space -->
<div class="two-col">
  <div class="chart-wrap"><h3>Weight Trend</h3><canvas id="wtChart"></canvas></div>
  <div class="chart-wrap donut-wrap"><h3>Macro Split (avg kcal)</h3><div class="donut-container"><canvas id="macroDonut"></canvas></div></div>
</div>

<!-- Water + Insights + Table in 3 columns on screen, stacked gracefully in print -->
<div class="three-col">
  <div class="chart-wrap"><h3>Daily Water Intake</h3><canvas id="waterChart"></canvas></div>
  <div class="card" style="margin-bottom:0">
    <h3>Insights</h3>
    ${insightsHTML}
  </div>
  <div class="card" style="margin-bottom:0">
    <h3>Day-by-Day Log</h3>
    <table>
      <thead><tr><th>Date</th><th>Cal</th><th>Pro</th><th>Carbs</th><th>Fat</th><th>Water</th><th>Wt</th><th>W</th></tr></thead>
      <tbody>${rowsHTML}</tbody>
    </table>
  </div>
</div>

<div class="footer">Generated by FitTrack &nbsp;·&nbsp; ${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})} &nbsp;·&nbsp; Personal use only</div>

<script>
const labels    = ${labels};
const calData   = ${calData};
const proData   = ${proData};
const carbData  = ${carbData};
const fatData   = ${fatData};
const wtData    = ${wtData};
const waterData = ${waterData};
const calGoal   = ${calGoal};
const proGoal   = ${proGoal};
const waterGoal = ${waterGoal};

const C = { // brand colors
  navy:'#1e3a5f', navyA:'rgba(30,58,95,0.12)',
  red:'#c0392b',  redA:'rgba(192,57,43,0.12)',
  green:'#2d7a2d',greenA:'rgba(45,122,45,0.15)',
  amber:'#c87d0e',amberA:'rgba(200,125,14,0.12)',
  border:'#e0d8d0', grid:'rgba(0,0,0,0.06)',
  muted:'#6b6b6b'
};

const base = {
  responsive:true, maintainAspectRatio:true,
  plugins:{ legend:{display:false}, tooltip:{mode:'index',intersect:false} },
  scales:{
    x:{ ticks:{color:C.muted,font:{size:9},maxTicksLimit:8}, grid:{color:C.grid} },
    y:{ ticks:{color:C.muted,font:{size:9}}, grid:{color:C.grid} }
  }
};

// Calorie trend
new Chart(document.getElementById('calChart'), {
  type:'line',
  data:{ labels, datasets:[
    { data:calData, borderColor:C.navy, backgroundColor:C.navyA, fill:true, tension:0.35, pointRadius:3, pointBackgroundColor:C.navy, label:'Cal' },
    { data:labels.map(()=>calGoal), borderColor:C.amber, borderDash:[5,4], borderWidth:1.5, pointRadius:0, label:'Goal' }
  ]},
  options:{...base, plugins:{...base.plugins, legend:{display:true, labels:{color:C.muted,font:{size:9},boxWidth:10}}}}
});

// Protein bars
new Chart(document.getElementById('proChart'), {
  type:'bar',
  data:{ labels, datasets:[
    { data:proData, backgroundColor:proData.map(v=>v>=proGoal?C.greenA.replace('0.15','0.6'):v>=proGoal*0.7?C.amberA.replace('0.12','0.55'):C.redA.replace('0.12','0.55')), borderWidth:0, label:'Protein (g)' },
    { data:labels.map(()=>proGoal), type:'line', borderColor:C.green, borderDash:[5,4], borderWidth:1.5, pointRadius:0, label:'Goal' }
  ]},
  options:{...base, plugins:{...base.plugins, legend:{display:true, labels:{color:C.muted,font:{size:9},boxWidth:10}}}}
});

// Weight trend
new Chart(document.getElementById('wtChart'), {
  type:'line',
  data:{ labels, datasets:[
    { data:wtData, borderColor:C.red, backgroundColor:C.redA, fill:true, tension:0.4, pointRadius:4, pointBackgroundColor:C.red, spanGaps:true, label:'Weight (kg)' }
  ]},
  options:{...base, plugins:{...base.plugins, legend:{display:true, labels:{color:C.muted,font:{size:9},boxWidth:10}}}}
});

// Macro donut — fixed square via container div, aspectRatio:1 enforces circle
new Chart(document.getElementById('macroDonut'), {
  type:'doughnut',
  data:{ labels:['Carbs','Protein','Fat'],
    datasets:[{ data:[${avgCarb*4}, ${avgPro*4}, ${avgFat*9}], backgroundColor:[C.navy,'#2d7a2d',C.amber], borderWidth:2, borderColor:'#fff' }]
  },
  options:{
    responsive:false,
    maintainAspectRatio:false,
    cutout:'65%',
    plugins:{ legend:{ position:'bottom', labels:{color:C.muted,font:{size:9},boxWidth:10,padding:6} } }
  }
});

// Water bars
new Chart(document.getElementById('waterChart'), {
  type:'bar',
  data:{ labels, datasets:[
    { data:waterData, backgroundColor:waterData.map(v=>v>=waterGoal?'rgba(30,58,95,0.65)':v>=waterGoal*0.7?'rgba(30,58,95,0.38)':'rgba(30,58,95,0.18)'), borderWidth:0, label:'Water (L)' }
  ]},
  options:{...base, plugins:{...base.plugins, legend:{display:false}}}
});
<\/script>
</body>
</html>`;
}
