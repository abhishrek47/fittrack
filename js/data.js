// ============================================================
// FITTRACK PRO — DATA.JS
// 100% Vegetarian · Gujarati Brahmin focus
// ============================================================

// ----------------------------------------------------------
// FOOD DATABASE
// Pure vegetarian — no eggs, no meat, no fish
// Cal/macros per single default serving
// Micros: fiber(g), sodium(mg), calcium(mg), iron(mg), vitC(mg)
// ----------------------------------------------------------
const FOODS = [

  // ── GUJARATI BREAKFAST ──────────────────────────────────
  { id:1,   name:"Thepla (Plain)",        cat:"breakfast", emoji:"🫓", serving:2,  unit:"pieces",  cal:300, pro:8,   carb:48, fat:10,  fiber:3,   sodium:340, calcium:60,  iron:2.5, vitC:2  },
  { id:2,   name:"Methi Thepla",          cat:"breakfast", emoji:"🫓", serving:2,  unit:"pieces",  cal:320, pro:9,   carb:48, fat:11,  fiber:4,   sodium:360, calcium:80,  iron:3,   vitC:5  },
  { id:3,   name:"Khakhra (Plain)",        cat:"breakfast", emoji:"🫓", serving:3,  unit:"pieces",  cal:135, pro:4,   carb:22, fat:4,   fiber:2,   sodium:200, calcium:25,  iron:1.5, vitC:0  },
  { id:4,   name:"Methi Khakhra",         cat:"breakfast", emoji:"🫓", serving:3,  unit:"pieces",  cal:150, pro:4.5, carb:22, fat:5,   fiber:3,   sodium:220, calcium:40,  iron:2,   vitC:2  },
  { id:5,   name:"Pudla / Besan Chilla",  cat:"breakfast", emoji:"🥞", serving:2,  unit:"pieces",  cal:300, pro:16,  carb:38, fat:8,   fiber:4,   sodium:350, calcium:60,  iron:3,   vitC:5  },
  { id:6,   name:"Sev Tameta",            cat:"breakfast", emoji:"🍅", serving:1,  unit:"bowl",    cal:220, pro:6,   carb:28, fat:10,  fiber:2.5, sodium:380, calcium:35,  iron:1.5, vitC:15 },
  { id:7,   name:"Batata Poha",           cat:"breakfast", emoji:"🥣", serving:1,  unit:"bowl",    cal:280, pro:5,   carb:55, fat:5,   fiber:2,   sodium:320, calcium:25,  iron:2,   vitC:8  },
  { id:8,   name:"Dudhi Muthiya",         cat:"breakfast", emoji:"🟢", serving:3,  unit:"pieces",  cal:270, pro:9,   carb:42, fat:8,   fiber:4,   sodium:300, calcium:80,  iron:2.5, vitC:10 },
  { id:9,   name:"Handvo (slice)",        cat:"breakfast", emoji:"🟨", serving:2,  unit:"slices",  cal:360, pro:14,  carb:52, fat:10,  fiber:5,   sodium:420, calcium:90,  iron:3,   vitC:8  },
  { id:10,  name:"Sukhdi / Gol Papdi",   cat:"breakfast", emoji:"🟡", serving:2,  unit:"pieces",  cal:300, pro:5,   carb:40, fat:14,  fiber:1.5, sodium:80,  calcium:60,  iron:1.5, vitC:0  },
  { id:11,  name:"Bajri Rotlo",           cat:"breakfast", emoji:"🫓", serving:1,  unit:"piece",   cal:180, pro:5,   carb:33, fat:4,   fiber:4,   sodium:160, calcium:50,  iron:2.8, vitC:0  },
  { id:12,  name:"Fafda",                 cat:"breakfast", emoji:"🟡", serving:2,  unit:"pieces",  cal:180, pro:5,   carb:22, fat:8,   fiber:2,   sodium:340, calcium:30,  iron:1.5, vitC:0  },
  { id:13,  name:"Jalebi",               cat:"breakfast", emoji:"🍥", serving:2,  unit:"pieces",  cal:150, pro:1,   carb:35, fat:2,   fiber:0,   sodium:20,  calcium:10,  iron:0.5, vitC:0  },
  { id:14,  name:"Sev Usal",             cat:"breakfast", emoji:"🍛", serving:1,  unit:"bowl",    cal:320, pro:12,  carb:45, fat:10,  fiber:6,   sodium:450, calcium:60,  iron:3.5, vitC:8  },
  { id:15,  name:"Khandvi",              cat:"breakfast", emoji:"🟡", serving:6,  unit:"pieces",  cal:200, pro:8,   carb:27, fat:6,   fiber:2,   sodium:320, calcium:80,  iron:1.5, vitC:3  },
  { id:16,  name:"Dhokla",               cat:"breakfast", emoji:"🟨", serving:4,  unit:"pieces",  cal:220, pro:9,   carb:36, fat:4,   fiber:2.5, sodium:400, calcium:50,  iron:2,   vitC:3  },
  { id:17,  name:"Muthiya (steamed)",    cat:"breakfast", emoji:"🟢", serving:3,  unit:"pieces",  cal:240, pro:9,   carb:38, fat:7,   fiber:4,   sodium:280, calcium:80,  iron:2.5, vitC:8  },
  { id:18,  name:"Rava Idli",            cat:"breakfast", emoji:"🥘", serving:2,  unit:"pieces",  cal:160, pro:5,   carb:30, fat:3,   fiber:1.5, sodium:280, calcium:25,  iron:1,   vitC:0  },
  { id:19,  name:"Idli",                 cat:"breakfast", emoji:"🥘", serving:3,  unit:"pieces",  cal:117, pro:5,   carb:24, fat:1.2, fiber:1.5, sodium:270, calcium:30,  iron:0.6, vitC:0  },
  { id:20,  name:"Dosa (Plain)",          cat:"breakfast", emoji:"🫓", serving:1,  unit:"piece",   cal:133, pro:3.4, carb:24, fat:2.6, fiber:1,   sodium:230, calcium:15,  iron:0.8, vitC:0  },
  { id:21,  name:"Masala Dosa",          cat:"breakfast", emoji:"🫓", serving:1,  unit:"piece",   cal:350, pro:8,   carb:55, fat:11,  fiber:3,   sodium:450, calcium:40,  iron:1.5, vitC:10 },
  { id:22,  name:"Upma",                 cat:"breakfast", emoji:"🥣", serving:1,  unit:"bowl",    cal:250, pro:6,   carb:40, fat:8,   fiber:2.5, sodium:380, calcium:30,  iron:1.5, vitC:4  },
  { id:23,  name:"Shiro / Halwa",        cat:"breakfast", emoji:"🟡", serving:1,  unit:"bowl",    cal:280, pro:4,   carb:38, fat:13,  fiber:1,   sodium:40,  calcium:30,  iron:1,   vitC:0  },

  // ── DAIRY / MILK / CURD ──────────────────────────────────
  { id:30,  name:"Full Fat Milk",         cat:"breakfast", emoji:"🥛", serving:1,  unit:"glass",   cal:150, pro:8,   carb:11.5,fat:8,  fiber:0,   sodium:105, calcium:280, iron:0.1, vitC:0  },
  { id:31,  name:"Toned Milk",            cat:"breakfast", emoji:"🥛", serving:1,  unit:"glass",   cal:120, pro:8,   carb:11,  fat:4.5, fiber:0,   sodium:105, calcium:295, iron:0.1, vitC:0  },
  { id:32,  name:"Dahi / Curd",           cat:"breakfast", emoji:"🫙", serving:1,  unit:"bowl",    cal:100, pro:5,   carb:8,   fat:4,   fiber:0,   sodium:80,  calcium:180, iron:0.1, vitC:1  },
  { id:33,  name:"Masala Chaas",          cat:"breakfast", emoji:"🥛", serving:1,  unit:"glass",   cal:50,  pro:2.5, carb:6,   fat:1,   fiber:0,   sodium:200, calcium:120, iron:0,   vitC:2  },
  { id:34,  name:"Shrikhand (1 bowl)",   cat:"breakfast", emoji:"🍮", serving:1,  unit:"bowl",    cal:320, pro:8,   carb:50,  fat:10,  fiber:0,   sodium:60,  calcium:250, iron:0.2, vitC:1  },
  { id:35,  name:"Basundi",               cat:"breakfast", emoji:"🥛", serving:1,  unit:"bowl",    cal:250, pro:8,   carb:38,  fat:8,   fiber:0,   sodium:90,  calcium:300, iron:0.2, vitC:1  },
  { id:36,  name:"Doodh Pak",            cat:"breakfast", emoji:"🍚", serving:1,  unit:"bowl",    cal:300, pro:9,   carb:52,  fat:7,   fiber:0.5, sodium:80,  calcium:280, iron:0.5, vitC:2  },
  { id:37,  name:"Paneer (raw, 100g)",   cat:"breakfast", emoji:"🧀", serving:100,unit:"g",       cal:265, pro:18,  carb:3,   fat:20,  fiber:0,   sodium:400, calcium:480, iron:0.5, vitC:0  },

  // ── CEREALS & SPREADS ────────────────────────────────────
  { id:40,  name:"Oatmeal (cooked)",      cat:"breakfast", emoji:"🥣", serving:1,  unit:"bowl",    cal:150, pro:5,   carb:27,  fat:3,   fiber:4,   sodium:10,  calcium:20,  iron:2,   vitC:0  },
  { id:41,  name:"Bread (Whole Wheat)",   cat:"breakfast", emoji:"🍞", serving:2,  unit:"slices",  cal:160, pro:7,   carb:28,  fat:2.5, fiber:4,   sodium:280, calcium:40,  iron:2.5, vitC:0  },
  { id:42,  name:"Peanut Butter",         cat:"breakfast", emoji:"🥜", serving:2,  unit:"tbsp",    cal:190, pro:8,   carb:6,   fat:16,  fiber:2,   sodium:150, calcium:15,  iron:0.6, vitC:0  },
  { id:43,  name:"Banana",               cat:"breakfast", emoji:"🍌", serving:1,  unit:"medium",  cal:105, pro:1.3, carb:27,  fat:0.4, fiber:3,   sodium:1,   calcium:5,   iron:0.3, vitC:10 },
  { id:44,  name:"Apple",                cat:"breakfast", emoji:"🍎", serving:1,  unit:"medium",  cal:95,  pro:0.5, carb:25,  fat:0.3, fiber:4.4, sodium:2,   calcium:10,  iron:0.2, vitC:8  },

  // ── GUJARATI LUNCH / DINNER ──────────────────────────────
  { id:50,  name:"Rotli / Chapati",       cat:"lunch",     emoji:"🫓", serving:2,  unit:"pieces",  cal:160, pro:5,   carb:30,  fat:3,   fiber:3,   sodium:160, calcium:25,  iron:2,   vitC:0  },
  { id:51,  name:"Bajri Rotla",           cat:"lunch",     emoji:"🫓", serving:1,  unit:"piece",   cal:180, pro:5,   carb:33,  fat:4,   fiber:4,   sodium:160, calcium:50,  iron:2.8, vitC:0  },
  { id:52,  name:"Steamed Rice",          cat:"lunch",     emoji:"🍚", serving:1,  unit:"bowl",    cal:195, pro:4,   carb:43,  fat:0.4, fiber:0.6, sodium:5,   calcium:10,  iron:0.4, vitC:0  },
  { id:53,  name:"Dal Dhokli",            cat:"lunch",     emoji:"🍲", serving:1,  unit:"bowl",    cal:280, pro:10,  carb:45,  fat:7,   fiber:5,   sodium:420, calcium:70,  iron:2.8, vitC:5  },
  { id:54,  name:"Gujarati Kadhi",        cat:"lunch",     emoji:"🥣", serving:1,  unit:"bowl",    cal:120, pro:4,   carb:18,  fat:4,   fiber:0.5, sodium:350, calcium:140, iron:0.3, vitC:2  },
  { id:55,  name:"Dal (Toor / Arhar)",    cat:"lunch",     emoji:"🍲", serving:1,  unit:"bowl",    cal:180, pro:10,  carb:28,  fat:3,   fiber:6,   sodium:350, calcium:60,  iron:3,   vitC:3  },
  { id:56,  name:"Undhiyu",              cat:"lunch",     emoji:"🍛", serving:1,  unit:"bowl",    cal:250, pro:8,   carb:32,  fat:10,  fiber:7,   sodium:480, calcium:80,  iron:3,   vitC:20 },
  { id:57,  name:"Valor Papdi Shaak",    cat:"lunch",     emoji:"🟢", serving:1,  unit:"bowl",    cal:160, pro:6,   carb:22,  fat:5,   fiber:5,   sodium:340, calcium:60,  iron:2.5, vitC:10 },
  { id:58,  name:"Tindora Shaak",        cat:"lunch",     emoji:"🥗", serving:1,  unit:"bowl",    cal:100, pro:3,   carb:15,  fat:3,   fiber:3,   sodium:280, calcium:40,  iron:1.5, vitC:15 },
  { id:59,  name:"Dudhi Shaak",          cat:"lunch",     emoji:"🟢", serving:1,  unit:"bowl",    cal:80,  pro:2,   carb:12,  fat:2.5, fiber:2.5, sodium:240, calcium:30,  iron:0.8, vitC:12 },
  { id:60,  name:"Ringan Batata Shaak",  cat:"lunch",     emoji:"🍆", serving:1,  unit:"bowl",    cal:150, pro:3,   carb:24,  fat:5,   fiber:4,   sodium:320, calcium:30,  iron:1.5, vitC:8  },
  { id:61,  name:"Bhindi Shaak",         cat:"lunch",     emoji:"🥬", serving:1,  unit:"bowl",    cal:120, pro:3,   carb:18,  fat:4,   fiber:3.5, sodium:300, calcium:60,  iron:1.8, vitC:20 },
  { id:62,  name:"Turiya Shaak",         cat:"lunch",     emoji:"🟢", serving:1,  unit:"bowl",    cal:90,  pro:2,   carb:14,  fat:3,   fiber:2.5, sodium:260, calcium:35,  iron:1,   vitC:12 },
  { id:63,  name:"Batata nu Shaak",      cat:"lunch",     emoji:"🥔", serving:1,  unit:"bowl",    cal:170, pro:3,   carb:28,  fat:5,   fiber:3,   sodium:320, calcium:20,  iron:1.2, vitC:20 },
  { id:64,  name:"Sev Tameta Shaak",     cat:"lunch",     emoji:"🍅", serving:1,  unit:"bowl",    cal:220, pro:6,   carb:28,  fat:10,  fiber:2.5, sodium:380, calcium:35,  iron:1.5, vitC:15 },
  { id:65,  name:"Rajma",               cat:"lunch",     emoji:"🫘", serving:1,  unit:"bowl",    cal:240, pro:13,  carb:40,  fat:3,   fiber:8,   sodium:400, calcium:80,  iron:4,   vitC:2  },
  { id:66,  name:"Chole / Chana",       cat:"lunch",     emoji:"🫘", serving:1,  unit:"bowl",    cal:250, pro:12,  carb:38,  fat:5,   fiber:9,   sodium:380, calcium:90,  iron:4.5, vitC:3  },
  { id:67,  name:"Moong Dal",           cat:"lunch",     emoji:"🟡", serving:1,  unit:"bowl",    cal:150, pro:10,  carb:24,  fat:1.5, fiber:7,   sodium:280, calcium:45,  iron:2.5, vitC:2  },
  { id:68,  name:"Vaghareli Khichdi",   cat:"lunch",     emoji:"🥣", serving:1,  unit:"bowl",    cal:290, pro:9,   carb:52,  fat:6,   fiber:4,   sodium:380, calcium:35,  iron:2,   vitC:2  },
  { id:69,  name:"Bajri Khichdi",       cat:"lunch",     emoji:"🥣", serving:1,  unit:"bowl",    cal:280, pro:9,   carb:50,  fat:5,   fiber:5,   sodium:350, calcium:50,  iron:2.5, vitC:0  },
  { id:70,  name:"Paneer Butter Masala",cat:"lunch",     emoji:"🍛", serving:1,  unit:"serving", cal:350, pro:16,  carb:22,  fat:22,  fiber:3,   sodium:600, calcium:320, iron:1.5, vitC:5  },
  { id:71,  name:"Palak Paneer",        cat:"lunch",     emoji:"🍛", serving:1,  unit:"serving", cal:280, pro:14,  carb:15,  fat:18,  fiber:4,   sodium:550, calcium:400, iron:3.5, vitC:20 },
  { id:72,  name:"Sambar",              cat:"lunch",     emoji:"🍲", serving:1,  unit:"bowl",    cal:130, pro:7,   carb:20,  fat:3,   fiber:5,   sodium:420, calcium:60,  iron:2.5, vitC:15 },
  { id:73,  name:"Patra",               cat:"lunch",     emoji:"🟢", serving:4,  unit:"pieces",  cal:160, pro:5,   carb:22,  fat:6,   fiber:3.5, sodium:300, calcium:70,  iron:2,   vitC:8  },
  { id:74,  name:"Khandvi",             cat:"lunch",     emoji:"🟡", serving:6,  unit:"pieces",  cal:200, pro:8,   carb:27,  fat:6,   fiber:2,   sodium:320, calcium:80,  iron:1.5, vitC:3  },
  { id:75,  name:"Surti Locho",         cat:"lunch",     emoji:"🟡", serving:1,  unit:"bowl",    cal:200, pro:8,   carb:30,  fat:6,   fiber:3,   sodium:380, calcium:60,  iron:2,   vitC:3  },
  { id:76,  name:"Puran Poli",          cat:"lunch",     emoji:"🫓", serving:1,  unit:"piece",   cal:250, pro:5,   carb:44,  fat:7,   fiber:3,   sodium:120, calcium:40,  iron:2,   vitC:0  },
  { id:77,  name:"Mango Ras (Aamras)",  cat:"lunch",     emoji:"🥭", serving:1,  unit:"bowl",    cal:150, pro:1.5, carb:38,  fat:0.5, fiber:3.7, sodium:2,   calcium:20,  iron:0.3, vitC:57 },
  { id:78,  name:"Veg Biryani",         cat:"lunch",     emoji:"🍛", serving:1,  unit:"serving", cal:380, pro:9,   carb:68,  fat:9,   fiber:4,   sodium:780, calcium:40,  iron:2,   vitC:8  },
  { id:79,  name:"Doodh Pak / Kheer",   cat:"dinner",    emoji:"🍚", serving:1,  unit:"bowl",    cal:300, pro:9,   carb:52,  fat:7,   fiber:0.5, sodium:80,  calcium:280, iron:0.5, vitC:2  },
  { id:80,  name:"Khichdi",             cat:"dinner",    emoji:"🥣", serving:1,  unit:"bowl",    cal:290, pro:11,  carb:52,  fat:5,   fiber:5,   sodium:380, calcium:50,  iron:2.5, vitC:2  },
  { id:81,  name:"Dal Dhokli",          cat:"dinner",    emoji:"🍲", serving:1,  unit:"bowl",    cal:280, pro:10,  carb:45,  fat:7,   fiber:5,   sodium:420, calcium:70,  iron:2.8, vitC:5  },
  { id:82,  name:"Moong Dal Chilla",    cat:"dinner",    emoji:"🥞", serving:2,  unit:"pieces",  cal:240, pro:14,  carb:36,  fat:5,   fiber:5,   sodium:300, calcium:50,  iron:3,   vitC:0  },
  { id:83,  name:"Veg Soup",            cat:"dinner",    emoji:"🍵", serving:1,  unit:"bowl",    cal:80,  pro:3,   carb:14,  fat:2,   fiber:3,   sodium:600, calcium:30,  iron:1,   vitC:12 },
  { id:84,  name:"Quinoa (cooked)",     cat:"dinner",    emoji:"🥣", serving:1,  unit:"cup",     cal:222, pro:8,   carb:39,  fat:3.5, fiber:5,   sodium:13,  calcium:31,  iron:2.8, vitC:0  },
  { id:85,  name:"Brown Rice",          cat:"dinner",    emoji:"🍚", serving:1,  unit:"bowl",    cal:215, pro:5,   carb:45,  fat:1.8, fiber:3.5, sodium:10,  calcium:20,  iron:1,   vitC:0  },

  // ── GUJARATI FARSAN / SNACKS ─────────────────────────────
  { id:100, name:"Sev (plain)",          cat:"snacks",    emoji:"🟡", serving:30, unit:"g",       cal:145, pro:4,   carb:18,  fat:7,   fiber:2,   sodium:340, calcium:20,  iron:1.5, vitC:0  },
  { id:101, name:"Bhavnagri Gathiya",    cat:"snacks",    emoji:"🟡", serving:30, unit:"g",       cal:130, pro:4,   carb:17,  fat:6,   fiber:2,   sodium:300, calcium:20,  iron:1,   vitC:0  },
  { id:102, name:"Papdi (farsan)",       cat:"snacks",    emoji:"🟡", serving:8,  unit:"pieces",  cal:150, pro:3,   carb:20,  fat:7,   fiber:1.5, sodium:280, calcium:15,  iron:1,   vitC:0  },
  { id:103, name:"Chakli",              cat:"snacks",    emoji:"🌀", serving:2,  unit:"pieces",  cal:120, pro:2.5, carb:16,  fat:6,   fiber:1.5, sodium:220, calcium:15,  iron:0.8, vitC:0  },
  { id:104, name:"Peanut Chikki",       cat:"snacks",    emoji:"🍬", serving:1,  unit:"piece",   cal:130, pro:4,   carb:15,  fat:7,   fiber:1.5, sodium:10,  calcium:20,  iron:0.8, vitC:0  },
  { id:105, name:"Sesame Chikki",       cat:"snacks",    emoji:"🍬", serving:1,  unit:"piece",   cal:120, pro:3,   carb:14,  fat:7,   fiber:1,   sodium:5,   calcium:90,  iron:1.5, vitC:0  },
  { id:106, name:"Sev Mamra",           cat:"snacks",    emoji:"🍿", serving:1,  unit:"bowl",    cal:180, pro:4,   carb:28,  fat:6,   fiber:1.5, sodium:360, calcium:20,  iron:1,   vitC:0  },
  { id:107, name:"Sing Dana (roasted)", cat:"snacks",    emoji:"🥜", serving:30, unit:"g",       cal:165, pro:7,   carb:5,   fat:14,  fiber:2.5, sodium:5,   calcium:20,  iron:1,   vitC:0  },
  { id:108, name:"Kaju Katli",          cat:"snacks",    emoji:"🍬", serving:2,  unit:"pieces",  cal:160, pro:3,   carb:22,  fat:8,   fiber:0.5, sodium:10,  calcium:10,  iron:0.5, vitC:0  },
  { id:109, name:"Mohanthal",           cat:"snacks",    emoji:"🟡", serving:1,  unit:"piece",   cal:250, pro:5,   carb:35,  fat:11,  fiber:1,   sodium:30,  calcium:30,  iron:1,   vitC:0  },
  { id:110, name:"Pani Puri",           cat:"snacks",    emoji:"🥗", serving:6,  unit:"pieces",  cal:200, pro:4,   carb:35,  fat:6,   fiber:3,   sodium:450, calcium:30,  iron:1.5, vitC:5  },
  { id:111, name:"Sev Puri",            cat:"snacks",    emoji:"🍛", serving:4,  unit:"pieces",  cal:220, pro:5,   carb:32,  fat:9,   fiber:3,   sodium:500, calcium:40,  iron:1.5, vitC:8  },
  { id:112, name:"Dahi Puri",           cat:"snacks",    emoji:"🍛", serving:4,  unit:"pieces",  cal:240, pro:6,   carb:36,  fat:8,   fiber:2,   sodium:480, calcium:80,  iron:1.5, vitC:8  },
  { id:113, name:"Chai (with milk)",    cat:"snacks",    emoji:"🍵", serving:1,  unit:"cup",     cal:80,  pro:2,   carb:14,  fat:2,   fiber:0,   sodium:20,  calcium:90,  iron:0.1, vitC:0  },
  { id:114, name:"Black Coffee",        cat:"snacks",    emoji:"☕", serving:1,  unit:"cup",     cal:5,   pro:0.3, carb:0.7, fat:0,   fiber:0,   sodium:5,   calcium:5,   iron:0,   vitC:0  },
  { id:115, name:"Almonds",             cat:"snacks",    emoji:"🤎", serving:20, unit:"g",       cal:116, pro:4,   carb:4,   fat:10,  fiber:2,   sodium:0,   calcium:50,  iron:1,   vitC:0  },
  { id:116, name:"Walnuts",             cat:"snacks",    emoji:"🤎", serving:30, unit:"g",       cal:196, pro:4.5, carb:4,   fat:19.5,fiber:2,   sodium:1,   calcium:28,  iron:0.8, vitC:0  },
  { id:117, name:"Whey Protein Shake",  cat:"snacks",    emoji:"🥤", serving:1,  unit:"scoop",   cal:120, pro:24,  carb:3,   fat:1.5, fiber:0,   sodium:130, calcium:130, iron:0.5, vitC:0  },
  { id:118, name:"Protein Bar",         cat:"snacks",    emoji:"🍫", serving:1,  unit:"bar",     cal:200, pro:20,  carb:22,  fat:5,   fiber:3,   sodium:200, calcium:100, iron:1,   vitC:0  },
  { id:119, name:"Greek Yogurt",        cat:"snacks",    emoji:"🫙", serving:1,  unit:"cup",     cal:130, pro:15,  carb:9,   fat:3,   fiber:0,   sodium:65,  calcium:200, iron:0,   vitC:0  },
  { id:120, name:"Sprouts Bhel",        cat:"snacks",    emoji:"🌱", serving:1,  unit:"bowl",    cal:180, pro:10,  carb:28,  fat:3,   fiber:7,   sodium:350, calcium:50,  iron:3,   vitC:15 },
  { id:121, name:"Fruit Salad",         cat:"snacks",    emoji:"🍓", serving:1,  unit:"bowl",    cal:120, pro:1.5, carb:28,  fat:0.5, fiber:4,   sodium:10,  calcium:25,  iron:0.5, vitC:40 },
  { id:122, name:"Mango",               cat:"snacks",    emoji:"🥭", serving:1,  unit:"medium",  cal:135, pro:1,   carb:35,  fat:0.6, fiber:3.7, sodium:2,   calcium:15,  iron:0.2, vitC:57 },
  { id:123, name:"Sweet Lassi",         cat:"snacks",    emoji:"🥛", serving:1,  unit:"glass",   cal:200, pro:6,   carb:32,  fat:5,   fiber:0,   sodium:80,  calcium:220, iron:0.1, vitC:1  },
  { id:124, name:"Aam Panna",           cat:"snacks",    emoji:"🍹", serving:1,  unit:"glass",   cal:80,  pro:0.5, carb:20,  fat:0,   fiber:1,   sodium:15,  calcium:10,  iron:0.2, vitC:20 },
  { id:125, name:"Coconut Water",       cat:"snacks",    emoji:"🥥", serving:1,  unit:"glass",   cal:45,  pro:0.5, carb:10,  fat:0.5, fiber:3,   sodium:25,  calcium:50,  iron:0.3, vitC:5  },
  { id:126, name:"Buttermilk (Chaas)",  cat:"snacks",    emoji:"🥛", serving:1,  unit:"glass",   cal:40,  pro:2.5, carb:5,   fat:0.5, fiber:0,   sodium:200, calcium:120, iron:0,   vitC:1  },
  { id:127, name:"Dark Chocolate",      cat:"snacks",    emoji:"🍫", serving:1,  unit:"square",  cal:55,  pro:0.6, carb:6,   fat:3.5, fiber:0.8, sodium:2,   calcium:7,   iron:0.4, vitC:0  },
  { id:128, name:"Boiled Sweet Potato", cat:"snacks",    emoji:"🍠", serving:1,  unit:"medium",  cal:130, pro:2.5, carb:30,  fat:0.1, fiber:4,   sodium:41,  calcium:40,  iron:0.9, vitC:20 },
  { id:129, name:"Avocado (half)",      cat:"snacks",    emoji:"🥑", serving:0.5,unit:"piece",   cal:160, pro:2,   carb:9,   fat:15,  fiber:7,   sodium:7,   calcium:12,  iron:0.6, vitC:10 },

  // ── FITNESS / HEALTH FOODS ───────────────────────────────
  { id:140, name:"Paneer Bhurji",       cat:"lunch",     emoji:"🧀", serving:1,  unit:"serving", cal:250, pro:18,  carb:8,   fat:16,  fiber:2,   sodium:480, calcium:380, iron:1,   vitC:5  },
  { id:141, name:"Tofu (grilled 100g)", cat:"lunch",     emoji:"🟨", serving:100,unit:"g",       cal:120, pro:13,  carb:3,   fat:6,   fiber:0.3, sodium:10,  calcium:200, iron:2.5, vitC:0  },
  { id:142, name:"Broccoli (steamed)",  cat:"lunch",     emoji:"🥦", serving:1,  unit:"cup",     cal:55,  pro:4,   carb:11,  fat:0.6, fiber:5,   sodium:30,  calcium:47,  iron:0.7, vitC:81 },
  { id:143, name:"Spinach (palak)",     cat:"lunch",     emoji:"🥬", serving:100,unit:"g",       cal:23,  pro:2.9, carb:3.6, fat:0.4, fiber:2.2, sodium:79,  calcium:99,  iron:2.7, vitC:28 },

  // ── FRUITS ──────────────────────────────────────────────────
  { id:200, name:"Papaya",                  cat:"fruits",   emoji:"🧡", serving:1,  unit:"cup",    cal:62,  pro:0.7, carb:15.7,fat:0.4, fiber:2.5, sodium:12,  calcium:29,  iron:0.1, vitC:86  },
  { id:201, name:"Guava (Amrood)",          cat:"fruits",   emoji:"💚", serving:1,  unit:"medium", cal:112, pro:4.2, carb:23.6,fat:1.6, fiber:8.9, sodium:3,   calcium:30,  iron:0.4, vitC:228 },
  { id:202, name:"Pomegranate (Dadam)",     cat:"fruits",   emoji:"🔴", serving:1,  unit:"cup",    cal:144, pro:2.9, carb:32.7,fat:2,   fiber:7,   sodium:5,   calcium:28,  iron:0.8, vitC:28  },
  { id:203, name:"Watermelon",              cat:"fruits",   emoji:"🍉", serving:1,  unit:"slice",  cal:91,  pro:1.9, carb:22.9,fat:0.5, fiber:1.1, sodium:3,   calcium:20,  iron:0.7, vitC:21  },
  { id:204, name:"Orange (Narangi)",        cat:"fruits",   emoji:"🍊", serving:1,  unit:"medium", cal:62,  pro:1.2, carb:15.4,fat:0.2, fiber:3.1, sodium:0,   calcium:60,  iron:0.1, vitC:70  },
  { id:205, name:"Grapes (Angoor)",         cat:"fruits",   emoji:"🍇", serving:1,  unit:"cup",    cal:104, pro:1.1, carb:27.3,fat:0.2, fiber:1.4, sodium:3,   calcium:15,  iron:0.5, vitC:4   },
  { id:206, name:"Pineapple (Ananas)",      cat:"fruits",   emoji:"🍍", serving:1,  unit:"cup",    cal:82,  pro:0.9, carb:21.6,fat:0.2, fiber:2.3, sodium:2,   calcium:21,  iron:0.5, vitC:79  },
  { id:207, name:"Chikoo (Sapota)",         cat:"fruits",   emoji:"🟤", serving:1,  unit:"medium", cal:140, pro:0.6, carb:34,  fat:0.4, fiber:5.3, sodium:12,  calcium:26,  iron:0.8, vitC:25  },
  { id:208, name:"Sitafal (Custard Apple)", cat:"fruits",   emoji:"💚", serving:1,  unit:"medium", cal:215, pro:2.8, carb:52,  fat:0.6, fiber:4.4, sodium:5,   calcium:33,  iron:1.6, vitC:36  },
  { id:209, name:"Strawberry",              cat:"fruits",   emoji:"🍓", serving:1,  unit:"cup",    cal:49,  pro:1,   carb:11.7,fat:0.5, fiber:3,   sodium:2,   calcium:27,  iron:0.6, vitC:89  },
  { id:210, name:"Kiwi",                    cat:"fruits",   emoji:"🥝", serving:1,  unit:"medium", cal:61,  pro:1.1, carb:14.7,fat:0.5, fiber:3,   sodium:3,   calcium:34,  iron:0.3, vitC:93  },
  { id:211, name:"Pear (Nashpati)",         cat:"fruits",   emoji:"🍐", serving:1,  unit:"medium", cal:101, pro:0.6, carb:27,  fat:0.2, fiber:5.5, sodium:2,   calcium:16,  iron:0.3, vitC:7   },
  { id:212, name:"Litchi",                  cat:"fruits",   emoji:"🔴", serving:10, unit:"pieces", cal:66,  pro:0.8, carb:16.5,fat:0.4, fiber:1.3, sodium:2,   calcium:10,  iron:0.3, vitC:68  },
  { id:213, name:"Jamun (Black Plum)",      cat:"fruits",   emoji:"🫐", serving:1,  unit:"cup",    cal:75,  pro:0.7, carb:19,  fat:0.2, fiber:0.9, sodium:14,  calcium:25,  iron:0.3, vitC:18  },
  { id:214, name:"Sweet Lime (Mosambi)",    cat:"fruits",   emoji:"🍋", serving:1,  unit:"medium", cal:48,  pro:0.7, carb:11.5,fat:0.1, fiber:1.9, sodium:3,   calcium:37,  iron:0.8, vitC:30  },
  { id:215, name:"Fig (fresh, Anjeer)",     cat:"fruits",   emoji:"🟣", serving:2,  unit:"pieces", cal:74,  pro:0.7, carb:19.2,fat:0.3, fiber:2.9, sodium:1,   calcium:35,  iron:0.4, vitC:2   },
  { id:216, name:"Jackfruit (Kathal)",      cat:"fruits",   emoji:"🟡", serving:1,  unit:"cup",    cal:155, pro:2.8, carb:39.6,fat:1,   fiber:2.6, sodium:3,   calcium:56,  iron:0.6, vitC:22  },
  { id:217, name:"Coconut (fresh, grated)", cat:"fruits",   emoji:"🥥", serving:1,  unit:"cup",    cal:283, pro:2.7, carb:12.2,fat:26.8,fiber:7.2, sodium:16,  calcium:11,  iron:2.4, vitC:3   },
  { id:218, name:"Plum (Aloo Bukhara)",     cat:"fruits",   emoji:"🟣", serving:2,  unit:"pieces", cal:60,  pro:0.9, carb:15.3,fat:0.4, fiber:1.8, sodium:0,   calcium:10,  iron:0.2, vitC:15  },
  { id:219, name:"Peach (Aadoo)",           cat:"fruits",   emoji:"🍑", serving:1,  unit:"medium", cal:59,  pro:1.4, carb:14.3,fat:0.4, fiber:2.3, sodium:0,   calcium:9,   iron:0.4, vitC:10  },

  // ── DRY FRUITS & SEEDS ──────────────────────────────────────
  { id:230, name:"Cashews (Kaju)",          cat:"dryfruit", emoji:"🟤", serving:30, unit:"g",      cal:163, pro:4.3, carb:9.1, fat:13,  fiber:0.9, sodium:4,   calcium:12,  iron:1.9, vitC:0   },
  { id:231, name:"Raisins (Kishmish)",      cat:"dryfruit", emoji:"🟤", serving:30, unit:"g",      cal:90,  pro:1,   carb:24,  fat:0.1, fiber:1.1, sodium:3,   calcium:16,  iron:0.6, vitC:1   },
  { id:232, name:"Dates (Khajoor)",         cat:"dryfruit", emoji:"🟤", serving:3,  unit:"pieces", cal:72,  pro:0.6, carb:19.4,fat:0.1, fiber:1.9, sodium:1,   calcium:19,  iron:0.4, vitC:0   },
  { id:233, name:"Pistachios (Pista)",      cat:"dryfruit", emoji:"🟢", serving:30, unit:"g",      cal:162, pro:6,   carb:8.5, fat:13,  fiber:3,   sodium:3,   calcium:34,  iron:1.2, vitC:1   },
  { id:234, name:"Dried Figs (Anjeer)",     cat:"dryfruit", emoji:"🟤", serving:3,  unit:"pieces", cal:111, pro:1.5, carb:28.8,fat:0.4, fiber:4.3, sodium:5,   calcium:90,  iron:1,   vitC:0   },
  { id:235, name:"Dried Apricots (Jardalu)",cat:"dryfruit", emoji:"🟠", serving:5,  unit:"pieces", cal:84,  pro:1.1, carb:21.8,fat:0.2, fiber:2.9, sodium:3,   calcium:28,  iron:1,   vitC:0   },
  { id:236, name:"Hazelnuts",               cat:"dryfruit", emoji:"🟤", serving:30, unit:"g",      cal:188, pro:4.5, carb:5.1, fat:18.8,fiber:2.7, sodium:0,   calcium:56,  iron:1.3, vitC:1   },
  { id:237, name:"Flaxseeds (Alsi)",        cat:"dryfruit", emoji:"🟤", serving:1,  unit:"tbsp",   cal:55,  pro:1.9, carb:3,   fat:4.3, fiber:2.8, sodium:3,   calcium:26,  iron:0.6, vitC:0   },
  { id:238, name:"Chia Seeds",              cat:"dryfruit", emoji:"⚫", serving:1,  unit:"tbsp",   cal:58,  pro:2,   carb:5,   fat:3.7, fiber:4,   sodium:2,   calcium:90,  iron:0.7, vitC:0   },
  { id:239, name:"Sunflower Seeds",         cat:"dryfruit", emoji:"🌻", serving:30, unit:"g",      cal:174, pro:6.1, carb:7.4, fat:15.1,fiber:3,   sodium:1,   calcium:20,  iron:1.5, vitC:0   },
  { id:240, name:"Pumpkin Seeds (Kaddu)",   cat:"dryfruit", emoji:"🟢", serving:30, unit:"g",      cal:160, pro:8.5, carb:5,   fat:13,  fiber:1.8, sodium:2,   calcium:15,  iron:2.7, vitC:0   },
  { id:241, name:"Fox Nuts (Makhana)",      cat:"dryfruit", emoji:"⚪", serving:30, unit:"g",      cal:106, pro:3.5, carb:20,  fat:0.4, fiber:0.5, sodium:20,  calcium:20,  iron:0.5, vitC:0   },
  { id:242, name:"Peanuts (roasted, plain)",cat:"dryfruit", emoji:"🥜", serving:30, unit:"g",      cal:171, pro:7.4, carb:5.1, fat:14.5,fiber:2.4, sodium:2,   calcium:26,  iron:0.8, vitC:0   },
  { id:243, name:"Mixed Dry Fruits",        cat:"dryfruit", emoji:"🟤", serving:30, unit:"g",      cal:160, pro:4,   carb:14,  fat:11,  fiber:2,   sodium:10,  calcium:40,  iron:1,   vitC:0   },
  { id:244, name:"Dried Coconut (Kopra)",   cat:"dryfruit", emoji:"🟤", serving:30, unit:"g",      cal:187, pro:2,   carb:7,   fat:18,  fiber:4.7, sodium:10,  calcium:12,  iron:1.5, vitC:0   },

  // ── VEGETABLES ──────────────────────────────────────────────
  { id:250, name:"Tomato (raw)",            cat:"vegetable",emoji:"🍅", serving:1,  unit:"medium", cal:22,  pro:1.1, carb:4.8, fat:0.2, fiber:1.5, sodium:6,   calcium:18,  iron:0.3, vitC:23  },
  { id:251, name:"Onion (raw)",             cat:"vegetable",emoji:"🧅", serving:1,  unit:"medium", cal:44,  pro:1.2, carb:10.3,fat:0.1, fiber:1.9, sodium:4,   calcium:23,  iron:0.2, vitC:8   },
  { id:252, name:"Potato (boiled)",         cat:"vegetable",emoji:"🥔", serving:1,  unit:"medium", cal:130, pro:3,   carb:30,  fat:0.1, fiber:2.4, sodium:10,  calcium:12,  iron:1.2, vitC:20  },
  { id:253, name:"Carrot (raw)",            cat:"vegetable",emoji:"🥕", serving:1,  unit:"medium", cal:25,  pro:0.6, carb:5.8, fat:0.1, fiber:1.7, sodium:42,  calcium:20,  iron:0.3, vitC:4   },
  { id:254, name:"Cauliflower (Phool Gobhi)",cat:"vegetable",emoji:"🥦",serving:1,  unit:"cup",    cal:29,  pro:2.3, carb:5.3, fat:0.6, fiber:2.5, sodium:30,  calcium:22,  iron:0.4, vitC:55  },
  { id:255, name:"Cabbage (Patta Gobhi)",   cat:"vegetable",emoji:"🥬", serving:1,  unit:"cup",    cal:22,  pro:1.1, carb:5.2, fat:0.1, fiber:2.2, sodium:16,  calcium:40,  iron:0.4, vitC:33  },
  { id:256, name:"Capsicum (Bell Pepper)",  cat:"vegetable",emoji:"🫑", serving:1,  unit:"medium", cal:37,  pro:1.5, carb:7.2, fat:0.4, fiber:2.5, sodium:4,   calcium:11,  iron:0.4, vitC:128 },
  { id:257, name:"Cucumber (Kheera)",       cat:"vegetable",emoji:"🥒", serving:1,  unit:"medium", cal:45,  pro:2,   carb:10.9,fat:0.3, fiber:1.5, sodium:4,   calcium:48,  iron:0.7, vitC:8   },
  { id:258, name:"Bitter Gourd (Karela)",   cat:"vegetable",emoji:"🟢", serving:1,  unit:"cup",    cal:24,  pro:1,   carb:5.4, fat:0.2, fiber:2.6, sodium:13,  calcium:20,  iron:0.6, vitC:84  },
  { id:259, name:"Cluster Beans (Gawar)",   cat:"vegetable",emoji:"🟢", serving:1,  unit:"cup",    cal:44,  pro:2.7, carb:10,  fat:0.2, fiber:6.5, sodium:5,   calcium:130, iron:1.8, vitC:35  },
  { id:260, name:"Drumstick (Saragvo)",     cat:"vegetable",emoji:"🟢", serving:5,  unit:"pieces", cal:37,  pro:2.1, carb:8.5, fat:0.2, fiber:3.2, sodium:42,  calcium:185, iron:0.4, vitC:28  },
  { id:261, name:"Green Peas (Matar)",      cat:"vegetable",emoji:"🟢", serving:1,  unit:"cup",    cal:134, pro:8.6, carb:25,  fat:0.4, fiber:8.8, sodium:5,   calcium:43,  iron:2.5, vitC:58  },
  { id:262, name:"Corn (Makka, boiled)",    cat:"vegetable",emoji:"🌽", serving:1,  unit:"ear",    cal:130, pro:5,   carb:29,  fat:1.5, fiber:3.6, sodium:21,  calcium:3,   iron:0.8, vitC:7   },
  { id:263, name:"Beetroot (boiled)",       cat:"vegetable",emoji:"🔴", serving:1,  unit:"medium", cal:44,  pro:1.7, carb:9.9, fat:0.2, fiber:2.8, sodium:65,  calcium:14,  iron:0.8, vitC:6   },
  { id:264, name:"Yam (Suran) boiled",      cat:"vegetable",emoji:"🟤", serving:1,  unit:"cup",    cal:177, pro:2.3, carb:41.8,fat:0.3, fiber:6,   sodium:9,   calcium:26,  iron:0.8, vitC:20  },
  { id:265, name:"Taro Root (Arbi) boiled", cat:"vegetable",emoji:"🟤", serving:1,  unit:"cup",    cal:187, pro:0.6, carb:45.9,fat:0.1, fiber:5.4, sodium:20,  calcium:19,  iron:0.7, vitC:9   },
  { id:266, name:"French Beans",            cat:"vegetable",emoji:"🟢", serving:1,  unit:"cup",    cal:44,  pro:2.4, carb:9.9, fat:0.4, fiber:3.7, sodium:6,   calcium:55,  iron:1.6, vitC:18  },
  { id:267, name:"Mushroom (cooked)",       cat:"vegetable",emoji:"🍄", serving:1,  unit:"cup",    cal:44,  pro:3.4, carb:8.1, fat:0.7, fiber:1.7, sodium:14,  calcium:9,   iron:0.6, vitC:4   },
  { id:268, name:"Pumpkin / Kaddu (cooked)",cat:"vegetable",emoji:"🎃", serving:1,  unit:"cup",    cal:49,  pro:2,   carb:12,  fat:0.2, fiber:2.7, sodium:2,   calcium:37,  iron:1.4, vitC:20  },
  { id:269, name:"Zucchini / Tori (cooked)",cat:"vegetable",emoji:"🟢", serving:1,  unit:"cup",    cal:27,  pro:2,   carb:7,   fat:0.3, fiber:2.2, sodium:12,  calcium:24,  iron:0.6, vitC:21  },
  { id:270, name:"Raw Mango (Kairi)",       cat:"vegetable",emoji:"🥭", serving:1,  unit:"medium", cal:60,  pro:0.8, carb:15,  fat:0.4, fiber:1.6, sodium:3,   calcium:10,  iron:0.2, vitC:36  },
  { id:271, name:"Pointed Gourd (Parwal)", cat:"vegetable",emoji:"🟢", serving:1,  unit:"cup",    cal:30,  pro:2,   carb:6,   fat:0.3, fiber:3,   sodium:3,   calcium:30,  iron:0.8, vitC:29  },
  { id:272, name:"Brinjal / Baingan",      cat:"vegetable",emoji:"🍆", serving:1,  unit:"medium", cal:35,  pro:1.5, carb:8.6, fat:0.2, fiber:2.5, sodium:2,   calcium:18,  iron:0.3, vitC:3   },
  { id:273, name:"Okra / Bhindi",          cat:"vegetable",emoji:"🟢", serving:1,  unit:"cup",    cal:33,  pro:1.9, carb:7.5, fat:0.2, fiber:3.2, sodium:8,   calcium:82,  iron:0.6, vitC:23  },
  { id:274, name:"Spinach / Palak",        cat:"vegetable",emoji:"🥬", serving:1,  unit:"cup",    cal:23,  pro:2.9, carb:3.6, fat:0.4, fiber:2.2, sodium:79,  calcium:99,  iron:2.7, vitC:28  },
  { id:275, name:"Fenugreek Leaves (Methi)",cat:"vegetable",emoji:"🟢",serving:1,  unit:"cup",    cal:22,  pro:3.1, carb:4,   fat:0.4, fiber:2.7, sodium:17,  calcium:176, iron:3.8, vitC:3   },
  { id:276, name:"Bottle Gourd (Lauki)",   cat:"vegetable",emoji:"🟢", serving:1,  unit:"cup",    cal:18,  pro:0.8, carb:3.9, fat:0.1, fiber:1.2, sodium:3,   calcium:24,  iron:0.2, vitC:12  },
  { id:277, name:"Ridge Gourd (Turai)",    cat:"vegetable",emoji:"🟢", serving:1,  unit:"cup",    cal:20,  pro:1.2, carb:4.3, fat:0.2, fiber:2.2, sodium:3,   calcium:20,  iron:0.4, vitC:12  },
  { id:278, name:"Radish / Mooli (raw)",   cat:"vegetable",emoji:"🔴", serving:1,  unit:"medium", cal:18,  pro:0.8, carb:4,   fat:0.1, fiber:1.6, sodium:39,  calcium:25,  iron:0.3, vitC:15  },
  { id:279, name:"Round Gourd (Tinda)",    cat:"vegetable",emoji:"🟢", serving:1,  unit:"cup",    cal:22,  pro:1,   carb:5,   fat:0.3, fiber:2.5, sodium:6,   calcium:20,  iron:0.4, vitC:10  },
  { id:395, name:"Ivy Gourd (Tindora/Kundru)",cat:"vegetable",emoji:"🟢",serving:1,unit:"cup",   cal:40,  pro:1.6, carb:8.1, fat:0.3, fiber:2.6, sodium:5,   calcium:40,  iron:0.9, vitC:15  },
  { id:396, name:"Snake Gourd (Chichinda)",cat:"vegetable",emoji:"🟢", serving:1,  unit:"cup",    cal:20,  pro:1.4, carb:4.4, fat:0.4, fiber:2.5, sodium:3,   calcium:26,  iron:0.5, vitC:11  },
  { id:397, name:"Lotus Stem (Bhein/Kamal Kakdi)",cat:"vegetable",emoji:"🪷",serving:1,unit:"cup",cal:85, pro:2.6, carb:20.4,fat:0.1, fiber:3.1, sodium:45,  calcium:45,  iron:1.2, vitC:55  },
  { id:398, name:"Raw Banana (Kachha Kela)",cat:"vegetable",emoji:"🍌",serving:1,  unit:"medium", cal:89,  pro:1.1, carb:22.8,fat:0.3, fiber:2.6, sodium:4,   calcium:5,   iron:0.3, vitC:9   },
  { id:399, name:"Raw Papaya (Papita)",    cat:"vegetable",emoji:"🟡", serving:1,  unit:"cup",    cal:39,  pro:0.6, carb:9.8, fat:0.1, fiber:1.8, sodium:8,   calcium:28,  iron:0.2, vitC:62  },
  { id:400, name:"Jackfruit (Kathal, raw)",cat:"vegetable",emoji:"🟡", serving:1,  unit:"cup",    cal:95,  pro:1.7, carb:23.2,fat:0.6, fiber:1.5, sodium:3,   calcium:56,  iron:0.2, vitC:13  },
  { id:401, name:"Banana Flower (Kela Phool)",cat:"vegetable",emoji:"🌸",serving:1,unit:"cup",   cal:51,  pro:1.7, carb:9.9, fat:0.6, fiber:5.7, sodium:56,  calcium:56,  iron:0.6, vitC:5   },
  { id:402, name:"Amaranth Leaves (Chaulai)",cat:"vegetable",emoji:"🌿",serving:1, unit:"cup",   cal:25,  pro:2.5, carb:3.8, fat:0.3, fiber:2.2, sodium:20,  calcium:215, iron:2.3, vitC:70  },
  { id:403, name:"Turnip / Shalgam",       cat:"vegetable",emoji:"🟣", serving:1,  unit:"medium", cal:36,  pro:1.2, carb:8.4, fat:0.1, fiber:2.3, sodium:87,  calcium:39,  iron:0.4, vitC:27  },
  { id:404, name:"Sweet Potato (Shakarkand)",cat:"vegetable",emoji:"🍠",serving:1, unit:"medium", cal:130, pro:2.9, carb:30.3,fat:0.1, fiber:3.8, sodium:55,  calcium:39,  iron:0.8, vitC:20  },
  { id:405, name:"Broccoli (cooked)",      cat:"vegetable",emoji:"🥦", serving:1,  unit:"cup",    cal:55,  pro:3.7, carb:11,  fat:0.6, fiber:5.1, sodium:64,  calcium:62,  iron:1,   vitC:101 },
  { id:406, name:"Baby Corn",              cat:"vegetable",emoji:"🌽", serving:1,  unit:"cup",    cal:43,  pro:1.5, carb:9,   fat:0.4, fiber:3,   sodium:5,   calcium:30,  iron:0.5, vitC:9   },
  { id:407, name:"Spring Onion / Hara Pyaz",cat:"vegetable",emoji:"🧅",serving:1,  unit:"cup",    cal:32,  pro:1.8, carb:7.3, fat:0.2, fiber:2.6, sodium:16,  calcium:72,  iron:1.5, vitC:19  },
  { id:408, name:"Coriander Leaves (Dhaniya)",cat:"vegetable",emoji:"🌿",serving:1,unit:"cup",   cal:22,  pro:2.1, carb:3.7, fat:0.5, fiber:2.8, sodium:46,  calcium:67,  iron:1.8, vitC:27  },
  { id:409, name:"Kohlrabi (Ganth Gobhi)", cat:"vegetable",emoji:"🟢", serving:1,  unit:"medium", cal:36,  pro:2.3, carb:8.4, fat:0.1, fiber:4.9, sodium:20,  calcium:32,  iron:0.4, vitC:62  },
  { id:410, name:"Celery",                 cat:"vegetable",emoji:"🟢", serving:2,  unit:"stalks", cal:12,  pro:0.5, carb:2.6, fat:0.1, fiber:1.2, sodium:80,  calcium:40,  iron:0.2, vitC:4   },
  { id:411, name:"Ash Gourd (Petha/Safed Kaddu)",cat:"vegetable",emoji:"⬜",serving:1,unit:"cup", cal:13,  pro:0.4, carb:3,   fat:0.2, fiber:2.9, sodium:111, calcium:19,  iron:0.4, vitC:13  },
  { id:412, name:"Colocasia Leaves (Arbi Patta)",cat:"vegetable",emoji:"🌿",serving:1,unit:"cup",cal:44,  pro:2,   carb:6.7, fat:1.3, fiber:3,   sodium:29,  calcium:82,  iron:2,   vitC:51  },

  // ── BREAD VARIETIES ─────────────────────────────────────────
  { id:280, name:"White Bread",             cat:"bread",    emoji:"🍞", serving:2,  unit:"slices", cal:150, pro:5,   carb:28,  fat:2,   fiber:0.7, sodium:280, calcium:60,  iron:1.4, vitC:0   },
  { id:281, name:"Brown Bread",             cat:"bread",    emoji:"🍞", serving:2,  unit:"slices", cal:140, pro:5.5, carb:26,  fat:2,   fiber:2,   sodium:240, calcium:50,  iron:1.5, vitC:0   },
  { id:282, name:"Multigrain Bread",        cat:"bread",    emoji:"🍞", serving:2,  unit:"slices", cal:160, pro:7,   carb:28,  fat:3,   fiber:4,   sodium:260, calcium:60,  iron:2,   vitC:0   },
  { id:283, name:"Pav (Dinner Roll)",       cat:"bread",    emoji:"🍞", serving:1,  unit:"piece",  cal:110, pro:3.5, carb:21,  fat:1.5, fiber:0.8, sodium:220, calcium:30,  iron:0.8, vitC:0   },
  { id:284, name:"Burger Bun",              cat:"bread",    emoji:"🍔", serving:1,  unit:"piece",  cal:145, pro:5,   carb:27,  fat:2.5, fiber:1.2, sodium:240, calcium:35,  iron:1,   vitC:0   },
  { id:285, name:"Rye Bread",               cat:"bread",    emoji:"🍞", serving:2,  unit:"slices", cal:166, pro:5.6, carb:31.8,fat:2,   fiber:5.8, sodium:320, calcium:40,  iron:2.2, vitC:0   },
  { id:286, name:"Sourdough Bread",         cat:"bread",    emoji:"🍞", serving:2,  unit:"slices", cal:188, pro:7,   carb:36,  fat:1.2, fiber:2,   sodium:450, calcium:20,  iron:2,   vitC:0   },
  { id:287, name:"Gluten-Free Bread",       cat:"bread",    emoji:"🍞", serving:2,  unit:"slices", cal:160, pro:3,   carb:30,  fat:3.5, fiber:1,   sodium:220, calcium:20,  iron:0.5, vitC:0   },
  { id:288, name:"Corn Bread",              cat:"bread",    emoji:"🌽", serving:1,  unit:"slice",  cal:173, pro:3.8, carb:28,  fat:5.8, fiber:1,   sodium:320, calcium:30,  iron:1,   vitC:0   },

  // ── INDIAN FLATBREADS / ROTI ─────────────────────────────────
  { id:413, name:"Phulka (thin wheat roti)",cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:52,  pro:1.8, carb:10.5,fat:0.5, fiber:1.2, sodium:40,  calcium:8,   iron:0.5, vitC:0   },
  { id:414, name:"Whole Wheat Roti",        cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:80,  pro:3,   carb:15,  fat:1,   fiber:2,   sodium:70,  calcium:14,  iron:0.8, vitC:0   },
  { id:415, name:"Multigrain Roti",         cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:85,  pro:3.5, carb:15,  fat:1.5, fiber:3,   sodium:80,  calcium:20,  iron:1,   vitC:0   },
  { id:416, name:"Jowar Roti",              cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:90,  pro:2.8, carb:18,  fat:1,   fiber:2.5, sodium:10,  calcium:20,  iron:1.5, vitC:0   },
  { id:417, name:"Makki ki Roti",           cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:100, pro:2.5, carb:20,  fat:1.5, fiber:2,   sodium:10,  calcium:8,   iron:0.8, vitC:0   },
  { id:418, name:"Missi Roti (besan+wheat)",cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:110, pro:5,   carb:18,  fat:2.5, fiber:3,   sodium:120, calcium:30,  iron:1.5, vitC:0   },
  { id:419, name:"Ragi Roti",               cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:88,  pro:2.5, carb:18,  fat:0.8, fiber:2.8, sodium:10,  calcium:108, iron:1.8, vitC:0   },
  { id:420, name:"Akki Roti (rice flour)",  cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:95,  pro:1.8, carb:21,  fat:0.4, fiber:0.5, sodium:5,   calcium:5,   iron:0.3, vitC:0   },
  { id:421, name:"Thalipeeth",              cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:150, pro:5,   carb:24,  fat:4,   fiber:3.5, sodium:180, calcium:40,  iron:2,   vitC:2   },
  { id:422, name:"Plain Paratha",           cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:180, pro:4,   carb:25,  fat:7,   fiber:2,   sodium:200, calcium:20,  iron:1,   vitC:0   },
  { id:423, name:"Aloo Paratha",            cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:250, pro:5,   carb:38,  fat:9,   fiber:3,   sodium:320, calcium:30,  iron:1.5, vitC:8   },
  { id:424, name:"Methi Paratha",           cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:200, pro:5,   carb:28,  fat:8,   fiber:3.5, sodium:260, calcium:50,  iron:2,   vitC:3   },
  { id:425, name:"Gobi Paratha",            cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:220, pro:5,   carb:32,  fat:8,   fiber:3,   sodium:280, calcium:40,  iron:1.2, vitC:20  },
  { id:426, name:"Paneer Paratha",          cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:270, pro:10,  carb:30,  fat:12,  fiber:2,   sodium:340, calcium:150, iron:1,   vitC:0   },
  { id:427, name:"Dal Paratha",             cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:220, pro:8,   carb:32,  fat:7,   fiber:4,   sodium:290, calcium:40,  iron:2,   vitC:0   },
  { id:428, name:"Puri",                    cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:80,  pro:2,   carb:11,  fat:3.5, fiber:0.8, sodium:80,  calcium:8,   iron:0.5, vitC:0   },
  { id:429, name:"Bhatura",                 cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:210, pro:5,   carb:32,  fat:8,   fiber:1,   sodium:300, calcium:20,  iron:1.2, vitC:0   },
  { id:430, name:"Tandoori Roti",           cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:115, pro:4,   carb:22,  fat:1.5, fiber:2.5, sodium:160, calcium:18,  iron:1,   vitC:0   },
  { id:431, name:"Rumali Roti",             cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:100, pro:3,   carb:20,  fat:1,   fiber:0.8, sodium:140, calcium:10,  iron:0.6, vitC:0   },
  { id:432, name:"Naan (plain)",            cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:260, pro:8,   carb:45,  fat:5,   fiber:1.5, sodium:480, calcium:40,  iron:2,   vitC:0   },
  { id:433, name:"Kulcha",                  cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:200, pro:6,   carb:36,  fat:4,   fiber:1,   sodium:380, calcium:30,  iron:1.5, vitC:0   },
  { id:434, name:"Lachha Paratha",          cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:220, pro:5,   carb:30,  fat:9,   fiber:2,   sodium:260, calcium:25,  iron:1,   vitC:0   },
  { id:435, name:"Besan Chilla",            cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:130, pro:7,   carb:18,  fat:4,   fiber:3,   sodium:200, calcium:40,  iron:1.5, vitC:2   },
  { id:436, name:"Moong Dal Chilla",        cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:120, pro:8,   carb:16,  fat:3,   fiber:3.5, sodium:180, calcium:35,  iron:1.8, vitC:2   },
  { id:437, name:"Bhakhri (Wheat)",         cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:120, pro:3.5, carb:20,  fat:4,   fiber:2,   sodium:90,  calcium:15,  iron:0.8, vitC:0   },
  { id:438, name:"Bhakhri (Jowar)",         cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:115, pro:3,   carb:21,  fat:3,   fiber:2.5, sodium:10,  calcium:18,  iron:1.5, vitC:0   },
  { id:439, name:"Bhakhri (Bajra)",         cat:"roti",    emoji:"🫓", serving:1,  unit:"piece",  cal:125, pro:3.5, carb:22,  fat:3.5, fiber:3,   sodium:10,  calcium:22,  iron:2,   vitC:0   },

  // ── DAL & LEGUMES ────────────────────────────────────────────
  { id:300, name:"Chana Dal",               cat:"dal",      emoji:"🟡", serving:1,  unit:"bowl",   cal:170, pro:10,  carb:29,  fat:2.7, fiber:7.9, sodium:280, calcium:55,  iron:2.8, vitC:0   },
  { id:301, name:"Masoor Dal (Red Lentil)", cat:"dal",      emoji:"🟠", serving:1,  unit:"bowl",   cal:165, pro:12,  carb:28,  fat:0.5, fiber:8,   sodium:300, calcium:38,  iron:3.3, vitC:2   },
  { id:302, name:"Urad Dal",                cat:"dal",      emoji:"⚫", serving:1,  unit:"bowl",   cal:190, pro:13,  carb:32,  fat:1,   fiber:7,   sodium:290, calcium:70,  iron:3.5, vitC:0   },
  { id:303, name:"Chawli (Black Eyed Peas)",cat:"dal",      emoji:"⚪", serving:1,  unit:"bowl",   cal:200, pro:13,  carb:35,  fat:0.9, fiber:8,   sodium:280, calcium:60,  iron:4.3, vitC:0   },
  { id:304, name:"Green Moong (whole)",     cat:"dal",      emoji:"🟢", serving:1,  unit:"bowl",   cal:212, pro:14,  carb:38,  fat:0.8, fiber:7.6, sodium:270, calcium:55,  iron:2.8, vitC:2   },
  { id:305, name:"Dal Tadka",               cat:"dal",      emoji:"🍲", serving:1,  unit:"bowl",   cal:200, pro:11,  carb:30,  fat:5,   fiber:6,   sodium:380, calcium:60,  iron:3,   vitC:3   },
  { id:306, name:"Dal Makhani (veg)",       cat:"dal",      emoji:"🍲", serving:1,  unit:"bowl",   cal:230, pro:11,  carb:29,  fat:8,   fiber:8,   sodium:480, calcium:90,  iron:3.5, vitC:2   },
  { id:307, name:"Val / Papdi Dal",         cat:"dal",      emoji:"🟤", serving:1,  unit:"bowl",   cal:180, pro:10,  carb:32,  fat:1.5, fiber:6,   sodium:300, calcium:55,  iron:2.5, vitC:5   },
  { id:308, name:"Panchratna Dal",          cat:"dal",      emoji:"🟡", serving:1,  unit:"bowl",   cal:220, pro:13,  carb:36,  fat:4,   fiber:7,   sodium:360, calcium:70,  iron:3.5, vitC:3   },
  { id:309, name:"Chana (Kabuli) cooked",   cat:"dal",      emoji:"🫘", serving:1,  unit:"bowl",   cal:269, pro:14.5,carb:45,  fat:4.3, fiber:12.5,sodium:360, calcium:80,  iron:4.7, vitC:2   },
  { id:310, name:"Moong Sprouts",           cat:"dal",      emoji:"🌱", serving:1,  unit:"cup",    cal:26,  pro:2.5, carb:5.2, fat:0.1, fiber:1.9, sodium:6,   calcium:14,  iron:0.9, vitC:14  },
  { id:311, name:"Matki (Moth Bean)",       cat:"dal",      emoji:"🟤", serving:1,  unit:"bowl",   cal:213, pro:14.2,carb:38,  fat:1.2, fiber:8,   sodium:260, calcium:150, iron:5.4, vitC:0   },

  // ── RICE VARIETIES ───────────────────────────────────────────
  { id:320, name:"Basmati Rice",            cat:"rice",     emoji:"🍚", serving:1,  unit:"cup",    cal:210, pro:4.5, carb:46,  fat:0.4, fiber:0.6, sodium:5,   calcium:15,  iron:0.4, vitC:0   },
  { id:321, name:"Jeera Rice",              cat:"rice",     emoji:"🍚", serving:1,  unit:"bowl",   cal:220, pro:4.5, carb:45,  fat:3.5, fiber:0.8, sodium:220, calcium:18,  iron:0.6, vitC:0   },
  { id:322, name:"Veg Pulao",               cat:"rice",     emoji:"🍛", serving:1,  unit:"bowl",   cal:260, pro:6,   carb:48,  fat:5,   fiber:2.5, sodium:380, calcium:30,  iron:1,   vitC:5   },
  { id:323, name:"Curd Rice",               cat:"rice",     emoji:"🍚", serving:1,  unit:"bowl",   cal:230, pro:7,   carb:38,  fat:5,   fiber:1,   sodium:180, calcium:160, iron:0.4, vitC:1   },
  { id:324, name:"Lemon Rice",              cat:"rice",     emoji:"🍚", serving:1,  unit:"bowl",   cal:240, pro:5,   carb:48,  fat:3.5, fiber:1,   sodium:280, calcium:20,  iron:1,   vitC:12  },
  { id:325, name:"Tomato Rice",             cat:"rice",     emoji:"🍚", serving:1,  unit:"bowl",   cal:225, pro:5,   carb:44,  fat:3,   fiber:1.5, sodium:290, calcium:25,  iron:1.2, vitC:8   },
  { id:326, name:"Veg Fried Rice",          cat:"rice",     emoji:"🍛", serving:1,  unit:"bowl",   cal:290, pro:7,   carb:52,  fat:6,   fiber:2.5, sodium:520, calcium:25,  iron:1.2, vitC:5   },
  { id:327, name:"Sabudana Khichdi",        cat:"rice",     emoji:"⚪", serving:1,  unit:"bowl",   cal:350, pro:5,   carb:65,  fat:9,   fiber:1.5, sodium:280, calcium:30,  iron:1,   vitC:0   },
  { id:381, name:"Plain White Rice",        cat:"rice",     emoji:"🍚", serving:1,  unit:"cup",    cal:200, pro:4,   carb:44,  fat:0.4, fiber:0.4, sodium:1,   calcium:10,  iron:0.2, vitC:0   },
  { id:382, name:"Sona Masoori Rice",       cat:"rice",     emoji:"🍚", serving:1,  unit:"cup",    cal:195, pro:4,   carb:43,  fat:0.3, fiber:0.5, sodium:2,   calcium:12,  iron:0.3, vitC:0   },
  { id:383, name:"Red Rice",                cat:"rice",     emoji:"🍚", serving:1,  unit:"cup",    cal:216, pro:4.9, carb:45,  fat:1.8, fiber:2,   sodium:8,   calcium:12,  iron:0.5, vitC:0   },
  { id:384, name:"Brown Rice",              cat:"rice",     emoji:"🍚", serving:1,  unit:"cup",    cal:218, pro:4.5, carb:46,  fat:1.6, fiber:3.5, sodium:10,  calcium:20,  iron:1,   vitC:0   },
  { id:385, name:"Matar Pulao",             cat:"rice",     emoji:"🍛", serving:1,  unit:"bowl",   cal:255, pro:7,   carb:48,  fat:4,   fiber:3,   sodium:360, calcium:30,  iron:1.5, vitC:8   },
  { id:386, name:"Coconut Rice",            cat:"rice",     emoji:"🍚", serving:1,  unit:"bowl",   cal:290, pro:5,   carb:46,  fat:9,   fiber:2,   sodium:200, calcium:20,  iron:1,   vitC:0   },
  { id:387, name:"Tamarind Rice",           cat:"rice",     emoji:"🍚", serving:1,  unit:"bowl",   cal:260, pro:5,   carb:50,  fat:5,   fiber:1.5, sodium:400, calcium:20,  iron:1.5, vitC:4   },
  { id:388, name:"Methi Rice",              cat:"rice",     emoji:"🍛", serving:1,  unit:"bowl",   cal:240, pro:6,   carb:44,  fat:4,   fiber:3,   sodium:310, calcium:80,  iron:3,   vitC:6   },
  { id:389, name:"Dal Khichdi",             cat:"rice",     emoji:"🍛", serving:1,  unit:"bowl",   cal:280, pro:10,  carb:48,  fat:5,   fiber:5,   sodium:380, calcium:50,  iron:2.5, vitC:3   },
  { id:390, name:"Bisi Bele Bath",          cat:"rice",     emoji:"🍛", serving:1,  unit:"bowl",   cal:320, pro:10,  carb:54,  fat:7,   fiber:6,   sodium:460, calcium:60,  iron:3,   vitC:6   },
  { id:391, name:"Khichdi",                 cat:"rice",     emoji:"🍛", serving:1,  unit:"bowl",   cal:260, pro:8,   carb:46,  fat:4,   fiber:4,   sodium:340, calcium:45,  iron:2,   vitC:2   },
  { id:392, name:"Pongal",                  cat:"rice",     emoji:"🍛", serving:1,  unit:"bowl",   cal:310, pro:9,   carb:50,  fat:9,   fiber:3,   sodium:320, calcium:40,  iron:2,   vitC:2   },

  // ── GUJARATI SPECIALTIES ─────────────────────────────────────
  // Fajeto: traditional Gujarati mango-yogurt curry. Made by simmering ripe mango
  // pulp with beaten yogurt, turmeric, mustard, cumin, asafoetida, ginger, green
  // chilli and curry leaves. A seasonal summer dish — sweet, sour and spiced.
  // Eaten as a curry alongside roti or rice. No cream, low fat, probiotic.
  { id:393, name:"Fajeto",                  cat:"rice",     emoji:"🥭", serving:1,  unit:"bowl",   cal:160, pro:5,   carb:26,  fat:4,   fiber:1.5, sodium:280, calcium:130, iron:0.8, vitC:18  },
  { id:394, name:"Aam Ras",                 cat:"rice",     emoji:"🥭", serving:1,  unit:"cup",    cal:120, pro:1.2, carb:28,  fat:0.4, fiber:1.5, sodium:10,  calcium:18,  iron:0.4, vitC:36  },

  // ── TEA & COFFEE VARIETIES ───────────────────────────────────
  { id:340, name:"Masala Chai",             cat:"tea",      emoji:"🍵", serving:1,  unit:"cup",    cal:90,  pro:2.2, carb:16,  fat:2.2, fiber:0,   sodium:25,  calcium:95,  iron:0.1, vitC:0   },
  { id:341, name:"Ginger Tea (Adrak Chai)", cat:"tea",      emoji:"🍵", serving:1,  unit:"cup",    cal:75,  pro:2,   carb:13,  fat:2,   fiber:0,   sodium:20,  calcium:90,  iron:0.1, vitC:2   },
  { id:342, name:"Ginger Masala Tea",       cat:"tea",      emoji:"🍵", serving:1,  unit:"cup",    cal:90,  pro:2.2, carb:15,  fat:2.2, fiber:0,   sodium:22,  calcium:92,  iron:0.1, vitC:2   },
  { id:343, name:"Ginger Pudina Tea",       cat:"tea",      emoji:"🍵", serving:1,  unit:"cup",    cal:70,  pro:2,   carb:12,  fat:1.8, fiber:0,   sodium:18,  calcium:88,  iron:0.1, vitC:3   },
  { id:344, name:"Cardamom Tea (Elaichi Chai)",cat:"tea",   emoji:"🍵", serving:1,  unit:"cup",    cal:85,  pro:2,   carb:14,  fat:2,   fiber:0,   sodium:20,  calcium:90,  iron:0.1, vitC:0   },
  { id:345, name:"Lemongrass Tea",          cat:"tea",      emoji:"🍵", serving:1,  unit:"cup",    cal:20,  pro:0,   carb:4,   fat:0,   fiber:0,   sodium:4,   calcium:10,  iron:0.4, vitC:1   },
  { id:346, name:"Tulsi Tea",               cat:"tea",      emoji:"🍵", serving:1,  unit:"cup",    cal:15,  pro:0.2, carb:3,   fat:0,   fiber:0,   sodium:3,   calcium:12,  iron:0.3, vitC:2   },
  { id:347, name:"Kahwa (Kashmiri Tea)",    cat:"tea",      emoji:"🍵", serving:1,  unit:"cup",    cal:30,  pro:0.5, carb:6,   fat:0.5, fiber:0,   sodium:5,   calcium:15,  iron:0.2, vitC:1   },
  { id:348, name:"Milk Tea (Plain)",        cat:"tea",      emoji:"☕", serving:1,  unit:"cup",    cal:80,  pro:2,   carb:14,  fat:2,   fiber:0,   sodium:20,  calcium:90,  iron:0.1, vitC:0   },
  { id:349, name:"Green Tea",               cat:"tea",      emoji:"🍵", serving:1,  unit:"cup",    cal:2,   pro:0.2, carb:0.5, fat:0,   fiber:0,   sodium:2,   calcium:5,   iron:0.1, vitC:0   },
  { id:350, name:"Black Tea (without milk)",cat:"tea",      emoji:"🍵", serving:1,  unit:"cup",    cal:2,   pro:0.1, carb:0.7, fat:0,   fiber:0,   sodium:5,   calcium:0,   iron:0.1, vitC:0   },
  { id:351, name:"Iced Tea (lemon)",        cat:"tea",      emoji:"🧊", serving:1,  unit:"glass",  cal:80,  pro:0,   carb:21,  fat:0,   fiber:0,   sodium:5,   calcium:5,   iron:0.1, vitC:5   },
  { id:352, name:"Espresso",                cat:"coffee",   emoji:"☕", serving:1,  unit:"shot",   cal:5,   pro:0.3, carb:0.8, fat:0.1, fiber:0,   sodium:5,   calcium:3,   iron:0,   vitC:0   },
  { id:353, name:"Black Coffee (drip)",     cat:"coffee",   emoji:"☕", serving:1,  unit:"cup",    cal:5,   pro:0.3, carb:0.7, fat:0,   fiber:0,   sodium:5,   calcium:5,   iron:0,   vitC:0   },
  { id:354, name:"Cappuccino",              cat:"coffee",   emoji:"☕", serving:1,  unit:"cup",    cal:120, pro:6,   carb:12,  fat:5,   fiber:0,   sodium:75,  calcium:170, iron:0,   vitC:0   },
  { id:355, name:"Latte",                   cat:"coffee",   emoji:"☕", serving:1,  unit:"cup",    cal:150, pro:8,   carb:15,  fat:5.5, fiber:0,   sodium:110, calcium:280, iron:0.1, vitC:0   },
  { id:356, name:"Flat White",              cat:"coffee",   emoji:"☕", serving:1,  unit:"cup",    cal:130, pro:7,   carb:11,  fat:5,   fiber:0,   sodium:90,  calcium:240, iron:0,   vitC:0   },
  { id:357, name:"Cold Brew Coffee",        cat:"coffee",   emoji:"🧊", serving:1,  unit:"glass",  cal:20,  pro:0.5, carb:4,   fat:0.1, fiber:0,   sodium:10,  calcium:10,  iron:0.1, vitC:0   },
  { id:358, name:"Iced Coffee (with milk)", cat:"coffee",   emoji:"🧊", serving:1,  unit:"glass",  cal:130, pro:6,   carb:18,  fat:4,   fiber:0,   sodium:80,  calcium:200, iron:0.1, vitC:0   },
  { id:359, name:"Cold Coffee (blended)",   cat:"coffee",   emoji:"🧊", serving:1,  unit:"glass",  cal:200, pro:6,   carb:28,  fat:7,   fiber:0,   sodium:90,  calcium:210, iron:0.1, vitC:0   },
  { id:360, name:"Filter Coffee (South Indian)",cat:"coffee",emoji:"☕",serving:1,  unit:"cup",    cal:90,  pro:2.5, carb:13,  fat:3,   fiber:0,   sodium:30,  calcium:100, iron:0.1, vitC:0   },
  { id:361, name:"Instant Coffee (with milk)",cat:"coffee", emoji:"☕", serving:1,  unit:"cup",    cal:70,  pro:2,   carb:10,  fat:2,   fiber:0,   sodium:60,  calcium:90,  iron:0.1, vitC:0   },
  { id:362, name:"Hot Chocolate",           cat:"coffee",   emoji:"🍫", serving:1,  unit:"cup",    cal:220, pro:8,   carb:32,  fat:7,   fiber:1.5, sodium:140, calcium:280, iron:1.2, vitC:0   },

  // ── DRINKS / BEVERAGES ───────────────────────────────────────
  { id:370, name:"Mango Juice (fresh)",     cat:"drinks",   emoji:"🥭", serving:1,  unit:"glass",  cal:130, pro:1,   carb:33,  fat:0.5, fiber:0.5, sodium:5,   calcium:15,  iron:0.2, vitC:30  },
  { id:371, name:"Mango Milkshake",         cat:"drinks",   emoji:"🥭", serving:1,  unit:"glass",  cal:260, pro:7,   carb:44,  fat:6,   fiber:1,   sodium:80,  calcium:220, iron:0.4, vitC:25  },
  { id:372, name:"Mango Lassi",             cat:"drinks",   emoji:"🥭", serving:1,  unit:"glass",  cal:220, pro:6,   carb:38,  fat:4,   fiber:0.5, sodium:75,  calcium:200, iron:0.3, vitC:20  },
  { id:373, name:"Vegetable Raita",         cat:"drinks",   emoji:"🫙", serving:1,  unit:"bowl",   cal:80,  pro:4,   carb:8,   fat:3,   fiber:1,   sodium:120, calcium:140, iron:0.2, vitC:5   },
  { id:374, name:"Boondi Raita",            cat:"drinks",   emoji:"🫙", serving:1,  unit:"bowl",   cal:120, pro:5,   carb:14,  fat:4,   fiber:0.5, sodium:180, calcium:150, iron:0.3, vitC:1   },
  { id:375, name:"Almond Milk (unsweetened)",cat:"drinks",  emoji:"🥛", serving:1,  unit:"glass",  cal:40,  pro:1,   carb:3.5, fat:2.5, fiber:0.5, sodium:170, calcium:450, iron:0.7, vitC:0   },
  { id:376, name:"Soy Milk",                cat:"drinks",   emoji:"🥛", serving:1,  unit:"glass",  cal:100, pro:7,   carb:8,   fat:4,   fiber:0.5, sodium:100, calcium:300, iron:1,   vitC:0   },
  { id:377, name:"Rose Lassi",              cat:"drinks",   emoji:"🥛", serving:1,  unit:"glass",  cal:190, pro:5.5, carb:30,  fat:5,   fiber:0,   sodium:80,  calcium:200, iron:0.1, vitC:0   },
  { id:378, name:"Thandai",                 cat:"drinks",   emoji:"🥛", serving:1,  unit:"glass",  cal:220, pro:6,   carb:28,  fat:9,   fiber:1,   sodium:60,  calcium:210, iron:0.8, vitC:0   },
  { id:379, name:"Fruit Yogurt",            cat:"drinks",   emoji:"🫙", serving:1,  unit:"cup",    cal:180, pro:8,   carb:30,  fat:3.5, fiber:0.5, sodium:80,  calcium:250, iron:0.2, vitC:2   },
  { id:380, name:"Coconut Milk",            cat:"drinks",   emoji:"🥥", serving:0.5,unit:"cup",    cal:140, pro:1.4, carb:3.2, fat:14,  fiber:0,   sodium:15,  calcium:16,  iron:1.6, vitC:0   },
];

// ----------------------------------------------------------
// EXERCISE DATABASE
// youtubeId: real tutorial video
// calsPerSet: estimated kcal for a 70kg person per set
// ----------------------------------------------------------
const EXERCISES = {
  // Chest
  benchPress:        { name:"Barbell Bench Press",    muscle:"Chest",    equipment:"Barbell",      youtubeId:"vcBig73ojpE", calsPerSet:10, form:["Plant feet flat on floor","Grip bar just outside shoulder width","Lower to mid-chest with control","Drive bar up in slight arc","Keep shoulder blades retracted throughout"], tips:"Don't bounce off your chest. Full ROM is key." },
  inclineDBPress:    { name:"Incline DB Press",        muscle:"Chest",    equipment:"Dumbbell",     youtubeId:"gl8H4QLXKTo", calsPerSet:9,  form:["Set bench to 30-45°","Dumbbells at chest level at bottom","Press up and slightly inward","Don't let elbows flare too wide","Control the negative for 2-3 sec"], tips:"Incline hits upper chest — the often-lagging portion." },
  declineBench:      { name:"Decline Bench Press",    muscle:"Chest",    equipment:"Barbell",      youtubeId:"nD6SkFUkBnA", calsPerSet:9,  form:["Feet secured on pad","Grip slightly wider than shoulder width","Lower bar to lower chest","Press explosively up","Spot recommended for heavy sets"], tips:"Targets lower chest. Don't go too steep — 15-30° is enough." },
  cableFly:          { name:"Cable Fly",               muscle:"Chest",    equipment:"Cable",        youtubeId:"nEbHESjrubI", calsPerSet:7,  form:["Stand between cable stacks","Slight forward lean","Bring handles together in sweeping arc","Slight bend in elbow throughout","Squeeze chest hard at the centre"], tips:"Cables keep tension throughout — better than dumbbell flys for full ROM." },
  pecDeck:           { name:"Pec Deck / Chest Fly",   muscle:"Chest",    equipment:"Machine",      youtubeId:"Q8Rra0yZCLE", calsPerSet:7,  form:["Sit with back flat against pad","Upper arms parallel to floor","Bring pads together squeezing chest","Control the return","Focus on the stretch at the open position"], tips:"Great isolation finisher. Doesn't need heavy weight to work." },
  pushups:           { name:"Push-Ups",                muscle:"Chest",    equipment:"Bodyweight",   youtubeId:"IODxDxX7oi4", calsPerSet:6,  form:["Hands slightly wider than shoulders","Body in straight line from head to heel","Lower until chest nearly touches floor","Drive through palms to push up","Keep core braced throughout"], tips:"Elevate feet for more upper chest. Add weight plate for progression." },
  dips:              { name:"Chest Dips",              muscle:"Chest",    equipment:"Bodyweight",   youtubeId:"2z8JmcrW-As", calsPerSet:8,  form:["Lean forward slightly for chest focus","Lower until upper arm is parallel to floor","Don't flare elbows excessively","Press back up to full extension","Add weight belt when bodyweight is easy"], tips:"Lean more forward = chest. Upright = triceps." },
  // Back
  deadlift:          { name:"Barbell Deadlift",        muscle:"Back",     equipment:"Barbell",      youtubeId:"WFUOtnI1jwk", calsPerSet:15, form:["Bar over mid-foot","Hinge at hips to grip bar","Brace core, take deep breath","Push floor away, bar stays close to legs","Lock out hips at top — don't hyperextend"], tips:"King of all lifts. Perfect form every single rep." },
  barbellRow:        { name:"Barbell Row",             muscle:"Back",     equipment:"Barbell",      youtubeId:"T3N-TO4reLQ", calsPerSet:10, form:["Hinge to ~45° torso angle","Pull bar to lower chest / navel","Lead with elbows, not hands","Squeeze shoulder blades at top","Lower with control — don't let weight yank you"], tips:"Overhand grip hits upper back more. Underhand = lower lats." },
  pullUps:           { name:"Pull-Ups",                muscle:"Back",     equipment:"Bodyweight",   youtubeId:"sIvJTfGxdFo", calsPerSet:10, form:["Dead hang to start","Initiate with shoulder blade depression","Drive elbows down to ribcage","Chin clears bar at top","Lower slowly — this is where gains are"], tips:"If can't do full reps: use band or do negatives." },
  latPulldown:       { name:"Lat Pulldown",            muscle:"Back",     equipment:"Cable",        youtubeId:"CAwf7n6Luuc", calsPerSet:8,  form:["Slight backward lean","Pull bar to upper chest","Drive elbows down and back","Squeeze lats at the bottom","Stretch fully at the top"], tips:"Think of your hands as hooks — drive elbows, not hands." },
  cableRow:          { name:"Seated Cable Row",        muscle:"Back",     equipment:"Cable",        youtubeId:"GZbfZ033f74", calsPerSet:8,  form:["Sit tall, slight bend in knees","Pull handle to lower abdomen","Drive elbows past torso","Squeeze shoulder blades together","Full stretch forward between reps"], tips:"Don't rock. Controlled negative is everything." },
  facePull:          { name:"Face Pulls",              muscle:"Back",     equipment:"Cable",        youtubeId:"rep-qVOkqgk", calsPerSet:5,  form:["Cable at face height or above","Pull rope to face — hands beside ears","External rotate at the end","Hold contraction for a beat","Use light weight, perfect form only"], tips:"Non-negotiable for shoulder health. Do these every push session." },
  straightArmPull:   { name:"Straight-Arm Pulldown",  muscle:"Back",     equipment:"Cable",        youtubeId:"F0pV7RSBx6w", calsPerSet:6,  form:["Stand facing cable, slight hinge","Arms straight with slight bend","Pull bar/rope down to hips","Squeeze lats at bottom","Slow return — full stretch at top"], tips:"Great lat isolation. Use rope or straight bar." },
  chestsupRow:       { name:"Chest-Supported Row",    muscle:"Back",     equipment:"Dumbbell",     youtubeId:"tQ4DdMXm1GY", calsPerSet:8,  form:["Lie chest on incline bench","Hang dumbbells below","Row up driving elbows to ceiling","Squeeze at top","Lower fully for full stretch"], tips:"Takes lower back out — pure back work." },
  // Shoulders
  ohp:               { name:"Overhead Press (BB)",    muscle:"Shoulders",equipment:"Barbell",      youtubeId:"_RlRDWO2jfg", calsPerSet:10, form:["Bar at front rack position","Grip just outside shoulders","Press straight up, bar tracks around head","Lock out fully overhead","Lower under control to clavicles"], tips:"Keep core tight — don't arch your lower back." },
  dbShoulderPress:   { name:"DB Shoulder Press",      muscle:"Shoulders",equipment:"Dumbbell",     youtubeId:"qEwKCR5JCog", calsPerSet:9,  form:["Sit on bench with back support","Dumbbells at shoulder height","Press up in slight arc","Don't fully lock out","Lower slowly to 90°"], tips:"More ROM than barbell. Allows natural wrist rotation." },
  arnoldPress:       { name:"Arnold Press",           muscle:"Shoulders",equipment:"Dumbbell",     youtubeId:"6Z15_WdXmVw", calsPerSet:9,  form:["Start with palms facing you, elbows low","Rotate hands out as you press up","Palms facing forward at full extension","Reverse on the way down","Full range of motion is the point"], tips:"Hits all three heads of the deltoid in one move." },
  lateralRaises:     { name:"Lateral Raises",         muscle:"Shoulders",equipment:"Dumbbell",     youtubeId:"Y29xKcze8Ik", calsPerSet:5,  form:["Slight forward lean","Lead with elbows, not hands","Raise to shoulder height — no higher","Slight internal rotation at top","Lower slowly — 3-4 seconds down"], tips:"Use light weight. Cheat reps defeat the purpose." },
  frontRaises:       { name:"Front Raises",           muscle:"Shoulders",equipment:"Dumbbell",     youtubeId:"gzuoJXbkGYM", calsPerSet:5,  form:["Stand tall with dumbbells at thighs","Raise arm to shoulder height","Keep arm nearly straight throughout","Lower with control","Alternate or both arms"], tips:"Anterior delt focus. Avoid if you bench and OHP heavy." },
  shrugs:            { name:"Barbell Shrugs",         muscle:"Shoulders",equipment:"Barbell",      youtubeId:"cJRVVxmytaM", calsPerSet:6,  form:["Grip bar outside hips","Pull shoulders straight up to ears","Hold briefly at top","Lower fully","No rolling — straight up and down"], tips:"Target upper traps. Go heavy, full ROM." },
  // Arms
  barbellCurl:       { name:"Barbell Curl",           muscle:"Arms",     equipment:"Barbell",      youtubeId:"kwG2ipFRgfo", calsPerSet:7,  form:["Elbows pinned to sides","Full hang at bottom","Curl to chin level","Squeeze bicep at top","3-second controlled negative"], tips:"EZ-bar if wrists ache with straight bar." },
  dbCurl:            { name:"Dumbbell Curl",          muscle:"Arms",     equipment:"Dumbbell",     youtubeId:"ykJmrZ5v0Oo", calsPerSet:6,  form:["Supinate wrist as you curl","Alternate or simultaneously","Full range all the way down","Keep torso still","Squeeze hard at the top"], tips:"Supination maximises bicep contraction." },
  hammerCurl:        { name:"Hammer Curls",           muscle:"Arms",     equipment:"Dumbbell",     youtubeId:"TwD-YGVP4Bk", calsPerSet:6,  form:["Neutral grip (palms facing each other)","Elbows stay pinned","Curl to shoulder height","No wrist rotation","Full extension at bottom"], tips:"Builds brachialis and brachioradialis — adds arm thickness." },
  preacherCurl:      { name:"Preacher Curl",          muscle:"Arms",     equipment:"Barbell",      youtubeId:"fIbDUKMv0Io", calsPerSet:6,  form:["Rest upper arm on pad fully","Full extension at bottom — crucial","Curl up until forearm nearly vertical","Squeeze hard","Lower slowly — resist the weight"], tips:"Eliminates cheating. Best for long-head bicep isolation." },
  concentrationCurl: { name:"Concentration Curl",    muscle:"Arms",     equipment:"Dumbbell",     youtubeId:"0AUGkch3tzc", calsPerSet:5,  form:["Sit, elbow braced on inner thigh","Full hang at bottom","Curl up — wrist supinated","Hold 1 second at top","Lower fully for max stretch"], tips:"Pure isolation. Great mind-muscle connection." },
  inclineDBCurl:     { name:"Incline DB Curl",        muscle:"Arms",     equipment:"Dumbbell",     youtubeId:"soxrZlIl35U", calsPerSet:6,  form:["Lie on incline bench, arms hanging behind","Curl up without moving upper arm","Long head of bicep gets max stretch","Supinate at top","Full range is critical here"], tips:"The stretch at the bottom with incline is unmatched for long-head development." },
  cableCurl:         { name:"Cable Curl",             muscle:"Arms",     equipment:"Cable",        youtubeId:"NFzTWp2qpiE", calsPerSet:6,  form:["Stand facing low cable","Keep elbows at sides","Curl handle to chin","Constant tension throughout","Squeeze and hold at top"], tips:"Cable keeps tension at the top unlike free weights." },
  tricepPushdown:    { name:"Tricep Pushdown",        muscle:"Arms",     equipment:"Cable",        youtubeId:"2-LAMcpzODU", calsPerSet:6,  form:["Elbows tucked to sides throughout","Push to full extension","Separate rope ends at bottom for full contraction","Control the way up","Don't let elbows drift forward"], tips:"Rope hits all three heads. Bar for heavier loading." },
  skullCrushers:     { name:"Skull Crushers",         muscle:"Arms",     equipment:"Barbell",      youtubeId:"d_KZxkY_0cM", calsPerSet:7,  form:["Lie flat on bench","Bar starts over eyes","Lower to forehead or behind head","Upper arms stay vertical","Press back up without swinging elbows forward"], tips:"Go lighter than you think. Elbow pain = form breakdown." },
  closeGripBench:    { name:"Close Grip Bench Press", muscle:"Arms",     equipment:"Barbell",      youtubeId:"nEF0bv2FW-s", calsPerSet:9,  form:["Grip shoulder width or slightly narrower","Elbows stay close to torso","Lower to lower chest","Press up powerfully","Same as bench but narrower grip"], tips:"Heavy tricep compound. Best builder for overall arm size." },
  overheadTricep:    { name:"Overhead Tricep Ext",    muscle:"Arms",     equipment:"Dumbbell",     youtubeId:"YbX7Wd8jQ-Q", calsPerSet:6,  form:["Hold dumbbell with both hands overhead","Lower behind head, elbows stay in","Extend fully at top","Full stretch at bottom","Can do seated or standing"], tips:"Stretches long head of tricep. Key for full development." },
  // Legs
  squat:             { name:"Back Squat",             muscle:"Legs",     equipment:"Barbell",      youtubeId:"bEv6CCg2BC8", calsPerSet:14, form:["Bar on traps, not neck","Stance slightly wider than hips, toes angled out","Break at hips and knees simultaneously","Descend until hips below parallel","Drive knees out on the way up"], tips:"Most important leg movement. Depth matters more than load." },
  frontSquat:        { name:"Front Squat",            muscle:"Legs",     equipment:"Barbell",      youtubeId:"M2pS_MOoMDQ", calsPerSet:12, form:["Bar across front deltoids, elbows high","More upright torso than back squat","Knees track over toes","Deep squat — more quad dominant","Core must stay braced"], tips:"More quad activation and less lower back stress than back squat." },
  romanianDL:        { name:"Romanian Deadlift",      muscle:"Legs",     equipment:"Barbell",      youtubeId:"JCXUYuzwNrM", calsPerSet:10, form:["Hinge at hips, slight knee bend","Bar traces close to legs","Feel deep hamstring stretch at bottom","Drive hips forward to stand","Keep back flat — hinge not squat"], tips:"The best hamstring builder. Go to full stretch each rep." },
  legPress:          { name:"Leg Press",              muscle:"Legs",     equipment:"Machine",      youtubeId:"IZxyjW7SKSA", calsPerSet:10, form:["Feet shoulder width on platform","Lower until 90° at knee — or below","Don't let lower back peel off seat","Press through heels, not toes","No lockout at top — keep tension"], tips:"Feet higher = more glutes and hamstrings. Lower = more quads." },
  hipThrust:         { name:"Hip Thrust (BB)",        muscle:"Legs",     equipment:"Barbell",      youtubeId:"SEdqd1n0cvg", calsPerSet:9,  form:["Upper back on bench, bar over hips","Drive through heels","At top: hips fully extended, shins vertical","Squeeze glutes hard at the top","Lower until glutes nearly touch floor"], tips:"Best glute builder. Use a pad on the bar for comfort." },
  legCurl:           { name:"Leg Curl (Machine)",     muscle:"Legs",     equipment:"Machine",      youtubeId:"1Tq3QdYUuHs", calsPerSet:7,  form:["Lie face down, pad above heel","Curl to full contraction","Hold 1 second","Lower slowly — 3 seconds","Pointed toes = more bicep femoris"], tips:"Full range of motion. Short reps are wasted reps." },
  legExtension:      { name:"Leg Extension",          muscle:"Legs",     equipment:"Machine",      youtubeId:"YyvSfVjQeL0", calsPerSet:7,  form:["Sit with pad just above ankle","Extend fully — toes can point toward shin","Hold 1 second at top","Lower slowly","Strict reps only"], tips:"Pure quad isolation. Feel the muscle." },
  hackSquat:         { name:"Hack Squat (Machine)",   muscle:"Legs",     equipment:"Machine",      youtubeId:"0tn5K9NlCfo", calsPerSet:10, form:["Feet shoulder width on platform","Lower slowly into deep squat","Back stays against pad throughout","Drive through heels to press up","Knees track over toes"], tips:"Safer alternative to barbell squat. Deep ROM important." },
  walkingLunges:     { name:"Walking Lunges",         muscle:"Legs",     equipment:"Dumbbell",     youtubeId:"L8fvypPrv5g", calsPerSet:9,  form:["Step forward, lower back knee toward floor","Front knee stays over ankle","Push off front foot to next step","Stay tall — don't lean forward","Full stride length for max stretch"], tips:"Balance + strength. Excellent quad, glute and hip flexor work." },
  calfRaises:        { name:"Standing Calf Raises",   muscle:"Legs",     equipment:"Machine",      youtubeId:"gwLzBJYoWlA", calsPerSet:5,  form:["Full stretch at the bottom","Rise to tiptoes, full extension","Hold 1-2 seconds at top","Control the negative","Calves need high reps — 15-20 minimum"], tips:"Calves are stubborn. Full ROM, high reps, high frequency." },
  seatedCalfRaise:   { name:"Seated Calf Raise",      muscle:"Legs",     equipment:"Machine",      youtubeId:"JbyjNymZOt0", calsPerSet:5,  form:["Pad rests above knees","Full stretch at bottom","Rise to full extension","2 second hold at top","Slow controlled negative"], tips:"Seated hits soleus more than standing. Both needed for full calves." },
  // Core
  plank:             { name:"Plank",                  muscle:"Core",     equipment:"Bodyweight",   youtubeId:"ASdvSXt8mRg", calsPerSet:4,  form:["Forearms on floor, elbows under shoulders","Body in straight line head to heels","Brace core as if about to be punched","Don't let hips sag or pike up","Breathe steadily"], tips:"Quality over duration. 30s perfect > 2min sagging." },
  russianTwist:      { name:"Russian Twist",          muscle:"Core",     equipment:"Bodyweight",   youtubeId:"wkD8rjkodUI", calsPerSet:4,  form:["Sit at ~45°, feet elevated","Rotate side to side, chest up","Touch weight or hands to floor each side","Move from obliques not shoulders","Add weight plate for progression"], tips:"Oblique focused. Keep lower back neutral." },
  legRaises:         { name:"Hanging Leg Raises",     muscle:"Core",     equipment:"Bodyweight",   youtubeId:"JB2oyawG9KI", calsPerSet:5,  form:["Hang from pull-up bar","Raise legs to parallel or higher","Control the descent — don't swing","Posterior pelvic tilt at the top","No kipping — full control"], tips:"Lower abs are hardest to develop. These target them directly." },
  cableCrunch:       { name:"Cable Crunch",           muscle:"Core",     equipment:"Cable",        youtubeId:"AV5Ph6yS1l8", calsPerSet:4,  form:["Kneel facing cable tower, rope attached to head","Pull elbows to knees rounding spine","Crunch down — don't just hinge at hips","Full stretch up between reps","Go heavy — abs are a muscle"], tips:"Best weighted ab exercise. Adds thickness to rectus abdominis." },
  mountainClimbers:  { name:"Mountain Climbers",      muscle:"Core",     equipment:"Bodyweight",   youtubeId:"nmwgirgXLYM", calsPerSet:6,  form:["High plank position","Drive knees to chest alternately","Hips stay level — don't pike","Fast for cardio, slow for core","Breathe rhythmically"], tips:"Core + cardio combo. Great finisher." },
  // Full body / Power
  powerClean:        { name:"Power Clean",            muscle:"Full Body",equipment:"Barbell",      youtubeId:"HqSJlVHmAR8", calsPerSet:14, form:["Bar over mid-foot","First pull: lift bar past knees","Second pull: explosive hip extension, shrug","Receive in slight squat, elbows high","Stand to complete"], tips:"Technical lift. Learn with light weight. Speed > load." },
  thruster:          { name:"Thruster (DB/BB)",       muscle:"Full Body",equipment:"Barbell",      youtubeId:"L219gS0AKG0", calsPerSet:14, form:["Front rack position, squat to parallel","Use leg drive to stand explosively","Transition into press overhead","Lock out fully overhead","Re-rack for next rep"], tips:"Metabolic monster. Combines squat and press." },
  pushPress:         { name:"Push Press",             muscle:"Full Body",equipment:"Barbell",      youtubeId:"iaBVSJm78ko", calsPerSet:12, form:["Dip slightly at knees, torso upright","Explosively drive legs, then press overhead","Bar travels straight up","Lock out at top","Use the leg drive — that's the point"], tips:"Allows heavier loads than strict OHP. Trains power output." },
  battleRopes:       { name:"Battle Ropes",           muscle:"Full Body",equipment:"Cables",       youtubeId:"9SRQhqkDIHU", calsPerSet:12, form:["Athletic stance, slight knee bend","Alternate or simultaneous waves","Drive from shoulders, not just arms","Keep core braced","Vary: slams, waves, circles"], tips:"High metabolic demand. 30-45 second bursts with rest." },
  burpees:           { name:"Burpees",                muscle:"Full Body",equipment:"Bodyweight",   youtubeId:"JZQA08SlJnM", calsPerSet:10, form:["Stand, drop to squat, kick feet to plank","Chest to floor optional","Jump feet back in, stand and jump","Arms overhead at jump","Keep steady pace"], tips:"Full body conditioning. Scale by removing push-up or jump." },

  // ── EXPANDED EXERCISE DATABASE — CHEST ─────────────────────
  landminePress:     { name:"Landmine Press",         muscle:"Chest",    equipment:"Barbell",      youtubeId:"9OW4SONxuGI", calsPerSet:9,  form:["Set barbell in corner or landmine base","Grip end of bar at shoulder height","Press bar up and forward in arc","Full extension overhead","Control the descent"], tips:"Excellent shoulder-friendly pressing option. Great for upper chest." },
  inclinePushup:     { name:"Incline Push-Up",        muscle:"Chest",    equipment:"Bodyweight",   youtubeId:"IODxDxX7oi4", calsPerSet:5,  form:["Hands on elevated surface (bench/box)","Body in straight plank line","Lower chest to surface with control","Press back up to full extension","Keep core locked throughout"], tips:"Lower angle = less intensity. Great warm-up or finisher." },
  dbPullover:        { name:"DB Pullover",            muscle:"Chest",    equipment:"Dumbbell",     youtubeId:"gl8H4QLXKTo", calsPerSet:7,  form:["Lie perpendicular on bench, hips lower","Hold dumbbell with both hands overhead","Lower behind head until full stretch","Pull back up in arc to start","Keep slight bend in elbows throughout"], tips:"Stretches the chest and lat simultaneously. Classic Arnold staple." },
  cableUpperFly:     { name:"High-to-Low Cable Fly",  muscle:"Chest",    equipment:"Cable",        youtubeId:"nEbHESjrubI", calsPerSet:7,  form:["Set cables high, above shoulder height","Step forward into split stance","Bring handles down and together in arc","Squeeze lower chest at the centre","Control the return with full stretch"], tips:"Targets lower chest shelf. Superior to decline press for isolation." },

  // ── EXPANDED EXERCISE DATABASE — BACK ──────────────────────
  tbarRow:           { name:"T-Bar Row",              muscle:"Back",     equipment:"Barbell",      youtubeId:"SbZycT7Eq58", calsPerSet:11, form:["Straddle landmine bar or T-bar station","Hinge at hips, flat back","Pull handles to chest, elbows drive back","Squeeze shoulder blades hard at top","Lower with full control"], tips:"Heavy compound pull. Works mid-back and lats together." },
  singleArmRow:      { name:"Single-Arm DB Row",      muscle:"Back",     equipment:"Dumbbell",     youtubeId:"gfUg6qWohTk", calsPerSet:9,  form:["One knee and hand on bench","Dumbbell hangs straight down","Drive elbow up and back past torso","Shoulder blade retracts at top","Full stretch at the bottom"], tips:"True lat isolation. Don't let shoulder rotate — pull straight back." },
  chinup:            { name:"Chin-Ups",               muscle:"Back",     equipment:"Bodyweight",   youtubeId:"sIvJTfGxdFo", calsPerSet:10, form:["Underhand (supinated) grip, shoulder width","Dead hang to start","Drive elbows down, pull chin over bar","Biceps actively assist in chin-ups","Slow controlled negative"], tips:"More bicep involvement than pull-ups. Easier to get first rep." },
  wideGripPulldown:  { name:"Wide-Grip Lat Pulldown", muscle:"Back",     equipment:"Cable",        youtubeId:"CAwf7n6Luuc", calsPerSet:8,  form:["Grip wider than shoulders","Slight backward lean","Pull bar to upper chest","Drive elbows down and flare outward","Full stretch at top"], tips:"Wide grip emphasises lat flare — the V-taper builder." },
  meadowsRow:        { name:"Meadows Row",            muscle:"Back",     equipment:"Barbell",      youtubeId:"gfUg6qWohTk", calsPerSet:10, form:["Straddle end of barbell in landmine","Wide overhand grip on collar","Row bar high to hip, elbow flares wide","Rotate torso slightly for max ROM","Lower fully for complete stretch"], tips:"John Meadows' signature move. Unparalleled lat-and-teres stretch." },
  rackPull:          { name:"Rack Pull",              muscle:"Back",     equipment:"Barbell",      youtubeId:"WFUOtnI1jwk", calsPerSet:13, form:["Set bar at knee height in rack","Standard deadlift grip","Hinge and brace, drive floor away","Lock out hips and glutes at top","Lower under control — no dropping"], tips:"Overloaded partial deadlift. Builds lockout strength and upper back thickness." },

  // ── EXPANDED EXERCISE DATABASE — SHOULDERS ─────────────────
  cableLateralRaise: { name:"Cable Lateral Raise",    muscle:"Shoulders",equipment:"Cable",        youtubeId:"Z5FA9aq3L6A", calsPerSet:5,  form:["Low cable at hip height, cross body grip","Slight forward lean","Raise arm out to shoulder height","Keep constant cable tension throughout","Slow lowering — 3 counts down"], tips:"Cable keeps tension at the bottom unlike dumbbells. Better for full ROM." },
  rearDeltFly:       { name:"Rear Delt Fly",          muscle:"Shoulders",equipment:"Dumbbell",     youtubeId:"zqWVolge-Tk", calsPerSet:5,  form:["Hinge 90° at hips or lie face down on incline bench","Arms hang below chest","Raise arms out to sides, lead with elbows","Squeeze rear delts at the top","Lower slowly with control"], tips:"Most neglected shoulder exercise. Balances all that pressing you do." },
  reverseFlyCable:   { name:"Reverse Cable Fly",      muscle:"Shoulders",equipment:"Cable",        youtubeId:"zqWVolge-Tk", calsPerSet:5,  form:["Cables set at shoulder height, cross arms","Step back and extend arms out to sides","Squeeze rear delts at full extension","Don't let elbows drop below shoulder line","Control the return"], tips:"Cable version of rear delt fly — constant tension throughout the ROM." },
  uprightRow:        { name:"Upright Row",            muscle:"Shoulders",equipment:"Barbell",      youtubeId:"cJRVVxmytaM", calsPerSet:7,  form:["Grip bar slightly narrower than shoulders","Pull bar straight up along body","Lead with elbows — they go higher than hands","Bar reaches lower chest at top","Lower slowly"], tips:"Wide grip safer for shoulder impingement. Don't pull to chin." },

  // ── EXPANDED EXERCISE DATABASE — ARMS ──────────────────────
  zottmanCurl:       { name:"Zottman Curl",           muscle:"Arms",     equipment:"Dumbbell",     youtubeId:"ZrpRBgswtHs", calsPerSet:6,  form:["Supinated grip at bottom","Curl up with normal bicep motion","Rotate to overhand grip at the top","Lower slowly in pronated (overhand) position","Rotate back and repeat"], tips:"Trains bicep on the way up, brachioradialis on the way down. Best bang-for-buck curl." },
  tricepKickback:    { name:"Tricep Kickback",        muscle:"Arms",     equipment:"Dumbbell",     youtubeId:"6SS6K3lAwZ8", calsPerSet:5,  form:["Hinge forward, upper arm parallel to floor","Extend forearm back until arm fully straight","Squeeze tricep hard at full extension","Lower with control","Upper arm stays completely still"], tips:"Light weight, strict form. Goes fully straight — that's the whole point." },
  ezBarCurl:         { name:"EZ-Bar Curl",            muscle:"Arms",     equipment:"Barbell",      youtubeId:"kwG2ipFRgfo", calsPerSet:7,  form:["Use angled EZ-bar grip","Elbows pinned to sides throughout","Curl to chin height","Squeeze at the top","Controlled 3-second negative"], tips:"Easier on wrists than straight bar. Full range of motion." },
  cableOverheadTricep:{ name:"Cable Overhead Tricep", muscle:"Arms",     equipment:"Cable",        youtubeId:"YbX7Wd8jQ-Q", calsPerSet:6,  form:["Stand facing away from cable tower","Grab rope attachment overhead","Hinge forward slightly","Extend arms fully forward","Stretch fully behind head between reps"], tips:"Stretches long head of tricep — key for full arm development." },
  spiderCurl:        { name:"Spider Curl",            muscle:"Arms",     equipment:"Dumbbell",     youtubeId:"fIbDUKMv0Io", calsPerSet:6,  form:["Lie face down on incline bench, arms hanging forward","Curl weight up to forehead — no body swing","Full squeeze at top","Lower to dead hang for maximum stretch","Each rep starts from full stretch"], tips:"Zero cheating possible. Best short-head bicep isolation." },
  reverseCurl:       { name:"Reverse Curl",           muscle:"Arms",     equipment:"Barbell",      youtubeId:"kwG2ipFRgfo", calsPerSet:5,  form:["Overhand (pronated) grip on barbell","Elbows stay pinned to sides","Curl bar up, wrists stay neutral","Full extension at bottom","Builds forearm and brachioradialis"], tips:"Builds forearm thickness and brachioradialis. Great complement to standard curl." },

  // ── EXPANDED EXERCISE DATABASE — LEGS ──────────────────────
  bulgarianSplitSquat:{ name:"Bulgarian Split Squat", muscle:"Legs",     equipment:"Dumbbell",     youtubeId:"hiLF_pF3EJM", calsPerSet:12, form:["Rear foot elevated on bench","Front foot far enough forward so shin stays vertical","Lower back knee toward floor","Front quad fully loaded","Drive through front heel to stand"], tips:"Hardest single-leg exercise. Humbles everyone. Best quad and glute developer after barbell squat." },
  gobletSquat:       { name:"Goblet Squat",           muscle:"Legs",     equipment:"Dumbbell",     youtubeId:"jZOvxOKYUFc", calsPerSet:9,  form:["Hold dumbbell/kettlebell at chest","Feet shoulder width, toes out","Squat deep — elbows track inside knees","Chest stays tall throughout","Drive up through heels"], tips:"Best beginner squat. Teaches proper form. Great warm-up even for advanced lifters." },
  stepUps:           { name:"Step-Ups",               muscle:"Legs",     equipment:"Dumbbell",     youtubeId:"aKj-6hgiViA", calsPerSet:9,  form:["Step onto box with full foot","Drive through heel of elevated foot","Stand to full extension at top","Lower the other foot down with control","Keep torso upright throughout"], tips:"Box height matters — higher = more glute. Lower = more quad." },
  sumoDeadlift:      { name:"Sumo Deadlift",          muscle:"Legs",     equipment:"Barbell",      youtubeId:"cDlOSfu-zHY", calsPerSet:13, form:["Wide stance, toes pointed 45° out","Narrow grip inside legs","Hips lower than conventional — more upright torso","Push floor apart, drive hips forward","Bar stays close to body throughout"], tips:"Shorter ROM than conventional. Emphasises inner thigh, glutes, quads." },
  gluteBridge:       { name:"Glute Bridge",           muscle:"Legs",     equipment:"Bodyweight",   youtubeId:"LZWQgMxryDc", calsPerSet:6,  form:["Lie on floor, knees bent, feet flat","Drive hips up through heels","Full extension — glutes squeezed hard at top","Hold 2 seconds at top","Lower with control"], tips:"Beginner version of hip thrust. Add weight across hips to progress." },
  nordicCurl:        { name:"Nordic Curl",            muscle:"Legs",     equipment:"Bodyweight",   youtubeId:"dJ8LBl3U85g", calsPerSet:10, form:["Kneel, feet anchored under pad or bar","Lower body forward from knees as slowly as possible","Use arms to catch yourself at bottom","Curl legs to pull back up","Keep hips extended throughout"], tips:"Hardest hamstring exercise. Eccentric focus — prevents hamstring tears." },
  boxJump:           { name:"Box Jump",               muscle:"Legs",     equipment:"Bodyweight",   youtubeId:"52lgn_-mHZE", calsPerSet:10, form:["Stand before sturdy box, feet shoulder width","Quarter-squat and swing arms back","Explode up, driving arms overhead","Land softly with bent knees on box","Step down — don't jump down"], tips:"Develops explosive power. Jump for height, not just clearing the box." },
  splitSquat:        { name:"Split Squat",            muscle:"Legs",     equipment:"Dumbbell",     youtubeId:"hiLF_pF3EJM", calsPerSet:9,  form:["Take a long stride forward","Both feet stay planted on floor","Lower back knee toward floor","Front shin stays vertical","Push through front heel to return"], tips:"Simpler than Bulgarian. Great unilateral leg builder with less balance demand." },
  donkeyCalfRaise:   { name:"Donkey Calf Raise",      muscle:"Legs",     equipment:"Machine",      youtubeId:"gwLzBJYoWlA", calsPerSet:5,  form:["Hinge at hips 90°, toes on platform","Full stretch at the bottom","Rise to full tiptoe extension","Hold 2 seconds at top","Slow 3-count negative"], tips:"Stretched-position calf raise — hits soleus and gastrocnemius in full length." },

  // ── EXPANDED EXERCISE DATABASE — CORE ──────────────────────
  abWheelRollout:    { name:"Ab Wheel Rollout",       muscle:"Core",     equipment:"Bodyweight",   youtubeId:"PK4n7qJpOhM", calsPerSet:7,  form:["Kneel with wheel under shoulders","Roll forward keeping arms straight","Lower as far as possible without touching floor","Hollow body position throughout","Pull wheel back by contracting abs"], tips:"Most effective core exercise per EMG studies. Start with partial ROM." },
  deadBug:           { name:"Dead Bug",               muscle:"Core",     equipment:"Bodyweight",   youtubeId:"4XLEnwUr1d8", calsPerSet:4,  form:["Lie on back, arms pointing to ceiling","Knees at 90°, raised to hip height","Extend opposite arm and leg simultaneously","Lower back stays pressed to floor","Return and alternate sides"], tips:"Perfect for anti-rotation and deep core stability. Key injury prevention exercise." },
  sidePlank:         { name:"Side Plank",             muscle:"Core",     equipment:"Bodyweight",   youtubeId:"ASdvSXt8mRg", calsPerSet:4,  form:["Forearm on floor, elbow under shoulder","Stack feet or stagger for stability","Drive hips up — body in straight line","Hold — don't let hip sag","Add rotation for advanced version"], tips:"Targets obliques and quadratus lumborum. Essential for spinal stability." },
  bicycleCrunch:     { name:"Bicycle Crunch",         muscle:"Core",     equipment:"Bodyweight",   youtubeId:"wkD8rjkodUI", calsPerSet:5,  form:["Lie back, hands lightly behind head","Bring one knee in as opposite elbow reaches toward it","Twist from the core — not the neck","Fully extend the other leg","Slow, deliberate rotation"], tips:"Highest rectus abdominis + oblique activation of any crunch variation per EMG research." },
  toeToBar:          { name:"Toes-to-Bar",            muscle:"Core",     equipment:"Bodyweight",   youtubeId:"JB2oyawG9KI", calsPerSet:6,  form:["Hang from pull-up bar in dead hang","Tilt pelvis posterior — hollow body","Drive toes up to touch bar","Control the descent — no swing","Keep shoulders packed, don't shrug"], tips:"Demands full core strength, grip, and shoulder stability. King of hanging core exercises." },
  paloffPress:       { name:"Pallof Press",           muscle:"Core",     equipment:"Cable",        youtubeId:"AV5Ph6yS1l8", calsPerSet:4,  form:["Cable at chest height, stand sideways to stack","Hands at chest, elbows in","Press arms straight out — resist rotation","Hold 2 seconds fully extended","Return hands to chest and repeat"], tips:"Anti-rotation core stability. Builds the core strength that protects your spine under load." },
  sitUp:             { name:"Sit-Up",                 muscle:"Core",     equipment:"Bodyweight",   youtubeId:"wkD8rjkodUI", calsPerSet:4,  form:["Feet anchored or free","Arms crossed on chest or behind head","Curl spine up — don't just jerk up","Touch elbows to knees at top","Lower slowly — control the eccentric"], tips:"Classic core builder. Add a decline bench or weight plate for progression." },

  // ── EXPANDED EXERCISE DATABASE — FULL BODY / CARDIO ────────
  farmersWalk:       { name:"Farmer's Walk",          muscle:"Full Body",equipment:"Dumbbell",     youtubeId:"yrVjW72pD98", calsPerSet:12, form:["Heavy dumbbells or trap bar at sides","Stand tall, chest up, shoulders back","Walk with controlled steps — don't waddle","Core braced hard throughout","Set down with a hinge, not a drop"], tips:"Builds grip, traps, core, and conditioning simultaneously. Hugely underutilised." },
  kettlebellSwing:   { name:"Kettlebell Swing",       muscle:"Full Body",equipment:"Kettlebell",   youtubeId:"d94xX-AQZ0A", calsPerSet:11, form:["Hip hinge — not a squat","Drive hips forward explosively to swing bell","Arms are a pendulum — hips do the work","Bell floats to chest height","Hinge back as bell descends, absorb with hamstrings"], tips:"Hip hinge power exercise. 10 sets of 10 equals 100 reps of explosive hip extension." },
  medicineBallSlam:  { name:"Medicine Ball Slam",     muscle:"Full Body",equipment:"Medicine Ball",youtubeId:"9SRQhqkDIHU", calsPerSet:11, form:["Stand with ball overhead, arms extended","Core tight, bend knees slightly","Slam ball to floor with full force","Squat to pick it up","Drive into next rep immediately"], tips:"Pure power and aggression. Stress relief and athletic conditioning in one." },
  jumpRope:          { name:"Jump Rope",              muscle:"Full Body",equipment:"Bodyweight",   youtubeId:"u3zgHI8QnqE", calsPerSet:9,  form:["Small jumps — just enough to clear rope","Land on balls of feet","Wrists do the rotation, not full arms","Stay light and rhythmic","Progress to double-unders"], tips:"Burns ~10 kcal/minute. Best warm-up and conditioning tool in any gym." },
  sledPush:          { name:"Sled Push",              muscle:"Full Body",equipment:"Sled",         youtubeId:"9SRQhqkDIHU", calsPerSet:14, form:["Hands on uprights, lean forward 45°","Drive legs powerfully, short quick steps","Push from hips — stay aggressive","Keep back flat throughout","Sprint the whole distance"], tips:"No eccentric, minimal soreness. Best pure conditioning tool. Hard to overtrain." },
};

// ----------------------------------------------------------
// WORKOUT PLANS — 5 VARIATIONS × 6 DAYS
// ----------------------------------------------------------
const WORKOUT_PLANS = [
  {
    id: 1, name: "Push / Pull / Legs", shortName: "PPL",
    description: "The gold standard for intermediate lifters. 6 days: Push A/B, Pull A/B, Legs A/B. Strength focus on day 1 of each; hypertrophy on day 2.",
    goal: "Hypertrophy + Strength", level: "Intermediate",
    days: [
      { day:1, name:"Push A — Strength",   focus:"Chest / Shoulders / Triceps", color:"#c0392b",
        exercises:[{key:"benchPress",sets:4,reps:"5",note:"Heavy"},{key:"ohp",sets:3,reps:"8",note:""},{key:"inclineDBPress",sets:3,reps:"10",note:""},{key:"lateralRaises",sets:4,reps:"15",note:"Strict form"},{key:"tricepPushdown",sets:3,reps:"12",note:""},{key:"overheadTricep",sets:3,reps:"12",note:""}]},
      { day:2, name:"Pull A — Strength",   focus:"Back / Biceps", color:"#1e3a5f",
        exercises:[{key:"deadlift",sets:4,reps:"5",note:"Heavy"},{key:"barbellRow",sets:3,reps:"8",note:""},{key:"latPulldown",sets:3,reps:"10",note:""},{key:"facePull",sets:3,reps:"15",note:"Always"},{key:"barbellCurl",sets:3,reps:"10",note:""},{key:"hammerCurl",sets:3,reps:"12",note:""}]},
      { day:3, name:"Legs A — Strength",   focus:"Quads / Hamstrings / Glutes", color:"#2d7a2d",
        exercises:[{key:"squat",sets:4,reps:"5",note:"Heavy"},{key:"romanianDL",sets:3,reps:"8",note:"Deep stretch"},{key:"legPress",sets:3,reps:"10",note:""},{key:"legCurl",sets:3,reps:"12",note:""},{key:"calfRaises",sets:4,reps:"15",note:""},{key:"legExtension",sets:3,reps:"15",note:"Finisher"}]},
      { day:4, name:"Push B — Hypertrophy",focus:"Chest / Shoulders / Triceps", color:"#c0392b",
        exercises:[{key:"inclineDBPress",sets:4,reps:"10",note:""},{key:"dbShoulderPress",sets:3,reps:"12",note:""},{key:"cableFly",sets:3,reps:"12",note:""},{key:"lateralRaises",sets:5,reps:"15",note:""},{key:"dips",sets:3,reps:"12",note:"Lean forward"},{key:"skullCrushers",sets:3,reps:"12",note:""}]},
      { day:5, name:"Pull B — Hypertrophy",focus:"Back / Biceps", color:"#1e3a5f",
        exercises:[{key:"pullUps",sets:4,reps:"8",note:""},{key:"cableRow",sets:3,reps:"12",note:""},{key:"chestsupRow",sets:3,reps:"12",note:""},{key:"facePull",sets:4,reps:"15",note:""},{key:"preacherCurl",sets:3,reps:"12",note:""},{key:"concentrationCurl",sets:3,reps:"12",note:""}]},
      { day:6, name:"Legs B — Hypertrophy",focus:"Quads / Glutes / Calves / Core", color:"#2d7a2d",
        exercises:[{key:"frontSquat",sets:3,reps:"8",note:""},{key:"hipThrust",sets:4,reps:"10",note:"Best glute"},{key:"walkingLunges",sets:3,reps:"12",note:"Per leg"},{key:"legExtension",sets:3,reps:"15",note:""},{key:"seatedCalfRaise",sets:4,reps:"15",note:""},{key:"cableCrunch",sets:3,reps:"15",note:""}]},
    ]
  },
  {
    id: 2, name: "Upper / Lower Split", shortName: "U/L",
    description: "4 upper + 2 lower sessions. Higher upper body frequency. Strength first, hypertrophy second. Excellent for balanced development.",
    goal: "Strength + Hypertrophy", level: "Intermediate",
    days: [
      { day:1, name:"Upper A — Strength",  focus:"Chest / Back Heavy", color:"#5d3a7a",
        exercises:[{key:"benchPress",sets:4,reps:"5",note:"Heavy"},{key:"barbellRow",sets:4,reps:"5",note:""},{key:"ohp",sets:3,reps:"6",note:""},{key:"pullUps",sets:3,reps:"6",note:"Weighted"},{key:"dips",sets:3,reps:"8",note:""},{key:"barbellCurl",sets:2,reps:"10",note:""}]},
      { day:2, name:"Lower A — Strength",  focus:"Quads / Posterior Chain", color:"#8b5e3c",
        exercises:[{key:"squat",sets:4,reps:"5",note:""},{key:"romanianDL",sets:4,reps:"5",note:""},{key:"legPress",sets:3,reps:"8",note:""},{key:"hipThrust",sets:3,reps:"8",note:""},{key:"calfRaises",sets:4,reps:"12",note:""}]},
      { day:3, name:"Upper B — Hypertrophy A",focus:"Chest / Shoulders", color:"#5d3a7a",
        exercises:[{key:"inclineDBPress",sets:4,reps:"10",note:""},{key:"cableRow",sets:3,reps:"12",note:""},{key:"lateralRaises",sets:4,reps:"12",note:""},{key:"facePull",sets:3,reps:"15",note:""},{key:"tricepPushdown",sets:3,reps:"12",note:""},{key:"dbCurl",sets:3,reps:"12",note:""}]},
      { day:4, name:"Lower B — Hypertrophy", focus:"Legs All Muscles", color:"#8b5e3c",
        exercises:[{key:"legPress",sets:4,reps:"12",note:""},{key:"legCurl",sets:4,reps:"12",note:""},{key:"walkingLunges",sets:3,reps:"12",note:""},{key:"legExtension",sets:3,reps:"15",note:""},{key:"seatedCalfRaise",sets:4,reps:"15",note:""},{key:"cableCrunch",sets:3,reps:"15",note:""}]},
      { day:5, name:"Upper C — Hypertrophy B",focus:"Back / Arms", color:"#5d3a7a",
        exercises:[{key:"latPulldown",sets:4,reps:"10",note:""},{key:"chestsupRow",sets:4,reps:"12",note:""},{key:"cableFly",sets:3,reps:"12",note:""},{key:"arnoldPress",sets:3,reps:"12",note:""},{key:"skullCrushers",sets:3,reps:"12",note:""},{key:"hammerCurl",sets:3,reps:"12",note:""}]},
      { day:6, name:"Full Body Power",     focus:"Power + Core", color:"#8b5e3c",
        exercises:[{key:"deadlift",sets:3,reps:"3",note:"Max effort"},{key:"pushPress",sets:3,reps:"5",note:"Explosive"},{key:"squat",sets:3,reps:"3",note:"Heavy"},{key:"pullUps",sets:3,reps:"5",note:"Weighted"},{key:"plank",sets:3,reps:"60s",note:""},{key:"russianTwist",sets:3,reps:"20",note:""}]},
    ]
  },
  {
    id: 3, name: "Classic Bro Split", shortName: "Bro",
    description: "One muscle group per day. Maximum volume per session. Great for hypertrophy and beginners learning individual muscles. Most popular gym split.",
    goal: "Hypertrophy / Size", level: "Beginner–Intermediate",
    days: [
      { day:1, name:"Chest Day",           focus:"Chest", color:"#c0392b",
        exercises:[{key:"benchPress",sets:4,reps:"8",note:""},{key:"inclineDBPress",sets:4,reps:"10",note:""},{key:"declineBench",sets:3,reps:"10",note:""},{key:"cableFly",sets:3,reps:"12",note:""},{key:"pecDeck",sets:3,reps:"15",note:""},{key:"pushups",sets:2,reps:"max",note:"Burnout"}]},
      { day:2, name:"Back Day",            focus:"Back", color:"#1e3a5f",
        exercises:[{key:"deadlift",sets:4,reps:"6",note:""},{key:"pullUps",sets:4,reps:"8",note:""},{key:"barbellRow",sets:4,reps:"10",note:""},{key:"latPulldown",sets:3,reps:"12",note:""},{key:"cableRow",sets:3,reps:"12",note:""},{key:"facePull",sets:3,reps:"15",note:""}]},
      { day:3, name:"Shoulder Day",        focus:"Shoulders", color:"#c87d0e",
        exercises:[{key:"ohp",sets:4,reps:"8",note:""},{key:"arnoldPress",sets:3,reps:"10",note:""},{key:"lateralRaises",sets:4,reps:"15",note:""},{key:"frontRaises",sets:3,reps:"12",note:""},{key:"facePull",sets:4,reps:"15",note:"Rear delts"},{key:"shrugs",sets:3,reps:"15",note:""}]},
      { day:4, name:"Arms Day",            focus:"Biceps + Triceps", color:"#5d3a7a",
        exercises:[{key:"barbellCurl",sets:4,reps:"10",note:""},{key:"inclineDBCurl",sets:3,reps:"12",note:""},{key:"concentrationCurl",sets:3,reps:"12",note:""},{key:"closeGripBench",sets:4,reps:"10",note:""},{key:"tricepPushdown",sets:3,reps:"12",note:""},{key:"skullCrushers",sets:3,reps:"12",note:""}]},
      { day:5, name:"Legs Day",            focus:"Quads / Hamstrings / Glutes / Calves", color:"#2d7a2d",
        exercises:[{key:"squat",sets:4,reps:"8",note:""},{key:"romanianDL",sets:3,reps:"10",note:""},{key:"legPress",sets:3,reps:"12",note:""},{key:"legCurl",sets:3,reps:"12",note:""},{key:"legExtension",sets:3,reps:"15",note:""},{key:"calfRaises",sets:4,reps:"20",note:""}]},
      { day:6, name:"Core + Cardio",       focus:"Abs + Conditioning", color:"#1e3a5f",
        exercises:[{key:"plank",sets:4,reps:"60s",note:""},{key:"russianTwist",sets:3,reps:"20",note:""},{key:"legRaises",sets:3,reps:"15",note:""},{key:"cableCrunch",sets:3,reps:"15",note:""},{key:"mountainClimbers",sets:3,reps:"45s",note:""},{key:"burpees",sets:3,reps:"15",note:"Conditioning"}]},
    ]
  },
  {
    id: 4, name: "Arnold Split", shortName: "Arnold",
    description: "Arnold Schwarzenegger's training split. Chest+Back, Shoulders+Arms, Legs — repeated twice weekly. Agonist-antagonist pairing for maximum pump and volume.",
    goal: "Hypertrophy / Size", level: "Intermediate–Advanced",
    days: [
      { day:1, name:"Chest + Back A",      focus:"Chest / Back Agonist-Antagonist", color:"#c0392b",
        exercises:[{key:"benchPress",sets:4,reps:"8",note:""},{key:"pullUps",sets:4,reps:"8",note:"Superset"},{key:"inclineDBPress",sets:3,reps:"10",note:""},{key:"barbellRow",sets:3,reps:"10",note:""},{key:"cableFly",sets:3,reps:"12",note:""},{key:"latPulldown",sets:3,reps:"12",note:""}]},
      { day:2, name:"Shoulders + Arms A",  focus:"Delts / Biceps / Triceps", color:"#8b5e3c",
        exercises:[{key:"ohp",sets:4,reps:"8",note:""},{key:"barbellCurl",sets:3,reps:"10",note:""},{key:"lateralRaises",sets:4,reps:"12",note:""},{key:"skullCrushers",sets:3,reps:"10",note:""},{key:"facePull",sets:3,reps:"12",note:""},{key:"hammerCurl",sets:3,reps:"12",note:""}]},
      { day:3, name:"Legs A",              focus:"Quads / Hamstrings / Glutes", color:"#2d7a2d",
        exercises:[{key:"squat",sets:4,reps:"8",note:""},{key:"romanianDL",sets:3,reps:"10",note:""},{key:"legPress",sets:3,reps:"12",note:""},{key:"legCurl",sets:3,reps:"12",note:""},{key:"calfRaises",sets:4,reps:"15",note:""},{key:"plank",sets:3,reps:"45s",note:""}]},
      { day:4, name:"Chest + Back B",      focus:"Upper Chest / Mid-Back", color:"#c0392b",
        exercises:[{key:"inclineDBPress",sets:4,reps:"10",note:""},{key:"chestsupRow",sets:4,reps:"10",note:""},{key:"declineBench",sets:3,reps:"12",note:""},{key:"cableRow",sets:3,reps:"12",note:""},{key:"pecDeck",sets:3,reps:"12",note:""},{key:"straightArmPull",sets:3,reps:"12",note:""}]},
      { day:5, name:"Shoulders + Arms B",  focus:"Rear Delts / Arm Detail", color:"#8b5e3c",
        exercises:[{key:"dbShoulderPress",sets:4,reps:"10",note:""},{key:"preacherCurl",sets:3,reps:"12",note:""},{key:"arnoldPress",sets:3,reps:"12",note:""},{key:"closeGripBench",sets:3,reps:"12",note:""},{key:"lateralRaises",sets:4,reps:"15",note:""},{key:"cableCurl",sets:3,reps:"12",note:""}]},
      { day:6, name:"Legs B",              focus:"Glutes / Hamstrings / Calves / Core", color:"#2d7a2d",
        exercises:[{key:"frontSquat",sets:3,reps:"8",note:""},{key:"hipThrust",sets:4,reps:"10",note:""},{key:"legPress",sets:3,reps:"12",note:""},{key:"walkingLunges",sets:3,reps:"12",note:"Per leg"},{key:"legExtension",sets:3,reps:"15",note:""},{key:"seatedCalfRaise",sets:4,reps:"15",note:""}]},
    ]
  },
  {
    id: 5, name: "PHAT Training", shortName: "PHAT",
    description: "Power Hypertrophy Adaptive Training by Dr. Layne Norton. 2 power days (low reps, heavy) + 4 hypertrophy days (moderate reps, high volume). Best of both worlds.",
    goal: "Strength + Hypertrophy", level: "Advanced",
    days: [
      { day:1, name:"Upper Body Power",    focus:"Chest / Back — Max Strength", color:"#c0392b",
        exercises:[{key:"benchPress",sets:3,reps:"3",note:"90-95% 1RM"},{key:"barbellRow",sets:3,reps:"3",note:"Heavy"},{key:"ohp",sets:3,reps:"5",note:""},{key:"pullUps",sets:3,reps:"5",note:"Weighted"},{key:"tricepPushdown",sets:3,reps:"8",note:""},{key:"barbellCurl",sets:3,reps:"8",note:""}]},
      { day:2, name:"Lower Body Power",    focus:"Quads / Posterior Chain — Max", color:"#c0392b",
        exercises:[{key:"squat",sets:3,reps:"3",note:"90-95% 1RM"},{key:"deadlift",sets:3,reps:"3",note:"Heavy"},{key:"legPress",sets:3,reps:"5",note:""},{key:"romanianDL",sets:3,reps:"5",note:""},{key:"calfRaises",sets:4,reps:"8",note:""}]},
      { day:3, name:"Back + Shoulders Hyp",focus:"Back / Rear Delts / Traps", color:"#1e3a5f",
        exercises:[{key:"latPulldown",sets:4,reps:"10",note:""},{key:"cableRow",sets:4,reps:"12",note:""},{key:"chestsupRow",sets:4,reps:"12",note:""},{key:"lateralRaises",sets:5,reps:"15",note:""},{key:"facePull",sets:4,reps:"15",note:""},{key:"shrugs",sets:3,reps:"15",note:""}]},
      { day:4, name:"Lower Body Hyp",      focus:"Legs — High Volume", color:"#1e3a5f",
        exercises:[{key:"hackSquat",sets:4,reps:"10",note:""},{key:"legPress",sets:4,reps:"12",note:""},{key:"legCurl",sets:4,reps:"12",note:""},{key:"legExtension",sets:4,reps:"15",note:""},{key:"walkingLunges",sets:3,reps:"12",note:""},{key:"calfRaises",sets:5,reps:"15",note:""}]},
      { day:5, name:"Chest + Arms Hyp",    focus:"Chest / Biceps / Triceps", color:"#1e3a5f",
        exercises:[{key:"inclineDBPress",sets:4,reps:"10",note:""},{key:"cableFly",sets:4,reps:"12",note:""},{key:"dips",sets:3,reps:"12",note:""},{key:"preacherCurl",sets:4,reps:"12",note:""},{key:"inclineDBCurl",sets:3,reps:"12",note:""},{key:"skullCrushers",sets:4,reps:"12",note:""},{key:"tricepPushdown",sets:3,reps:"15",note:""}]},
      { day:6, name:"Metabolic / Full Body",focus:"Conditioning + Core", color:"#1e3a5f",
        exercises:[{key:"thruster",sets:3,reps:"15",note:""},{key:"deadlift",sets:3,reps:"12",note:"Speed focus"},{key:"burpees",sets:3,reps:"15",note:""},{key:"mountainClimbers",sets:3,reps:"45s",note:""},{key:"battleRopes",sets:3,reps:"45s",note:""},{key:"cableCrunch",sets:3,reps:"15",note:""}]},
    ]
  },
];

// ----------------------------------------------------------
// HELPERS
// ----------------------------------------------------------
function getCalsBurned(exerciseKey, sets, userWeightKg = 70) {
  const ex = EXERCISES[exerciseKey];
  if (!ex) return 0;
  return Math.round(ex.calsPerSet * sets * (userWeightKg / 70));
}

function calculateBMR(weight, height, age, gender) {
  if (gender === 'male')   return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
}

const ACTIVITY_MULTIPLIERS = {
  sedentary:   { label: "Sedentary (desk job, no exercise)",     value: 1.2   },
  light:       { label: "Lightly Active (1–2 days/week)",        value: 1.375 },
  moderate:    { label: "Moderately Active (3–5 days/week)",     value: 1.55  },
  active:      { label: "Very Active (6–7 days hard training)",  value: 1.725 },
  extraActive: { label: "Extra Active (athlete/physical job)",   value: 1.9   },
};

function calculateTDEE(bmr, activityKey) {
  return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activityKey]?.value || 1.55));
}

function calculateGoalCalories(tdee, goal) {
  const map = {
    aggressive_loss: tdee - 750,
    loss:            tdee - 500,
    maintain:        tdee,
    recomp:          tdee,        // eat at maintenance, protein does the work
    gain:            tdee + 300,
    aggressive_gain: tdee + 500,
  };
  return Math.max(1200, map[goal] || tdee);
}

function calculateMacros(calories, weight, goal) {
  // Protein multipliers per goal (g per kg bodyweight)
  // recomp: 2.0g/kg — optimal for muscle preservation without being excessive
  const proteinMultiplier =
    (goal === 'gain' || goal === 'aggressive_gain') ? 2.2 :
    (goal === 'recomp') ? 2.0 :
    1.8;
  const proteinG = Math.round(weight * proteinMultiplier);
  const fatG     = Math.round(weight * 0.9);
  const carbG    = Math.round(Math.max(0, calories - proteinG*4 - fatG*9) / 4);
  return { protein: proteinG, fat: fatG, carbs: carbG };
}

function calculateBMI(weight, heightCm) {
  const h = heightCm / 100;
  return +(weight / (h * h)).toFixed(1);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return { label:"Underweight",    color:"#3498db" };
  if (bmi < 25)   return { label:"Normal Weight",  color:"#2d7a2d" };
  if (bmi < 30)   return { label:"Overweight",     color:"#c87d0e" };
  if (bmi < 35)   return { label:"Obese Class I",  color:"#c0392b" };
  return                  { label:"Obese Class II", color:"#922b21" };
}

// ----------------------------------------------------------
// WORKOUT RECOMMENDATION ENGINE
// Returns { planId, reason, tips[] } based on profile data
// Plan IDs: 1=PPL, 2=Upper/Lower, 3=Bro Split, 4=Arnold, 5=PHAT
// ----------------------------------------------------------
function getWorkoutRecommendation(profile) {
  if (!profile) return null;
  const { goal, activity, gender, weight } = profile;
  const isHighActivity = activity === 'active' || activity === 'extraActive';
  const isLowActivity  = activity === 'sedentary' || activity === 'light';

  let planId, reason;

  // Primary recommendation based on goal
  if (goal === 'recomp') {
    planId = isHighActivity ? 1 : 2;
    reason = isHighActivity
      ? 'PPL trains each muscle twice a week — the high frequency is ideal for body recomposition.'
      : 'Upper/Lower gives 4 quality sessions a week, perfect for recomp on moderate activity.';

  } else if (goal === 'aggressive_loss') {
    planId = isLowActivity ? 3 : 2;
    reason = isLowActivity
      ? 'Bro Split is sustainable on a steep deficit — focused volume, plenty of recovery time.'
      : 'Upper/Lower keeps intensity high while managing total fatigue on a large calorie deficit.';

  } else if (goal === 'loss') {
    planId = 2;
    reason = 'Upper/Lower is efficient for fat loss — 4 sessions/week, full-body stimulus, good calorie burn.';

  } else if (goal === 'gain' || goal === 'aggressive_gain') {
    planId = isHighActivity ? 5 : 4;
    reason = isHighActivity
      ? 'PHAT blends strength and hypertrophy — the dual stimulus is optimal for aggressive muscle building.'
      : 'Arnold Split delivers high volume per muscle group — a proven structure for size and strength.';

  } else {
    // maintain
    planId = 1;
    reason = 'PPL is the most balanced 6-day structure for maintaining fitness and strength long-term.';
  }

  // Beginners (low activity + gain/recomp) — don't recommend advanced plans
  if (isLowActivity && (goal === 'gain' || goal === 'recomp' || goal === 'aggressive_gain')) {
    planId = 3;
    reason = 'Bro Split is great for building a foundation — one muscle group per session, manageable volume, easy to be consistent.';
  }

  // Personalised tips
  const tips = [];

  if (weight > 90) {
    tips.push('At your bodyweight, compound lifts (squats, deadlifts, rows) burn significantly more calories — prioritise them over isolation work.');
  } else if (weight < 60) {
    tips.push('Focus on progressive overload — add weight or reps every week. At your weight, consistent progression is the fastest route to muscle.');
  }

  if (gender === 'female') {
    tips.push('Research shows women build muscle effectively at higher rep ranges (12–15 reps). Consider adjusting sets in your plan to that range for hypertrophy work.');
  }

  if (goal === 'recomp') {
    tips.push('Recomp takes patience — the scale may barely move while your body composition shifts. Track measurements and progress photos, not just weight.');
  }

  if (isLowActivity && goal !== 'maintain') {
    tips.push('You marked a low activity level — even 8,000 steps a day significantly boosts TDEE and accelerates your goal without extra gym time.');
  }

  return { planId, reason, tips };
}

// Alternate-name aliases so common shorthands still find the right item
const FOOD_ALIASES = {
  'rice':        ['basmati rice','jeera rice','veg fried rice','curd rice','lemon rice','tomato rice',
                  'plain white rice','brown rice','red rice','sona masoori rice','matar pulao',
                  'coconut rice','tamarind rice','methi rice','dal khichdi','bisi bele bath','khichdi','pongal'],
  'roti':        ['rotli / chapati','phulka (thin wheat roti)','whole wheat roti','multigrain roti',
                  'jowar roti','makki ki roti','missi roti (besan+wheat)','ragi roti','akki roti (rice flour)',
                  'plain paratha','aloo paratha','methi paratha','gobi paratha','paneer paratha','dal paratha',
                  'tandoori roti','rumali roti','lachha paratha','thalipeeth'],
  'paratha':     ['plain paratha','aloo paratha','methi paratha','gobi paratha','paneer paratha','dal paratha','lachha paratha'],
  'bhakhri':     ['bhakhri (wheat)','bhakhri (jowar)','bhakhri (bajra)'],
  'chapati':     ['rotli / chapati','phulka (thin wheat roti)','whole wheat roti'],
  'chawal':      ['basmati rice','plain white rice','jeera rice','curd rice'],
  'dahi chawal': ['curd rice'],
  'thayir sadam':['curd rice'],
  'puliyodarai': ['tamarind rice'],
  'fajeto':      ['fajeto'],
  'aam ras':     ['aam ras'],
  'mango curry': ['fajeto'],
  'khichdi':     ['khichdi','dal khichdi','sabudana khichdi'],
};

function searchFoods(query, category) {
  const q = query.toLowerCase().trim();
  if (q === '') {
    return category ? FOODS.filter(f => f.cat === category) : FOODS;
  }

  // Build set of item names matched by any alias
  const aliasMatches = new Set();
  for (const [alias, targets] of Object.entries(FOOD_ALIASES)) {
    if (alias.includes(q) || q.includes(alias)) {
      targets.forEach(t => aliasMatches.add(t.toLowerCase()));
    }
  }

  return FOODS.filter(f => {
    if (category && f.cat !== category) return false;
    const name = f.name.toLowerCase();
    return name.includes(q) || aliasMatches.has(name);
  }).sort((a, b) => {
    // starts-with ranked above contains
    const aS = a.name.toLowerCase().startsWith(q) ? 0 : 1;
    const bS = b.name.toLowerCase().startsWith(q) ? 0 : 1;
    return aS - bS || a.name.localeCompare(b.name);
  });
}
