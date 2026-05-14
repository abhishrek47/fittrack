// ============================================================
// FITTRACK — RECIPES.JS
// 70 curated protein-rich vegetarian recipes — unusual, restaurant-style (no soy)
// Includes: data, categories, recommendation algorithm
// ============================================================

var RECIPE_CATS = [
  { id:'all',         label:'All',           emoji:'🍽️' },
  { id:'paneer',      label:'Paneer',         emoji:'🧀' },
  { id:'rajma',       label:'Rajma',          emoji:'🫘' },
  { id:'chhole',      label:'Chhole',         emoji:'🫘' },
  { id:'dal',         label:'Dal',            emoji:'🥣' },
  { id:'sprouts',     label:'Sprouts',        emoji:'🌱' },
  { id:'oats',        label:'Oats & Quinoa',  emoji:'🌾' },
  { id:'curd',        label:'Curd & Milk',    emoji:'🥛' },
  { id:'greens',      label:'Greens',         emoji:'🥬' },
  { id:'nuts',        label:'Nuts',           emoji:'🥜' },
  { id:'rice',        label:'Rice',           emoji:'🍚' },
  { id:'southindian', label:'South Indian',   emoji:'🫓' },
];

// bestMeal: array of 'breakfast' | 'lunch' | 'snacks' | 'dinner'
// difficulty: 'easy' | 'medium' | 'hard'
// prepTime: minutes

var RECIPES = [

  // ── PANEER ───────────────────────────────────────────── (12) ──
  { id:2110, name:'Paneer Angara',          cat:'paneer', emoji:'🧀', protein:20, cal:310, carbs:8,  fat:22, fiber:2, sodium:560, calcium:260, iron:2.0, vitC:8,  servingSize:'1 bowl',      bestMeal:['dinner'],                  difficulty:'medium', prepTime:30, ytId:'2llKoPqi0Bc', desc:'Coal-smoked paneer in spiced onion-tomato gravy — dhungar technique gives it a flame-kissed depth' },
  { id:2111, name:'Paneer Kali Mirch',      cat:'paneer', emoji:'🧀', protein:19, cal:295, carbs:7,  fat:21, fiber:1, sodium:520, calcium:250, iron:1.8, vitC:5,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:25, ytId:'08NwR-LTz2c', desc:'Mughlai white cashew-cream gravy loaded with cracked black pepper — rarely made at home' },
  { id:2112, name:'Paneer Lababdar',        cat:'paneer', emoji:'🧀', protein:17, cal:330, carbs:12, fat:24, fiber:2, sodium:540, calcium:250, iron:1.8, vitC:10, servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:35, ytId:'1DbrPChGnpk', desc:'Punjab dhaba icon — rich slow-cooked tomato-cashew gravy more complex than butter paneer' },
  { id:2113, name:'Paneer Do Pyaza',        cat:'paneer', emoji:'🧀', protein:18, cal:280, carbs:10, fat:20, fiber:3, sodium:510, calcium:240, iron:1.9, vitC:12, servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:25, ytId:'jwk6G_-FZKM', desc:'Double-onion technique — onions in the base AND as textured chunks — intensely savoury dhaba style' },
  { id:2114, name:'Paneer Pasanda',         cat:'paneer', emoji:'🧀', protein:18, cal:360, carbs:10, fat:28, fiber:2, sodium:500, calcium:270, iron:2.0, vitC:5,  servingSize:'1 bowl',      bestMeal:['dinner'],                  difficulty:'hard',   prepTime:45, ytId:'Tjpnv6U9CrY', desc:'Slit paneer stuffed with dry fruit, shallow-fried, simmered in Mughlai almond-cream gravy' },
  { id:2115, name:'Paneer Khurchan',        cat:'paneer', emoji:'🧀', protein:17, cal:270, carbs:7,  fat:19, fiber:2, sodium:510, calcium:240, iron:1.7, vitC:15, servingSize:'1 plate',     bestMeal:['breakfast','dinner'],       difficulty:'easy',   prepTime:20, ytId:'04UaScefYNQ', desc:'Tawa-scraped paneer with peppers and spices — roadside dhaba technique different from bhurji' },
  { id:2116, name:'Achari Paneer Tikka',    cat:'paneer', emoji:'🧀', protein:22, cal:290, carbs:6,  fat:20, fiber:2, sodium:580, calcium:255, iron:1.8, vitC:6,  servingSize:'6 pieces',    bestMeal:['snacks','dinner'],          difficulty:'medium', prepTime:35, ytId:'TFsaZ3M7-HM', desc:'Paneer marinated in kalonji, fennel, mustard pickle spices — smoky and tangy, rarely on menus' },
  { id:2117, name:'Paneer Hariyali Kebab',  cat:'paneer', emoji:'🧀', protein:21, cal:260, carbs:5,  fat:18, fiber:2, sodium:500, calcium:250, iron:2.0, vitC:18, servingSize:'6 pieces',    bestMeal:['snacks','dinner'],          difficulty:'medium', prepTime:30, ytId:'jd5KVvkJm3o', desc:'Skewers marinated in spinach-mint-coriander paste — vibrant green, aromatic restaurant party starter' },
  { id:2118, name:'Methi Malai Paneer',     cat:'paneer', emoji:'🧀', protein:16, cal:300, carbs:10, fat:22, fiber:3, sodium:480, calcium:240, iron:3.0, vitC:8,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:25, ytId:'KKXaVuRl6pk', desc:'Fenugreek-forward creamy sauce, mildly bitter and rich — restaurant classic rarely made at home' },
  { id:2119, name:'Paneer Malai Kofta',     cat:'paneer', emoji:'🧀', protein:15, cal:400, carbs:16, fat:30, fiber:2, sodium:520, calcium:240, iron:1.8, vitC:6,  servingSize:'4 koftas',    bestMeal:['dinner'],                  difficulty:'hard',   prepTime:50, ytId:'oB86C26Lw1E', desc:'Paneer-potato balls stuffed with nuts, fried crisp, simmered in saffron-cream tomato gravy' },
  { id:2120, name:'Dahi Paneer Tikka',      cat:'paneer', emoji:'🧀', protein:22, cal:280, carbs:6,  fat:18, fiber:1, sodium:520, calcium:280, iron:1.6, vitC:5,  servingSize:'6 pieces',    bestMeal:['snacks','dinner'],          difficulty:'medium', prepTime:40, ytId:'oUGUv3Na3WY', desc:'Thick curd-marinated paneer with kasuri methi — softer and smokier than regular tikka' },
  { id:2121, name:'Paneer Lasooni Saag',    cat:'paneer', emoji:'🧀', protein:17, cal:260, carbs:9,  fat:18, fiber:4, sodium:500, calcium:260, iron:4.0, vitC:20, servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:30, ytId:'Ki9CAhr2s_s', desc:'Paneer in deeply garlicky saag — 3x more garlic than palak paneer, minus the cream, truly dhaba' },

  // ── RAJMA ─────────────────────────────────────────────── (4) ──
  { id:2018, name:'Rajma Tikki',            cat:'rajma',  emoji:'🫘', protein:10, cal:200, carbs:26, fat:6,  fiber:8,  sodium:360, calcium:60,  iron:3.0, vitC:4,  servingSize:'3 tikkis',    bestMeal:['snacks'],                  difficulty:'medium', prepTime:25, ytId:'-w6z7VBFeh0', desc:'Melt-in-mouth kidney bean patties — the rajma chawal lover\'s street food form with mint chutney' },
  { id:2022, name:'Rajma Cutlet',           cat:'rajma',  emoji:'🫘', protein:11, cal:220, carbs:30, fat:6,  fiber:7,  sodium:380, calcium:65,  iron:3.0, vitC:5,  servingSize:'3 cutlets',   bestMeal:['snacks'],                  difficulty:'medium', prepTime:25, ytId:'Z29q7-t3sko', desc:'Shallow-fried kidney bean cutlets with caramelised onion — more refined than a tikki' },
  { id:2122, name:'Rajma Galouti Kebab',    cat:'rajma',  emoji:'🫘', protein:11, cal:230, carbs:28, fat:8,  fiber:7,  sodium:380, calcium:60,  iron:3.5, vitC:4,  servingSize:'3 kebabs',    bestMeal:['snacks','dinner'],          difficulty:'hard',   prepTime:45, ytId:'VKaeC25l3lE', desc:'Lucknawi melt-in-mouth patties made with finely ground rajma and raw papaya — extraordinary texture' },
  { id:2123, name:'Kashmiri Rajma Curry',   cat:'rajma',  emoji:'🫘', protein:13, cal:290, carbs:40, fat:7,  fiber:10, sodium:460, calcium:70,  iron:4.5, vitC:5,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:45, ytId:'qJGPHbW3q8A', desc:'Small Kashmiri red beans in fennel-asafoetida-dry ginger gravy — completely different from Punjabi rajma' },

  // ── CHHOLE ────────────────────────────────────────────── (5) ──
  { id:2027, name:'Amritsari Chhole',       cat:'chhole', emoji:'🫘', protein:14, cal:300, carbs:42, fat:8,  fiber:11, sodium:520, calcium:90,  iron:4.5, vitC:5,  servingSize:'1 bowl',      bestMeal:['breakfast','lunch'],        difficulty:'medium', prepTime:40, ytId:'_e1hHIbdBUw', desc:'Black tea-brewed dark chickpeas with Punjabi spice blend — the authentic version, not the shortcut' },
  { id:2031, name:'Chhole Kulche',          cat:'chhole', emoji:'🫘', protein:14, cal:420, carbs:66, fat:10, fiber:9,  sodium:560, calcium:90,  iron:4.0, vitC:5,  servingSize:'1 plate',     bestMeal:['breakfast','lunch'],        difficulty:'medium', prepTime:35, ytId:'BeT4A0P2NaQ', desc:'Spicy chhole with soft baked kulcha — Delhi street food made at home, no tandoor needed' },
  { id:2032, name:'Kala Chana Masala',      cat:'chhole', emoji:'🫘', protein:13, cal:280, carbs:44, fat:6,  fiber:12, sodium:480, calcium:75,  iron:5.0, vitC:5,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:40, ytId:'gZcO8d2btZo', desc:'Black chickpeas in dry masala — higher iron than regular chhole, earthier taste, often overlooked' },
  { id:2124, name:'Chhole Palak',           cat:'chhole', emoji:'🫘', protein:13, cal:250, carbs:30, fat:8,  fiber:10, sodium:460, calcium:100, iron:5.0, vitC:20, servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:30, ytId:'_EvixoDw9dc', desc:'Iron-rich double win — chickpeas slow-cooked into spinach gravy with whole spices and coconut' },
  { id:2125, name:'Sukhe Kale Chhole',      cat:'chhole', emoji:'🫘', protein:12, cal:240, carbs:38, fat:5,  fiber:12, sodium:380, calcium:70,  iron:6.0, vitC:5,  servingSize:'1 bowl',      bestMeal:['breakfast','snacks'],       difficulty:'easy',   prepTime:15, ytId:'krPftkb32oE', desc:'Boiled black chickpeas tossed dry with cumin, amchur and raw onion — street breakfast protein bomb' },

  // ── DAL ───────────────────────────────────────────────── (11) ──
  { id:2033, name:'Dal Makhani',            cat:'dal',    emoji:'🥣', protein:12, cal:280, carbs:34, fat:10, fiber:8,  sodium:500, calcium:80,  iron:4.0, vitC:4,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:40, ytId:'mA5XjhdwJHc', desc:'Dhaba-style black lentils slow-cooked in tomato-butter — the 12-hour version, not the 20-min one' },
  { id:2035, name:'Masoor Dal Soup',        cat:'dal',    emoji:'🥣', protein:10, cal:180, carbs:26, fat:3,  fiber:7,  sodium:380, calcium:50,  iron:3.5, vitC:6,  servingSize:'1 bowl',      bestMeal:['snacks','lunch','dinner'],  difficulty:'easy',   prepTime:20, ytId:'xeYe7NrYeiM', desc:'Red lentil soup with roasted cumin, turmeric and lemon — light but protein-dense, great for immunity' },
  { id:2041, name:'Chana Dal Curry',        cat:'dal',    emoji:'🥣', protein:13, cal:250, carbs:36, fat:6,  fiber:9,  sodium:440, calcium:55,  iron:3.5, vitC:5,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:30, ytId:'fjSbadj9-_o', desc:'Split chickpea lentil with grated coconut, curry leaves and dried chilli — South Indian coastal style' },
  { id:2042, name:'Dhokla',                 cat:'dal',    emoji:'🥣', protein:10, cal:180, carbs:30, fat:4,  fiber:4,  sodium:360, calcium:65,  iron:2.0, vitC:6,  servingSize:'4 pieces',    bestMeal:['breakfast','snacks'],       difficulty:'medium', prepTime:30, ytId:null, desc:'Steamed fermented chickpea flour cake — spongy, tangy and surprisingly high in protein' },
  { id:2043, name:'Panchratan Dal',         cat:'dal',    emoji:'🥣', protein:14, cal:280, carbs:36, fat:6,  fiber:10, sodium:460, calcium:70,  iron:4.5, vitC:5,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:40, ytId:'q1NqB03IV4w', desc:'Five-lentil blend cooked together — each lentil adds a different protein and amino acid profile' },
  { id:2044, name:'Moong Dal Uttapam',      cat:'dal',    emoji:'🥣', protein:12, cal:220, carbs:32, fat:5,  fiber:5,  sodium:340, calcium:55,  iron:2.5, vitC:8,  servingSize:'2 uttapams',  bestMeal:['breakfast'],                difficulty:'medium', prepTime:25, ytId:null, desc:'Thick moong dal pancakes topped with onion and tomato — higher protein than regular uttapam' },
  { id:2126, name:'Dal Dhokli',             cat:'dal',    emoji:'🥣', protein:13, cal:320, carbs:52, fat:7,  fiber:8,  sodium:420, calcium:65,  iron:3.5, vitC:6,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:40, ytId:'ro8pCoI6Xc8', desc:'Gujarati spiced toor dal with wheat flour dumplings cooked inside — one-pot comfort masterpiece' },
  { id:2127, name:'Amti',                   cat:'dal',    emoji:'🥣', protein:11, cal:220, carbs:32, fat:5,  fiber:7,  sodium:400, calcium:55,  iron:3.0, vitC:5,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:30, ytId:'oTl_DYNAP0o', desc:'Maharashtrian toor dal with kokum, jaggery and goda masala — sweet-sour-spicy balance unique to Maharashtra' },
  { id:2128, name:'Pitla',                  cat:'dal',    emoji:'🥣', protein:12, cal:200, carbs:24, fat:7,  fiber:4,  sodium:380, calcium:55,  iron:2.5, vitC:5,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'easy',   prepTime:20, ytId:'udXqe3BixEk', desc:'Maharashtrian chickpea flour gravy — village-style protein dish eaten with bhakri or jowar roti' },
  { id:2129, name:'Burani Dal',             cat:'dal',    emoji:'🥣', protein:10, cal:210, carbs:28, fat:6,  fiber:6,  sodium:400, calcium:55,  iron:2.8, vitC:5,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:25, ytId:'QH5vUwMqwaY', desc:'Hyderabadi dal with a lavish fried garlic tadka as a final layer — different from every other dal' },
  { id:2130, name:'Matki Usal',             cat:'dal',    emoji:'🥣', protein:14, cal:220, carbs:30, fat:5,  fiber:10, sodium:360, calcium:70,  iron:4.0, vitC:8,  servingSize:'1 bowl',      bestMeal:['breakfast','lunch'],        difficulty:'medium', prepTime:30, ytId:'nCFxRM-N9DA', desc:'Sprouted moth beans in tangy Maharashtrian masala — on every Pune street corner, unknown elsewhere' },

  // ── SPROUTS ───────────────────────────────────────────── (6) ──
  { id:2054, name:'Sprouts Chaat',          cat:'sprouts',emoji:'🌱', protein:9,  cal:160, carbs:24, fat:3,  fiber:6,  sodium:280, calcium:45,  iron:2.8, vitC:15, servingSize:'1 bowl',      bestMeal:['snacks'],                  difficulty:'easy',   prepTime:10, ytId:null, desc:'Sprouted moong chaat with chutneys, pomegranate, black salt — zero cook, maximum flavour' },
  { id:2055, name:'Sprouts Tikki',          cat:'sprouts',emoji:'🌱', protein:9,  cal:180, carbs:26, fat:4,  fiber:5,  sodium:300, calcium:40,  iron:2.5, vitC:8,  servingSize:'3 tikkis',    bestMeal:['snacks'],                  difficulty:'medium', prepTime:20, ytId:null, desc:'Pan-fried sprouted lentil patties with coriander-garlic chutney — crunchier than aloo tikki' },
  { id:2057, name:'Sprouts Pulao',          cat:'sprouts',emoji:'🌱', protein:10, cal:280, carbs:50, fat:3,  fiber:7,  sodium:360, calcium:50,  iron:3.0, vitC:8,  servingSize:'1 cup',       bestMeal:['lunch'],                   difficulty:'medium', prepTime:25, ytId:null, desc:'Basmati rice cooked with mixed sprouts and whole spices — a protein-first take on everyday pulao' },
  { id:2058, name:'Sprouts Stuffed Roti',   cat:'sprouts',emoji:'🌱', protein:10, cal:280, carbs:44, fat:5,  fiber:7,  sodium:320, calcium:50,  iron:3.0, vitC:8,  servingSize:'2 rotis',     bestMeal:['breakfast','lunch'],        difficulty:'medium', prepTime:20, ytId:null, desc:'Whole-wheat roti stuffed with spiced sprouted moong — high protein flatbread no one talks about' },
  { id:2131, name:'Misal Pav',              cat:'sprouts',emoji:'🌱', protein:14, cal:380, carbs:58, fat:9,  fiber:12, sodium:560, calcium:80,  iron:5.0, vitC:12, servingSize:'1 plate',     bestMeal:['breakfast','snacks'],       difficulty:'hard',   prepTime:45, ytId:'gJXeu2Eih60', desc:"Fiery Pune sprouted moth bean curry with farsan on top — Maharashtra's iconic street food unlike anything North Indian" },
  { id:2132, name:'Sprouts Sundal',         cat:'sprouts',emoji:'🌱', protein:10, cal:180, carbs:26, fat:4,  fiber:8,  sodium:240, calcium:50,  iron:3.0, vitC:10, servingSize:'1 bowl',      bestMeal:['snacks'],                  difficulty:'easy',   prepTime:15, ytId:null, desc:"South Indian stir-fried sprouts with coconut, curry leaves and mustard — temple prasad that's effortlessly healthy" },

  // ── CURD & MILK ───────────────────────────────────────── (5) ──
  { id:2062, name:'Shrikhand',              cat:'curd',   emoji:'🥛', protein:10, cal:220, carbs:28, fat:6,  fiber:1,  sodium:80,  calcium:200, iron:0.5, vitC:3,  servingSize:'150g',        bestMeal:['snacks'],                  difficulty:'easy',   prepTime:10, ytId:null, desc:'Strained yogurt sweetened with saffron and cardamom — Gujarati-Maharashtrian dessert with real protein' },
  { id:2063, name:'Protein Lassi',          cat:'curd',   emoji:'🥛', protein:10, cal:200, carbs:22, fat:5,  fiber:1,  sodium:80,  calcium:220, iron:0.4, vitC:5,  servingSize:'300ml',       bestMeal:['breakfast','snacks'],       difficulty:'easy',   prepTime:5,  ytId:null, desc:'Full-fat curd blended with banana or mango — desi smoothie with 10g protein, no powder needed' },
  { id:2133, name:'Dahi Ke Kebab',          cat:'curd',   emoji:'🥛', protein:10, cal:180, carbs:12, fat:10, fiber:2,  sodium:320, calcium:180, iron:0.8, vitC:5,  servingSize:'4 kebabs',    bestMeal:['snacks'],                  difficulty:'medium', prepTime:30, ytId:'_cOTZrxINTA', desc:"Melt-in-mouth patties made from hung curd with paneer — MasterChef India's signature vegetarian starter" },
  { id:2134, name:'Kadhi Pakoda',           cat:'curd',   emoji:'🥛', protein:10, cal:250, carbs:28, fat:10, fiber:3,  sodium:440, calcium:160, iron:1.5, vitC:5,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:40, ytId:'zucwY4pw2Rk', desc:'Punjabi besan-yogurt gravy with golden fried pakodas — slow-simmered version leagues above the quick one' },
  { id:2135, name:"Labneh with Za'atar",    cat:'curd',   emoji:'🥛', protein:8,  cal:160, carbs:5,  fat:11, fiber:1,  sodium:220, calcium:200, iron:1.0, vitC:4,  servingSize:'100g',        bestMeal:['breakfast','snacks'],       difficulty:'easy',   prepTime:10, ytId:null, desc:"Middle Eastern strained yogurt with za'atar herbs and pumpkin seeds — trending high-protein breakfast dip" },

  // ── OATS & QUINOA ─────────────────────────────────────── (5) ──
  { id:2067, name:'Quinoa Pulao',           cat:'oats',   emoji:'🌾', protein:12, cal:320, carbs:50, fat:7,  fiber:4,  sodium:380, calcium:50,  iron:2.5, vitC:8,  servingSize:'1.5 cups',    bestMeal:['lunch','dinner'],           difficulty:'easy',   prepTime:25, ytId:null, desc:'Protein-rich quinoa cooked with vegetables and whole spices — 50% more protein per serving than rice pulao' },
  { id:2068, name:'Quinoa Salad',           cat:'oats',   emoji:'🌾', protein:11, cal:280, carbs:42, fat:8,  fiber:5,  sodium:280, calcium:55,  iron:2.8, vitC:15, servingSize:'1 bowl',      bestMeal:['lunch','snacks'],           difficulty:'easy',   prepTime:20, ytId:null, desc:'Cold quinoa with roasted veggies, chickpeas and tahini-lemon dressing — gym meal that actually tastes good' },
  { id:2073, name:'Quinoa Khichdi',         cat:'oats',   emoji:'🌾', protein:12, cal:300, carbs:48, fat:5,  fiber:6,  sodium:360, calcium:55,  iron:2.8, vitC:6,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'easy',   prepTime:25, ytId:'qcdMqTLUblg', desc:'Quinoa and moong dal cooked together with turmeric and ghee — same soul as khichdi, double the protein' },
  { id:2075, name:'Quinoa Upma',            cat:'oats',   emoji:'🌾', protein:11, cal:280, carbs:44, fat:6,  fiber:4,  sodium:340, calcium:50,  iron:2.5, vitC:8,  servingSize:'1 bowl',      bestMeal:['breakfast','lunch'],        difficulty:'easy',   prepTime:20, ytId:null, desc:'Quinoa cooked upma-style with mustard, curry leaves and mixed vegetables — south Indian feel, global grain' },
  { id:2136, name:'Oats Adai',              cat:'oats',   emoji:'🌾', protein:13, cal:240, carbs:34, fat:5,  fiber:6,  sodium:320, calcium:60,  iron:2.8, vitC:5,  servingSize:'2 adais',     bestMeal:['breakfast','lunch'],        difficulty:'medium', prepTime:25, ytId:null, desc:'Oats and mixed lentil thick crispy pancake — South Indian technique, 30% more protein than regular oats' },

  // ── GREENS ────────────────────────────────────────────── (6) ──
  { id:2079, name:'Methi Thepla',           cat:'greens', emoji:'🥬', protein:8,  cal:260, carbs:38, fat:7,  fiber:5,  sodium:360, calcium:100, iron:3.0, vitC:12, servingSize:'3 theplas',   bestMeal:['breakfast','lunch'],        difficulty:'medium', prepTime:25, ytId:'l-6wWsZoFpE', desc:'Thin Gujarati flatbread with fenugreek and spices — iron-rich, travels well, addictive with curd' },
  { id:2081, name:'Green Moong Dal',        cat:'greens', emoji:'🥬', protein:12, cal:200, carbs:28, fat:3,  fiber:7,  sodium:360, calcium:55,  iron:3.0, vitC:8,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'easy',   prepTime:20, ytId:'BmNtLpTTzc8', desc:'Whole green moong with ginger, turmeric and lemon — the simplest high-protein dal, often skipped for arhar' },
  { id:2083, name:'Broccoli Paneer Stir Fry',cat:'greens',emoji:'🥬', protein:15, cal:240, carbs:10, fat:16, fiber:4,  sodium:400, calcium:240, iron:2.5, vitC:85, servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'easy',   prepTime:20, ytId:null, desc:'High-protein stir fry with broccoli florets and paneer — 85mg vitamin C plus 15g protein per bowl' },
  { id:2137, name:'Keerai Kootu',           cat:'greens', emoji:'🥬', protein:11, cal:190, carbs:24, fat:6,  fiber:7,  sodium:320, calcium:130, iron:4.0, vitC:30, servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:30, ytId:'SB_7RyYHCvA', desc:'Tamil Nadu spinach and lentil stew with ground coconut — earthy, iron-dense, deeply satisfying' },
  { id:2138, name:'Sarson Ka Saag',         cat:'greens', emoji:'🥬', protein:10, cal:220, carbs:18, fat:12, fiber:7,  sodium:380, calcium:180, iron:5.0, vitC:40, servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'hard',   prepTime:60, ytId:'-yhf5fx6LQM', desc:'Punjabi triple-green saag — mustard, spinach, bathua — slow-cooked 3 hours with makki di roti' },
  { id:2139, name:'Methi Muthia',           cat:'greens', emoji:'🥬', protein:9,  cal:210, carbs:32, fat:5,  fiber:5,  sodium:280, calcium:90,  iron:3.5, vitC:15, servingSize:'8 pieces',    bestMeal:['breakfast','snacks'],       difficulty:'medium', prepTime:30, ytId:null, desc:'Gujarati steamed chickpea-wheat dumplings loaded with fenugreek — guilt-free snack rarely seen outside Gujarat' },

  // ── NUTS ──────────────────────────────────────────────── (5) ──
  { id:2087, name:'Peanut Chutney Dosa',    cat:'nuts',   emoji:'🥜', protein:10, cal:320, carbs:46, fat:10, fiber:4,  sodium:380, calcium:50,  iron:1.8, vitC:4,  servingSize:'2 dosas',     bestMeal:['breakfast','lunch'],        difficulty:'medium', prepTime:20, ytId:null, desc:'Crispy rice dosa with protein-rich homemade peanut chutney — groundnuts add 5g extra protein per serving' },
  { id:2088, name:'Mixed Nut Ladoo',        cat:'nuts',   emoji:'🥜', protein:7,  cal:260, carbs:20, fat:16, fiber:3,  sodium:20,  calcium:60,  iron:2.0, vitC:2,  servingSize:'3 pieces',    bestMeal:['snacks'],                  difficulty:'medium', prepTime:20, ytId:null, desc:'Energy-dense nut balls with dates and seeds — real food alternative to protein bars, no refined sugar' },
  { id:2089, name:'Sesame Peanut Chikki',   cat:'nuts',   emoji:'🥜', protein:8,  cal:200, carbs:18, fat:12, fiber:2,  sodium:30,  calcium:80,  iron:2.5, vitC:1,  servingSize:'2 pieces',    bestMeal:['snacks'],                  difficulty:'medium', prepTime:20, ytId:null, desc:'Crunchy jaggery-bound sesame and peanut brittle — iron, calcium and protein in one bite' },
  { id:2140, name:'Badam Shorba',           cat:'nuts',   emoji:'🥜', protein:8,  cal:220, carbs:10, fat:16, fiber:3,  sodium:280, calcium:80,  iron:1.5, vitC:4,  servingSize:'1 bowl',      bestMeal:['snacks','dinner'],          difficulty:'medium', prepTime:30, ytId:'LeIRDi1rFp4', desc:'Mughlai almond cream soup with saffron, cardamom and rose water — fine-dining restaurant starter at home' },
  { id:2141, name:'Makhane Ki Sabzi',       cat:'nuts',   emoji:'🥜', protein:9,  cal:250, carbs:18, fat:16, fiber:3,  sodium:380, calcium:60,  iron:1.5, vitC:5,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'easy',   prepTime:20, ytId:null, desc:'Roasted lotus seeds in rich cashew-tomato gravy — unusual, delicious and lower-carb than most curries' },

  // ── RICE ──────────────────────────────────────────────── (4) ──
  { id:2092, name:'Bisi Bele Bath',         cat:'rice',   emoji:'🍚', protein:12, cal:380, carbs:62, fat:8,  fiber:8,  sodium:480, calcium:70,  iron:3.5, vitC:8,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'hard',   prepTime:45, ytId:'Gm8yj88dlFk', desc:'Karnataka one-pot rice, dal and vegetable dish with custom bisi bele spice mix — each cook has a secret recipe' },
  { id:2094, name:'Tamarind Rice',          cat:'rice',   emoji:'🍚', protein:8,  cal:320, carbs:56, fat:8,  fiber:3,  sodium:400, calcium:45,  iron:2.0, vitC:4,  servingSize:'1.5 cups',    bestMeal:['lunch','dinner'],           difficulty:'medium', prepTime:20, ytId:'t5w-Qb4JRUk', desc:'Andhra-style puliyodarai — tangy tamarind rice with peanuts, temple style, not the shortcut version' },
  { id:2142, name:'Dal Baati Churma',       cat:'rice',   emoji:'🍚', protein:14, cal:520, carbs:76, fat:14, fiber:10, sodium:440, calcium:65,  iron:4.5, vitC:5,  servingSize:'2 baatis',    bestMeal:['lunch','dinner'],           difficulty:'hard',   prepTime:60, ytId:'mZ4xTelTAGk', desc:"Rajasthani baked wheat balls served with panchmel dal and ghee — a protein feast that's a full meal" },
  { id:2143, name:'Vagharela Bhaat',        cat:'rice',   emoji:'🍚', protein:9,  cal:300, carbs:52, fat:6,  fiber:3,  sodium:320, calcium:40,  iron:1.5, vitC:6,  servingSize:'1.5 cups',    bestMeal:['breakfast','lunch'],        difficulty:'easy',   prepTime:15, ytId:null, desc:'Gujarati tempered leftover rice with mustard, curry leaves, peanuts and lemon — humble but addictive' },

  // ── SOUTH INDIAN ──────────────────────────────────────── (7) ──
  { id:2097, name:'Pesarattu',              cat:'southindian',emoji:'🫓',protein:12, cal:220, carbs:32, fat:4,  fiber:6,  sodium:280, calcium:50,  iron:3.0, vitC:5,  servingSize:'2 dosas',     bestMeal:['breakfast','lunch'],        difficulty:'medium', prepTime:20, ytId:'ZOTgfPwBivA', desc:'Andhra green moong dosa — no rice, no fermentation, pure protein — the original high-protein dosa' },
  { id:2100, name:'Adai Dosa',              cat:'southindian',emoji:'🫓',protein:14, cal:250, carbs:36, fat:6,  fiber:6,  sodium:320, calcium:60,  iron:3.0, vitC:6,  servingSize:'2 adais',     bestMeal:['breakfast','lunch'],        difficulty:'medium', prepTime:25, ytId:null, desc:'Multi-lentil thick dosa with 5 different dals — twice the protein of regular dosa, crispy outside soft inside' },
  { id:2105, name:'Kuzhi Paniyaram',        cat:'southindian',emoji:'🫓',protein:8,  cal:220, carbs:36, fat:5,  fiber:3,  sodium:300, calcium:45,  iron:1.8, vitC:3,  servingSize:'6 pieces',    bestMeal:['breakfast','snacks'],       difficulty:'medium', prepTime:20, ytId:'T_psJBhd4Lc', desc:"Crispy outside, soft inside — fermented rice-lentil dumplings in a mould, the snack better than appe" },
  { id:2106, name:'Kozhukattai',            cat:'southindian',emoji:'🫓',protein:6,  cal:200, carbs:36, fat:4,  fiber:3,  sodium:120, calcium:30,  iron:1.2, vitC:2,  servingSize:'4 pieces',    bestMeal:['breakfast','snacks'],       difficulty:'medium', prepTime:25, ytId:null, desc:"Tamil Nadu's steamed rice flour dumplings with coconut-lentil stuffing — the underrated breakfast" },
  { id:2144, name:'Paruppu Urundai Kulambu',cat:'southindian',emoji:'🫓',protein:14, cal:280, carbs:36, fat:8,  fiber:8,  sodium:420, calcium:70,  iron:4.0, vitC:8,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],           difficulty:'hard',   prepTime:50, ytId:null, desc:'Tamil Nadu lentil balls simmered in tamarind-coconut curry — festive dish rarely made at home, extraordinary' },
  { id:2145, name:'Thavala Adai',           cat:'southindian',emoji:'🫓',protein:13, cal:240, carbs:36, fat:5,  fiber:6,  sodium:300, calcium:55,  iron:3.0, vitC:5,  servingSize:'2 adais',     bestMeal:['breakfast','lunch'],        difficulty:'medium', prepTime:30, ytId:null, desc:'Kerala crispy multi-grain adai with 5 lentils and rice — more protein than regular dosa, incredible crunch' },
  { id:2146, name:'Keerai Vadai',           cat:'southindian',emoji:'🫓',protein:11, cal:220, carbs:26, fat:8,  fiber:5,  sodium:340, calcium:70,  iron:3.5, vitC:15, servingSize:'4 vadas',     bestMeal:['breakfast','snacks'],       difficulty:'medium', prepTime:30, ytId:null, desc:'Crispy urad dal vadas mixed with fresh spinach — green, protein-rich upgrade on regular medu vada' },

];

// ── RECIPE UTILITIES ──────────────────────────────────────────

// Returns the category label for a cat id
function getRecipeCatLabel(catId) {
  const cat = RECIPE_CATS.find(c => c.id === catId);
  return cat ? cat.label : catId;
}

// Returns the meal label
function getMealLabel(meal) {
  const map = { breakfast:'Breakfast', lunch:'Lunch', snacks:'Snacks', dinner:'Dinner' };
  return map[meal] || meal;
}

// Storage: tried recipes per profile
function loadTriedRecipes() {
  if (!window.ACTIVE_PROFILE) return {};
  return JSON.parse(localStorage.getItem(`ft_recipes_tried_${window.ACTIVE_PROFILE.id}`) || '{}');
}
function saveTriedRecipes(data) {
  if (!window.ACTIVE_PROFILE) return;
  localStorage.setItem(`ft_recipes_tried_${window.ACTIVE_PROFILE.id}`, JSON.stringify(data));
}

// Mark a recipe as tried (called when user adds it to a meal)
function markRecipeTried(recipeId, meal) {
  const tried = loadTriedRecipes();
  if (!tried[recipeId]) {
    tried[recipeId] = { count: 0, lastTried: 0, meals: [] };
  }
  tried[recipeId].count += 1;
  tried[recipeId].lastTried = Date.now();
  if (meal && !tried[recipeId].meals.includes(meal)) {
    tried[recipeId].meals.push(meal);
  }
  saveTriedRecipes(tried);
}

// ── RECOMMENDATION ALGORITHM ──────────────────────────────────
// Score: 1000 = never tried (highest priority)
// Penalises recently tried / frequently tried
// Bonuses for meal match and category variety
function scoreRecipe(recipe, triedData, preferredMeal) {
  let score = 1000;

  if (triedData) {
    const daysSince = (Date.now() - triedData.lastTried) / 86400000;
    const count     = triedData.count || 0;

    // Recency penalty — hard block for same-day, ease off over weeks
    if      (daysSince < 1)  score = 150;
    else if (daysSince < 3)  score = 400;
    else if (daysSince < 7)  score = 600;
    else if (daysSince < 14) score = 780;
    else                     score = 900;

    // Frequency penalty (heavy-repeat recipes rank lower)
    score -= Math.min(count * 18, 180);
  }

  // Meal-time relevance bonus
  if (preferredMeal && recipe.bestMeal.includes(preferredMeal)) {
    score += 150;
  }

  // Random jitter keeps recommendations fresh on each render
  score += (Math.random() - 0.5) * 60;

  return Math.round(score);
}

// Returns scored + sorted recipe list
function getScoredRecipes(catFilter, sortMode, searchQuery, preferredMeal) {
  const tried = loadTriedRecipes();
  let list = RECIPES.slice();

  // Category filter
  if (catFilter && catFilter !== 'all') {
    list = list.filter(r => r.cat === catFilter);
  }

  // Search filter — prefix match on name
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    list = list.filter(r => r.name.toLowerCase().includes(q));
  }

  switch (sortMode) {
    case 'untried':
      list = list.filter(r => !tried[r.id]);
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'protein':
      list.sort((a, b) => b.protein - a.protein);
      break;
    case 'quick':
      list.sort((a, b) => a.prepTime - b.prepTime);
      break;
    case 'recommended':
    default:
      list = list.map(r => ({ r, score: scoreRecipe(r, tried[r.id], preferredMeal) }))
                 .sort((a, b) => b.score - a.score)
                 .map(o => o.r);
      break;
  }

  return list;
}

// Returns the single best untried recommendation for the suggest banner
function getTopSuggestion(catFilter, preferredMeal) {
  const tried = loadTriedRecipes();
  let list = catFilter && catFilter !== 'all'
    ? RECIPES.filter(r => r.cat === catFilter)
    : RECIPES.slice();

  // Untried first, then least-recently tried
  const untried = list.filter(r => !tried[r.id]);
  if (untried.length > 0) {
    // Pick randomly from top-5 untried for variety
    const pool = untried.slice(0, Math.min(5, untried.length));
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // All tried — pick least recently tried
  list.sort((a, b) => (tried[a.id]?.lastTried || 0) - (tried[b.id]?.lastTried || 0));
  return list[0] || null;
}
