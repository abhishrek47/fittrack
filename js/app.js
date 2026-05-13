// ============================================================
// FITTRACK PRO — APP.JS
// Multi-profile · localStorage · No backend required
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
  workout: { selectedVariation: 1 },
};

// ── DATE HELPERS ──────────────────────────────────────────
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function formatDate(str) {
  const d = new Date(str+'T00:00:00');
  if (str === todayStr()) return 'Today · ' + d.toLocaleDateString('en-IN',{weekday:'short',month:'short',day:'numeric'});
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
  // New: use exerciseProgress if available
  const progress = log.workout.exerciseProgress || {};
  return dayPlan.exercises.reduce((sum, ex) => {
    const prog = progress[ex.key];
    if (prog && prog.done) {
      return sum + getActualCalsBurned(ex.key, ex.reps, prog.sets || ex.sets, prog.reps || parseInt(ex.reps)||10, ACTIVE_PROFILE?.weight||70);
    }
    // Backward compat with old completedExercises array
    if ((log.workout.completedExercises||[]).includes(ex.key)) {
      return sum + getCalsBurned(ex.key, ex.sets, ACTIVE_PROFILE?.weight||70);
    }
    return sum;
  }, 0);
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
  if (setsEl) setsEl.textContent = prog.sets;
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
  if (repsEl) repsEl.textContent = prog.reps;
  const plan    = WORKOUT_PLANS.find(p=>p.id===STATE.workout.selectedVariation)||WORKOUT_PLANS[0];
  const dayPlan = plan.days.find(d=>d.day===workoutDayNum)||plan.days[0];
  const exPlan  = dayPlan.exercises.find(e=>e.key===key);
  const calEl   = document.getElementById(`cal_${key}`);
  if (calEl && exPlan) calEl.textContent = `~${getActualCalsBurned(key, exPlan.reps, prog.sets||0, prog.reps, ACTIVE_PROFILE?.weight||70)} kcal`;
}

function _updateWorkoutTotals() {
  const log     = getLog(STATE.currentDate);
  const plan    = WORKOUT_PLANS.find(p=>p.id===STATE.workout.selectedVariation)||WORKOUT_PLANS[0];
  const dayPlan = plan.days.find(d=>d.day===workoutDayNum)||plan.days[0];
  const doneCnt = Object.values(log.workout.exerciseProgress||{}).filter(p=>p.done).length
                  || (log.workout.completedExercises||[]).length;
  const doneCal = workoutCalsBurned(STATE.currentDate);
  setText('workout_done_count',  doneCnt);
  setText('workout_total_count', dayPlan.exercises.length);
  setText('workout_cal_burned',  doneCal);
  setBar('workout_progress_bar', dayPlan.exercises.length>0 ? Math.round(doneCnt/dayPlan.exercises.length*100) : 0);
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

async function _proceedAfterAuth(session) {
  AUTH_USER_ID = session?.user?.id || null;
  document.getElementById('authScreen').style.display = 'none';

  // Pull cloud profiles and merge with local
  if (AUTH_USER_ID && typeof pullProfilesFromCloud === 'function') {
    try {
      const cloudProfiles = await pullProfilesFromCloud(AUTH_USER_ID);
      if (Array.isArray(cloudProfiles) && cloudProfiles.length > 0) {
        const local = getAllProfiles();
        const localIds = new Set(local.map(p => p.id));
        let changed = false;
        cloudProfiles.forEach(cp => {
          if (!localIds.has(cp.id)) { local.push(cp); changed = true; }
        });
        if (changed) saveAllProfiles(local);
      }
    } catch(e) { /* non-blocking */ }
  }

  const profiles = getAllProfiles();
  const activeId = getActiveProfileId();

  // Prefix migration: if user has old un-prefixed profiles and now has auth,
  // we just load them as-is — they continue to work locally
  if (profiles.length === 0) {
    showSetup();
  } else if (profiles.length === 1 && activeId) {
    activateProfile(activeId);
  } else {
    showProfilePicker();
  }
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Always show auth screen first (or skip if no Supabase)
  if (!supabaseClient) {
    // No Supabase — go straight to local profile logic
    await _proceedAfterAuth(null);
    return;
  }

  // Check existing session
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (data?.session) {
      await _proceedAfterAuth(data.session);
    } else {
      document.getElementById('authScreen').style.display = 'block';
    }
  } catch(e) {
    // Fallback to local on error
    await _proceedAfterAuth(null);
  }
});

async function activateProfile(id) {
  ACTIVE_PROFILE = getProfile(id);
  if (!ACTIVE_PROFILE) { showProfilePicker(); return; }
  setActiveProfileId(id);
  LOG = loadLogs(id);
  const wk = loadWkState(id);
  if (wk.selectedVariation) STATE.workout.selectedVariation = wk.selectedVariation;
  // Hide all overlays
  document.getElementById('profilePickerScreen').style.display = 'none';
  document.getElementById('setupScreen').style.display = 'none';
  // Pull from cloud and merge (non-blocking — app loads immediately)
  if (typeof pullLogsFromCloud === 'function') {
    pullLogsFromCloud(id).then(cloudLogs => {
      if (cloudLogs && typeof cloudLogs === 'object') {
        // Cloud data wins for any date where it's newer (simple merge: cloud fills gaps)
        let changed = false;
        Object.keys(cloudLogs).forEach(date => {
          if (!LOG[date]) { LOG[date] = cloudLogs[date]; changed = true; }
        });
        if (changed) {
          saveLogs(id, LOG);
          // Re-render active section with merged data
          switchSection(STATE.activeSection);
        }
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
  document.querySelectorAll('.date-display').forEach(el => {
    el.textContent = formatDate(STATE.currentDate);
  });
}

function switchSection(name) {
  STATE.activeSection = name;
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById(`section-${name}`)?.classList.add('active');
  document.querySelector(`.bottom-nav-item[data-section="${name}"]`)?.classList.add('active');
  if (name==='dashboard') renderDashboard();
  if (name==='diet')      renderDiet();
  if (name==='workout')   renderWorkout();
  if (name==='bmi')       renderBMI();
  if (name==='habits')    renderHabits();
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

  // Workout status
  const plan    = WORKOUT_PLANS.find(p=>p.id===STATE.workout.selectedVariation)||WORKOUT_PLANS[0];
  const dayN    = log.workout.activeDay||1;
  const dayPlan = plan.days.find(d=>d.day===dayN)||plan.days[0];
  const done    = (log.workout.completedExercises||[]).length;
  const total   = dayPlan.exercises.length;
  setText('dash_workout_name', `${plan.shortName} · Day ${dayN}`);
  setText('dash_workout_day',  dayPlan.name);
  setText('dash_workout_prog', `${done}/${total} exercises`);
  setBar('dash_workout_bar', total>0 ? Math.round(done/total*100) : 0);

  renderStreaks();
}

function renderStreaks() {
  let streak = 0;
  let d = STATE.currentDate;
  for (let i=0;i<365;i++) {
    const l = LOG[d];
    if (l && Object.values(l.meals).flat().length>0) { streak++; d=offsetDate(d,-1); }
    else break;
  }
  setText('streak_log', streak);
  const log     = getLog(STATE.currentDate);
  const plan    = WORKOUT_PLANS.find(p=>p.id===STATE.workout.selectedVariation)||WORKOUT_PLANS[0];
  const dayPlan = plan.days.find(d=>d.day===(log.workout.activeDay||1))||plan.days[0];
  const wDone   = Object.values(log.workout.exerciseProgress||{}).filter(p=>p.done).length
                  || (log.workout.completedExercises||[]).length;
  setText('streak_workout', `${wDone}/${dayPlan.exercises.length}`);
  setText('streak_water',   log.water);
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
        <div class="meal-item-meta">${item.qty||1}× ${item.unit} · P:${Math.round((item.pro||0)*(item.qty||1))}g C:${Math.round((item.carb||0)*(item.qty||1))}g F:${Math.round((item.fat||0)*(item.qty||1))}g</div>
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
  document.getElementById('foodSearchModal').classList.remove('open');
  document.getElementById('foodSearchInput').value = '';
  document.getElementById('foodSearchResults').innerHTML = '';
}

function openFoodSearch(meal) {
  dietActiveSearch = meal;
  document.getElementById('foodSearchInput').value = '';
  document.getElementById('foodSearchResults').innerHTML = '';
  document.getElementById('foodSearchModal').classList.add('open');
  setTimeout(() => {
    const input = document.getElementById('foodSearchInput');
    input.focus();
    // Re-trigger search in case there's a cached value
    if (input.value) handleFoodSearch(input.value);
  }, 120);
}

let pendingFood = null;

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

  const cards = WORKOUT_PLANS.map(plan => {
    const isActive  = STATE.workout.selectedVariation === plan.id;
    const isRec     = rec && rec.planId === plan.id;
    const extraClass = isActive ? 'selected' : isRec ? 'recommended' : '';

    const recBanner = isRec ? `
      <div class="rec-banner">
        <span class="rec-star">★</span> Recommended for you
        <span class="rec-reason">${rec.reason}</span>
      </div>` : '';

    return `
      <div class="variation-card ${extraClass}" onclick="selectVariation(${plan.id})">
        ${recBanner}
        <div class="variation-header">
          <div>
            <div class="variation-title">${plan.name}</div>
            <div class="variation-level">${plan.level} · ${plan.goal}</div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-shrink:0">
            ${isActive ? '<span class="variation-badge">Active</span>' : ''}
            ${isRec && !isActive ? '<span class="variation-badge rec-badge">Best fit</span>' : ''}
          </div>
        </div>
        <div class="variation-meta">
          <p class="variation-desc">${plan.description}</p>
          <div class="variation-days">
            ${plan.days.map(d => `<span class="day-pill" style="color:${d.color};border-color:${d.color};background:${d.color}18">D${d.day}: ${d.name.split('—')[0].trim().split('–')[0].trim()}</span>`).join('')}
          </div>
          <button class="btn btn-navy btn-sm" style="margin-top:0.875rem;width:100%"
            onclick="event.stopPropagation();workoutView='day';workoutDayNum=1;openVariationDay(${plan.id},1)">
            Open Workout →
          </button>
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

  document.getElementById('workout_day_tabs').innerHTML = plan.days.map(d => `
    <button class="tab-btn ${workoutDayNum===d.day?'active':''}" onclick="switchWorkoutDay(${d.day})">Day ${d.day}</button>
  `).join('');

  const dayPlan = plan.days.find(d=>d.day===workoutDayNum)||plan.days[0];
  setText('workout_day_title', dayPlan.name);
  setText('workout_day_focus', dayPlan.focus);
  setText('workout_plan_name_badge', plan.shortName);

  const exerciseProgress = log.workout.exerciseProgress || {};
  document.getElementById('workout_exercises').innerHTML = dayPlan.exercises.map(ex => {
    const exData = EXERCISES[ex.key];
    if (!exData) return '';
    const prog     = exerciseProgress[ex.key];
    const isSel    = prog ? prog.done : completed.includes(ex.key);
    const muscleC  = getMuscleColor(exData.muscle);
    const doneSets = prog ? prog.sets : (isSel ? ex.sets : 0);
    const doneReps = prog ? prog.reps : (parseInt(ex.reps) || 10);
    const calsBurned = getActualCalsBurned(ex.key, ex.reps, doneSets, doneReps, ACTIVE_PROFILE?.weight||70);
    return `
    <div class="exercise-card ${isSel?'completed selected':''}" id="ex_card_${ex.key}">
      <div class="exercise-header">
        <div class="exercise-info" onclick="toggleExerciseDetail('${ex.key}')" style="cursor:pointer;flex:1">
          <div class="exercise-name">${exData.name}</div>
          <div class="exercise-meta">${exData.equipment}${ex.note?' · '+ex.note:''}</div>
        </div>
        <div class="reps-tracker" onclick="event.stopPropagation()">
          <span class="reps-planned">Plan: ${ex.sets}×${ex.reps}</span>
          <div class="reps-input-row">
            <label class="reps-label">Sets:</label>
            <button class="reps-btn" onclick="changeExerciseSets('${ex.key}',-1)">−</button>
            <span class="reps-val" id="sets_${ex.key}">${doneSets}</span>
            <button class="reps-btn" onclick="changeExerciseSets('${ex.key}',1)">+</button>
          </div>
          <div class="reps-input-row">
            <label class="reps-label">Reps:</label>
            <button class="reps-btn" onclick="changeExerciseReps('${ex.key}',-1)">−</button>
            <span class="reps-val" id="reps_${ex.key}">${doneReps}</span>
            <button class="reps-btn" onclick="changeExerciseReps('${ex.key}',1)">+</button>
          </div>
          <div class="reps-cals" id="cal_${ex.key}">~${calsBurned} kcal</div>
        </div>
        <button class="exercise-expand-btn" onclick="toggleExerciseDetail('${ex.key}')">▼</button>
      </div>
      <div class="exercise-detail" id="ex_detail_${ex.key}">
        <div class="video-wrap">
          <iframe src="https://www.youtube.com/embed/${exData.youtubeId}?rel=0&modestbranding=1&autoplay=0" loading="lazy" allowfullscreen title="${exData.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"></iframe>
          <div class="video-fallback" style="display:none">Video unavailable offline</div>
        </div>
        <div class="form-tips">
          <h4>Form Cues</h4>
          ${exData.form.map((tip,i) => `<div class="form-tip-item"><span class="form-tip-num">${i+1}</span><span>${tip}</span></div>`).join('')}
        </div>
        <div class="exercise-tip-box">💡 ${exData.tips}</div>
      </div>
    </div>`;
  }).join('');

  const doneCnt = Object.values(exerciseProgress).filter(p=>p.done).length || completed.length;
  const doneCal = workoutCalsBurned(STATE.currentDate);
  setText('workout_done_count',  doneCnt);
  setText('workout_total_count', dayPlan.exercises.length);
  setText('workout_cal_burned',  doneCal);
  setBar('workout_progress_bar', dayPlan.exercises.length>0 ? Math.round(doneCnt/dayPlan.exercises.length*100) : 0);
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
}
function goToToday() {
  STATE.currentDate = todayStr();
  renderAllDateNavs();
  switchSection(STATE.activeSection);
}

// ── PROFILE MANAGEMENT ────────────────────────────────────
function openProfileMenu() {
  const profiles = getAllProfiles();
  const menu = document.getElementById('profileMenuModal');
  const list = document.getElementById('profileSwitchList');
  if (list) {
    list.innerHTML = profiles.map(p => `
      <div class="profile-card ${p.id===ACTIVE_PROFILE?.id?'active-profile':''}" onclick="${p.id!==ACTIVE_PROFILE?.id?`switchProfile('${p.id}')`:''}" style="${p.id===ACTIVE_PROFILE?.id?'pointer-events:none':'cursor:pointer'}">
        <div class="profile-avatar" style="background:${p.avatarColor||'var(--accent)'};">${p.name.charAt(0).toUpperCase()}</div>
        <div class="profile-info">
          <div class="profile-name">${p.name}</div>
          <div class="profile-meta">${p.weight}kg · ${p.age}y</div>
        </div>
        ${p.id===ACTIVE_PROFILE?.id ? '<span class="tag tag-green">Active</span>' : '<span class="profile-arrow">→</span>'}
      </div>
    `).join('');
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
window.openFoodSearch       = openFoodSearch;
window.handleFoodSearch     = handleFoodSearch;
window.selectFood           = selectFood;
window.updateQtyPreview     = updateQtyPreview;
window.changeQty            = changeQty;
window.confirmAddFood       = confirmAddFood;
window.removeFood           = removeFood;
window.toggleMeal           = toggleMeal;
window.addCustomFood        = addCustomFood;
window.selectVariation      = selectVariation;
window.openVariationDay     = openVariationDay;
window.switchWorkoutDay     = switchWorkoutDay;
window.toggleExerciseSelect = toggleExerciseSelect;
window.toggleExerciseDetail = toggleExerciseDetail;
window.backToPlans          = backToPlans;
window.changeHabit          = changeHabit;
window.updateProfile        = updateProfile;
window.openProfileMenu      = openProfileMenu;
window.switchProfile        = switchProfile;
window.addNewProfile        = addNewProfile;
window.activateProfile      = activateProfile;
window.STATE                = STATE;
