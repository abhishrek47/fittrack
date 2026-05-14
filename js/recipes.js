// ============================================================
// FITTRACK — RECIPES.JS
// 105+ protein-rich vegetarian recipes (no soy)
// Includes: data, categories, recommendation algorithm
// ============================================================

const RECIPE_CATS = [
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

const RECIPES = [

  // ── PANEER ───────────────────────────────────────────────── (16)
  { id:2001, name:'Paneer Bhurji',             cat:'paneer',      emoji:'🧀', protein:18, cal:280, carbs:8,  fat:20, fiber:2, sodium:520, calcium:240, iron:2.0, vitC:8,  servingSize:'1 cup',       bestMeal:['breakfast','dinner'],         difficulty:'easy',   prepTime:15, desc:'Scrambled paneer with onions, tomatoes & garam masala' },
  { id:2002, name:'Palak Paneer',              cat:'paneer',      emoji:'🧀', protein:16, cal:260, carbs:10, fat:18, fiber:3, sodium:480, calcium:280, iron:4.0, vitC:20, servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'medium', prepTime:25, desc:'Creamy spinach curry with soft paneer cubes' },
  { id:2003, name:'Paneer Tikka',              cat:'paneer',      emoji:'🧀', protein:22, cal:300, carbs:6,  fat:20, fiber:1, sodium:560, calcium:260, iron:1.5, vitC:5,  servingSize:'6 pieces',    bestMeal:['snacks','dinner'],            difficulty:'medium', prepTime:30, desc:'Marinated grilled paneer with bell peppers & onions' },
  { id:2004, name:'Paneer Paratha',            cat:'paneer',      emoji:'🧀', protein:14, cal:340, carbs:38, fat:14, fiber:3, sodium:420, calcium:200, iron:2.0, vitC:2,  servingSize:'2 parathas',  bestMeal:['breakfast','lunch'],          difficulty:'medium', prepTime:25, desc:'Stuffed whole-wheat flatbread with spiced paneer filling' },
  { id:2005, name:'Matar Paneer',              cat:'paneer',      emoji:'🧀', protein:14, cal:280, carbs:18, fat:16, fiber:4, sodium:500, calcium:220, iron:2.5, vitC:12, servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'medium', prepTime:25, desc:'Peas and paneer in tangy tomato-onion gravy' },
  { id:2006, name:'Paneer Butter Masala',      cat:'paneer',      emoji:'🧀', protein:16, cal:320, carbs:14, fat:22, fiber:2, sodium:580, calcium:240, iron:1.8, vitC:8,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'medium', prepTime:30, desc:'Paneer in rich, creamy tomato-butter sauce' },
  { id:2007, name:'Paneer Sandwich',           cat:'paneer',      emoji:'🧀', protein:15, cal:280, carbs:30, fat:12, fiber:2, sodium:460, calcium:200, iron:1.5, vitC:6,  servingSize:'2 slices',    bestMeal:['breakfast','snacks'],         difficulty:'easy',   prepTime:10, desc:'Grilled sandwich with spiced paneer and vegetables' },
  { id:2008, name:'Kadai Paneer',              cat:'paneer',      emoji:'🧀', protein:18, cal:290, carbs:10, fat:20, fiber:2, sodium:540, calcium:250, iron:1.8, vitC:15, servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'medium', prepTime:25, desc:'Dry paneer stir-fry with capsicum in aromatic kadai masala' },
  { id:2009, name:'Paneer Khichdi',            cat:'paneer',      emoji:'🧀', protein:16, cal:310, carbs:42, fat:10, fiber:4, sodium:400, calcium:180, iron:2.5, vitC:4,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'easy',   prepTime:20, desc:'Comforting rice and lentil porridge with paneer' },
  { id:2010, name:'Paneer Capsicum Stir Fry',  cat:'paneer',      emoji:'🧀', protein:15, cal:240, carbs:8,  fat:16, fiber:3, sodium:380, calcium:220, iron:1.5, vitC:30, servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'easy',   prepTime:15, desc:'Quick stir-fry with paneer, mixed peppers and spices' },
  { id:2011, name:'Paneer Pulao',              cat:'paneer',      emoji:'🧀', protein:16, cal:380, carbs:52, fat:12, fiber:3, sodium:460, calcium:200, iron:2.0, vitC:5,  servingSize:'1.5 cups',    bestMeal:['lunch','dinner'],             difficulty:'medium', prepTime:30, desc:'Fragrant basmati rice cooked with paneer and whole spices' },
  { id:2012, name:'Shahi Paneer',              cat:'paneer',      emoji:'🧀', protein:15, cal:340, carbs:12, fat:24, fiber:2, sodium:520, calcium:260, iron:1.6, vitC:6,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'medium', prepTime:30, desc:'Royal paneer in cashew-cream-tomato gravy' },
  { id:2013, name:'Paneer Kathi Roll',         cat:'paneer',      emoji:'🧀', protein:17, cal:380, carbs:44, fat:14, fiber:3, sodium:500, calcium:200, iron:2.0, vitC:10, servingSize:'2 rolls',     bestMeal:['lunch','snacks'],             difficulty:'medium', prepTime:20, desc:'Spiced paneer wrapped in a whole-wheat chapati' },
  { id:2014, name:'Paneer Dosa',               cat:'paneer',      emoji:'🧀', protein:14, cal:340, carbs:46, fat:12, fiber:2, sodium:440, calcium:180, iron:2.0, vitC:4,  servingSize:'2 dosas',     bestMeal:['breakfast','lunch'],          difficulty:'medium', prepTime:20, desc:'Crispy rice dosa with spiced paneer masala filling' },
  { id:2015, name:'Chilli Paneer',             cat:'paneer',      emoji:'🧀', protein:18, cal:300, carbs:14, fat:18, fiber:2, sodium:620, calcium:240, iron:1.8, vitC:25, servingSize:'1 bowl',      bestMeal:['snacks','dinner'],            difficulty:'medium', prepTime:25, desc:'Indo-Chinese style crispy paneer with chilli sauce' },
  { id:2016, name:'Paneer Salad',              cat:'paneer',      emoji:'🧀', protein:16, cal:200, carbs:6,  fat:14, fiber:3, sodium:300, calcium:250, iron:1.5, vitC:20, servingSize:'1 large bowl', bestMeal:['snacks','lunch'],            difficulty:'easy',   prepTime:10, desc:'Fresh paneer with cucumber, tomato, herbs and lemon dressing' },

  // ── RAJMA ─────────────────────────────────────────────────── (8)
  { id:2017, name:'Rajma Chawal',              cat:'rajma',       emoji:'🫘', protein:14, cal:380, carbs:62, fat:6,  fiber:12, sodium:480, calcium:80,  iron:4.0, vitC:5,  servingSize:'1 plate',     bestMeal:['lunch','dinner'],             difficulty:'medium', prepTime:40, desc:'Slow-cooked kidney beans in tomato-onion gravy over rice' },
  { id:2018, name:'Rajma Tikki',               cat:'rajma',       emoji:'🫘', protein:10, cal:200, carbs:26, fat:6,  fiber:8,  sodium:360, calcium:60,  iron:3.0, vitC:4,  servingSize:'3 tikkis',    bestMeal:['snacks'],                     difficulty:'medium', prepTime:25, desc:'Crispy spiced kidney bean patties — great with chutney' },
  { id:2019, name:'Rajma Salad',               cat:'rajma',       emoji:'🫘', protein:12, cal:180, carbs:28, fat:4,  fiber:10, sodium:280, calcium:70,  iron:3.5, vitC:15, servingSize:'1 bowl',      bestMeal:['snacks','lunch'],             difficulty:'easy',   prepTime:10, desc:'Cold kidney bean salad with onion, tomato, lemon and herbs' },
  { id:2020, name:'Rajma Soup',                cat:'rajma',       emoji:'🫘', protein:10, cal:160, carbs:22, fat:3,  fiber:8,  sodium:380, calcium:60,  iron:3.0, vitC:6,  servingSize:'1 bowl',      bestMeal:['snacks','lunch'],             difficulty:'easy',   prepTime:20, desc:'Hearty, protein-rich kidney bean soup with cumin and garlic' },
  { id:2021, name:'Rajma Wrap',                cat:'rajma',       emoji:'🫘', protein:14, cal:320, carbs:48, fat:6,  fiber:9,  sodium:420, calcium:80,  iron:3.5, vitC:8,  servingSize:'2 wraps',     bestMeal:['lunch','snacks'],             difficulty:'easy',   prepTime:15, desc:'Rajma masala wrapped in whole-wheat roti with curd and veggies' },
  { id:2022, name:'Rajma Cutlet',              cat:'rajma',       emoji:'🫘', protein:11, cal:220, carbs:30, fat:6,  fiber:7,  sodium:380, calcium:65,  iron:3.0, vitC:5,  servingSize:'3 cutlets',   bestMeal:['snacks'],                     difficulty:'medium', prepTime:25, desc:'Shallow-fried kidney bean cutlets with mint chutney' },
  { id:2023, name:'Rajma Paratha',             cat:'rajma',       emoji:'🫘', protein:12, cal:340, carbs:52, fat:8,  fiber:8,  sodium:400, calcium:70,  iron:3.5, vitC:4,  servingSize:'2 parathas',  bestMeal:['breakfast','lunch'],          difficulty:'medium', prepTime:25, desc:'Rajma-stuffed whole-wheat flatbread, pan-fried with ghee' },
  { id:2024, name:'Rajma Rice Bowl',           cat:'rajma',       emoji:'🫘', protein:15, cal:380, carbs:60, fat:6,  fiber:11, sodium:460, calcium:80,  iron:4.0, vitC:6,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'easy',   prepTime:15, desc:'Rajma masala on brown rice with pickled onions and curd' },

  // ── CHHOLE ────────────────────────────────────────────────── (8)
  { id:2025, name:'Chhole Bhature',            cat:'chhole',      emoji:'🫘', protein:14, cal:480, carbs:72, fat:14, fiber:10, sodium:600, calcium:90,  iron:4.5, vitC:6,  servingSize:'1 plate',     bestMeal:['lunch'],                      difficulty:'hard',   prepTime:50, desc:'Spicy chickpea curry served with fluffy deep-fried bhature' },
  { id:2026, name:'Chhole Chawal',             cat:'chhole',      emoji:'🫘', protein:13, cal:380, carbs:62, fat:6,  fiber:10, sodium:480, calcium:85,  iron:4.0, vitC:6,  servingSize:'1 plate',     bestMeal:['lunch','dinner'],             difficulty:'medium', prepTime:35, desc:'Classic chickpea curry served over steamed basmati rice' },
  { id:2027, name:'Amritsari Chhole',          cat:'chhole',      emoji:'🫘', protein:14, cal:300, carbs:42, fat:8,  fiber:11, sodium:520, calcium:90,  iron:4.5, vitC:5,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'medium', prepTime:40, desc:'Dark, intensely spiced Punjabi-style black chickpea curry' },
  { id:2028, name:'Chhole Tikki Chaat',        cat:'chhole',      emoji:'🫘', protein:12, cal:280, carbs:46, fat:6,  fiber:9,  sodium:480, calcium:80,  iron:3.5, vitC:8,  servingSize:'1 plate',     bestMeal:['snacks'],                     difficulty:'medium', prepTime:25, desc:'Crispy potato patties topped with chhole, chutneys & yogurt' },
  { id:2029, name:'Chhole Salad',              cat:'chhole',      emoji:'🫘', protein:12, cal:200, carbs:30, fat:4,  fiber:10, sodium:300, calcium:80,  iron:3.5, vitC:15, servingSize:'1 bowl',      bestMeal:['snacks','lunch'],             difficulty:'easy',   prepTime:10, desc:'Protein-packed chickpea salad with veggies and chaat masala' },
  { id:2030, name:'Chhole Wrap',               cat:'chhole',      emoji:'🫘', protein:14, cal:340, carbs:52, fat:7,  fiber:9,  sodium:440, calcium:85,  iron:4.0, vitC:8,  servingSize:'2 wraps',     bestMeal:['lunch','snacks'],             difficulty:'easy',   prepTime:15, desc:'Spiced chickpeas with veggies and chutneys in a wheat wrap' },
  { id:2031, name:'Chhole Kulche',             cat:'chhole',      emoji:'🫘', protein:14, cal:420, carbs:66, fat:10, fiber:9,  sodium:560, calcium:90,  iron:4.0, vitC:5,  servingSize:'1 plate',     bestMeal:['breakfast','lunch'],          difficulty:'medium', prepTime:35, desc:'Spicy chhole served with soft baked kulcha bread' },
  { id:2032, name:'Kala Chana Masala',         cat:'chhole',      emoji:'🫘', protein:13, cal:280, carbs:44, fat:6,  fiber:12, sodium:480, calcium:75,  iron:5.0, vitC:5,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'medium', prepTime:40, desc:'Black chickpeas cooked in dry masala — high in iron & fiber' },

  // ── DAL ───────────────────────────────────────────────────── (12)
  { id:2033, name:'Dal Makhani',               cat:'dal',         emoji:'🥣', protein:12, cal:280, carbs:34, fat:10, fiber:8,  sodium:500, calcium:80,  iron:4.0, vitC:4,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'medium', prepTime:40, desc:'Slow-cooked black lentils in creamy tomato-butter sauce' },
  { id:2034, name:'Moong Dal Chilla',          cat:'dal',         emoji:'🥣', protein:14, cal:200, carbs:24, fat:5,  fiber:5,  sodium:320, calcium:60,  iron:2.5, vitC:5,  servingSize:'3 chillas',   bestMeal:['breakfast','snacks'],         difficulty:'easy',   prepTime:15, desc:'Savoury green moong lentil pancakes with ginger and green chilli' },
  { id:2035, name:'Masoor Dal Soup',           cat:'dal',         emoji:'🥣', protein:10, cal:180, carbs:26, fat:3,  fiber:7,  sodium:380, calcium:50,  iron:3.5, vitC:6,  servingSize:'1 bowl',      bestMeal:['lunch','dinner','snacks'],    difficulty:'easy',   prepTime:20, desc:'Light red lentil soup with turmeric, cumin and lemon' },
  { id:2036, name:'Dal Tadka',                 cat:'dal',         emoji:'🥣', protein:11, cal:220, carbs:30, fat:6,  fiber:6,  sodium:420, calcium:55,  iron:3.0, vitC:4,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'easy',   prepTime:20, desc:'Yellow lentils tempered with ghee, mustard and garlic' },
  { id:2037, name:'Toor Dal Fry',              cat:'dal',         emoji:'🥣', protein:10, cal:200, carbs:28, fat:5,  fiber:6,  sodium:400, calcium:50,  iron:2.8, vitC:4,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'easy',   prepTime:25, desc:'Arhar dal cooked to perfection with tomato and spices' },
  { id:2038, name:'Dal Khichdi',               cat:'dal',         emoji:'🥣', protein:13, cal:280, carbs:46, fat:4,  fiber:7,  sodium:380, calcium:55,  iron:3.0, vitC:4,  servingSize:'1 bowl',      bestMeal:['breakfast','lunch','dinner'], difficulty:'easy',   prepTime:20, desc:'Comforting rice and lentil one-pot meal with light spices' },
  { id:2039, name:'Moong Dal Soup',            cat:'dal',         emoji:'🥣', protein:9,  cal:150, carbs:20, fat:2,  fiber:5,  sodium:320, calcium:50,  iron:2.0, vitC:5,  servingSize:'1 bowl',      bestMeal:['snacks','lunch'],             difficulty:'easy',   prepTime:15, desc:'Thin, nourishing green moong soup with ginger and turmeric' },
  { id:2040, name:'Dal Paratha',               cat:'dal',         emoji:'🥣', protein:12, cal:320, carbs:48, fat:8,  fiber:6,  sodium:400, calcium:55,  iron:2.8, vitC:3,  servingSize:'2 parathas',  bestMeal:['breakfast','lunch'],          difficulty:'medium', prepTime:25, desc:'Lentil-stuffed flatbread packed with protein and spices' },
  { id:2041, name:'Chana Dal Curry',           cat:'dal',         emoji:'🥣', protein:13, cal:250, carbs:36, fat:6,  fiber:9,  sodium:440, calcium:55,  iron:3.5, vitC:5,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'medium', prepTime:30, desc:'Split chickpea lentil cooked with coconut and spices' },
  { id:2042, name:'Dhokla',                    cat:'dal',         emoji:'🥣', protein:10, cal:180, carbs:30, fat:4,  fiber:4,  sodium:360, calcium:65,  iron:2.0, vitC:6,  servingSize:'4 pieces',    bestMeal:['breakfast','snacks'],         difficulty:'medium', prepTime:30, desc:'Steamed fermented chickpea flour cakes — light and protein-rich' },
  { id:2043, name:'Panchratan Dal',            cat:'dal',         emoji:'🥣', protein:14, cal:280, carbs:36, fat:6,  fiber:10, sodium:460, calcium:70,  iron:4.5, vitC:5,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'medium', prepTime:40, desc:'Five-lentil blend cooked together — ultimate protein combo' },
  { id:2044, name:'Moong Dal Uttapam',         cat:'dal',         emoji:'🥣', protein:12, cal:220, carbs:32, fat:5,  fiber:5,  sodium:340, calcium:55,  iron:2.5, vitC:8,  servingSize:'2 uttapams',  bestMeal:['breakfast'],                  difficulty:'medium', prepTime:25, desc:'Thick moong dal pancakes topped with onion and tomato' },

  // ── SPROUTS ───────────────────────────────────────────────── (7)
  { id:2053, name:'Moong Sprouts Salad',       cat:'sprouts',     emoji:'🌱', protein:8,  cal:130, carbs:18, fat:2,  fiber:5, sodium:200, calcium:40,  iron:2.5, vitC:12, servingSize:'1 bowl',      bestMeal:['snacks','lunch'],             difficulty:'easy',   prepTime:10, desc:'Crunchy sprouted moong with lemon, cumin and fresh veggies' },
  { id:2054, name:'Sprouts Chaat',             cat:'sprouts',     emoji:'🌱', protein:9,  cal:160, carbs:24, fat:3,  fiber:6, sodium:280, calcium:45,  iron:2.8, vitC:15, servingSize:'1 bowl',      bestMeal:['snacks'],                     difficulty:'easy',   prepTime:10, desc:'Tangy sprouts chaat with chutneys, pomegranate and spices' },
  { id:2055, name:'Sprouts Tikki',             cat:'sprouts',     emoji:'🌱', protein:9,  cal:180, carbs:26, fat:4,  fiber:5, sodium:300, calcium:40,  iron:2.5, vitC:8,  servingSize:'3 tikkis',    bestMeal:['snacks'],                     difficulty:'medium', prepTime:20, desc:'Pan-fried sprouted lentil patties with green chutney' },
  { id:2056, name:'Mixed Sprouts Soup',        cat:'sprouts',     emoji:'🌱', protein:8,  cal:140, carbs:18, fat:2,  fiber:5, sodium:280, calcium:45,  iron:2.5, vitC:10, servingSize:'1 bowl',      bestMeal:['snacks','lunch'],             difficulty:'easy',   prepTime:15, desc:'Light, nourishing soup with mixed sprouted legumes and spices' },
  { id:2057, name:'Sprouts Pulao',             cat:'sprouts',     emoji:'🌱', protein:10, cal:280, carbs:50, fat:3,  fiber:7, sodium:360, calcium:50,  iron:3.0, vitC:8,  servingSize:'1 cup',       bestMeal:['lunch'],                      difficulty:'medium', prepTime:25, desc:'Basmati rice cooked with mixed sprouts and whole spices' },
  { id:2058, name:'Sprouts Stuffed Roti',      cat:'sprouts',     emoji:'🌱', protein:10, cal:280, carbs:44, fat:5,  fiber:7, sodium:320, calcium:50,  iron:3.0, vitC:8,  servingSize:'2 rotis',     bestMeal:['breakfast','lunch'],          difficulty:'medium', prepTime:20, desc:'Whole-wheat roti stuffed with spiced sprouted moong' },
  { id:2059, name:'Sprouts Bhel',              cat:'sprouts',     emoji:'🌱', protein:8,  cal:150, carbs:24, fat:3,  fiber:5, sodium:260, calcium:40,  iron:2.5, vitC:12, servingSize:'1 bowl',      bestMeal:['snacks'],                     difficulty:'easy',   prepTime:10, desc:'Light and crunchy sprouts bhel with puffed rice and chutneys' },

  // ── CURD & MILK ───────────────────────────────────────────── (7)
  { id:2060, name:'Greek Yogurt Bowl',         cat:'curd',        emoji:'🥛', protein:12, cal:180, carbs:16, fat:5,  fiber:2, sodium:60,  calcium:200, iron:0.5, vitC:8,  servingSize:'200g',        bestMeal:['breakfast','snacks'],         difficulty:'easy',   prepTime:5,  desc:'Greek yogurt topped with fruits, seeds and a drizzle of honey' },
  { id:2061, name:'Hung Curd Dip',             cat:'curd',        emoji:'🥛', protein:8,  cal:130, carbs:6,  fat:8,  fiber:1, sodium:200, calcium:160, iron:0.4, vitC:4,  servingSize:'100g',        bestMeal:['snacks'],                     difficulty:'easy',   prepTime:5,  desc:'Thick strained curd with herbs and spices — great with veg sticks' },
  { id:2062, name:'Shrikhand',                 cat:'curd',        emoji:'🥛', protein:10, cal:220, carbs:28, fat:6,  fiber:1, sodium:80,  calcium:200, iron:0.5, vitC:3,  servingSize:'150g',        bestMeal:['snacks'],                     difficulty:'easy',   prepTime:10, desc:'Sweet strained yogurt flavoured with saffron and cardamom' },
  { id:2063, name:'Protein Lassi',             cat:'curd',        emoji:'🥛', protein:10, cal:200, carbs:22, fat:5,  fiber:1, sodium:80,  calcium:220, iron:0.4, vitC:5,  servingSize:'300ml',       bestMeal:['breakfast','snacks'],         difficulty:'easy',   prepTime:5,  desc:'Blended curd with banana or mango — high-protein desi smoothie' },
  { id:2064, name:'Curd Rice',                 cat:'curd',        emoji:'🥛', protein:8,  cal:250, carbs:40, fat:5,  fiber:2, sodium:280, calcium:160, iron:0.8, vitC:4,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'easy',   prepTime:15, desc:'Cooked rice mixed with curd and tempered with mustard and curry leaves' },
  { id:2065, name:'Dahi Raita',                cat:'curd',        emoji:'🥛', protein:6,  cal:120, carbs:10, fat:4,  fiber:1, sodium:200, calcium:160, iron:0.4, vitC:4,  servingSize:'150g',        bestMeal:['snacks','lunch'],             difficulty:'easy',   prepTime:5,  desc:'Cooling curd with cucumber, tomato and roasted cumin' },
  { id:2066, name:'Paneer from Milk Pudding',  cat:'curd',        emoji:'🥛', protein:14, cal:240, carbs:14, fat:14, fiber:0, sodium:60,  calcium:280, iron:0.4, vitC:2,  servingSize:'150g',        bestMeal:['snacks','breakfast'],         difficulty:'easy',   prepTime:10, desc:'Fresh homemade paneer with a pinch of saffron and cardamom' },

  // ── OATS & QUINOA ─────────────────────────────────────────── (10)
  { id:2067, name:'Quinoa Pulao',              cat:'oats',        emoji:'🌾', protein:12, cal:320, carbs:50, fat:7,  fiber:4, sodium:380, calcium:50,  iron:2.5, vitC:8,  servingSize:'1.5 cups',    bestMeal:['lunch','dinner'],             difficulty:'easy',   prepTime:25, desc:'Protein-rich quinoa cooked with vegetables and spices' },
  { id:2068, name:'Quinoa Salad',              cat:'oats',        emoji:'🌾', protein:11, cal:280, carbs:42, fat:8,  fiber:5, sodium:280, calcium:55,  iron:2.8, vitC:15, servingSize:'1 bowl',      bestMeal:['lunch','snacks'],             difficulty:'easy',   prepTime:20, desc:'Cold quinoa with roasted veggies, chickpeas and tahini dressing' },
  { id:2069, name:'Oats Dosa',                 cat:'oats',        emoji:'🌾', protein:10, cal:200, carbs:30, fat:5,  fiber:5, sodium:300, calcium:50,  iron:2.0, vitC:4,  servingSize:'2 dosas',     bestMeal:['breakfast'],                  difficulty:'medium', prepTime:20, desc:'Crispy dosa made with oats and urad dal — high in fiber' },
  { id:2070, name:'Oats Khichdi',              cat:'oats',        emoji:'🌾', protein:10, cal:250, carbs:38, fat:4,  fiber:5, sodium:340, calcium:50,  iron:2.2, vitC:5,  servingSize:'1 bowl',      bestMeal:['breakfast','lunch'],          difficulty:'easy',   prepTime:15, desc:'Savory oats cooked with moong dal and vegetables — quick and filling' },
  { id:2071, name:'Oats Idli',                 cat:'oats',        emoji:'🌾', protein:8,  cal:180, carbs:28, fat:4,  fiber:4, sodium:280, calcium:45,  iron:1.8, vitC:3,  servingSize:'4 idlis',     bestMeal:['breakfast'],                  difficulty:'medium', prepTime:25, desc:'Soft idlis made with oats and curd — no fermentation needed' },
  { id:2072, name:'Overnight Oats',            cat:'oats',        emoji:'🌾', protein:10, cal:300, carbs:46, fat:6,  fiber:6, sodium:80,  calcium:180, iron:2.0, vitC:5,  servingSize:'1 jar',       bestMeal:['breakfast'],                  difficulty:'easy',   prepTime:5,  desc:'Rolled oats soaked in milk with chia seeds, banana and nuts' },
  { id:2073, name:'Quinoa Khichdi',            cat:'oats',        emoji:'🌾', protein:12, cal:300, carbs:48, fat:5,  fiber:6, sodium:360, calcium:55,  iron:2.8, vitC:6,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'easy',   prepTime:25, desc:'Quinoa and moong dal cooked together with turmeric and ghee' },
  { id:2074, name:'Oats Uttapam',              cat:'oats',        emoji:'🌾', protein:9,  cal:220, carbs:32, fat:5,  fiber:5, sodium:300, calcium:50,  iron:2.0, vitC:6,  servingSize:'2 uttapams',  bestMeal:['breakfast'],                  difficulty:'medium', prepTime:20, desc:'Thick oats pancakes topped with tomato, onion and coriander' },
  { id:2075, name:'Quinoa Upma',               cat:'oats',        emoji:'🌾', protein:11, cal:280, carbs:44, fat:6,  fiber:4, sodium:340, calcium:50,  iron:2.5, vitC:8,  servingSize:'1 bowl',      bestMeal:['breakfast','lunch'],          difficulty:'easy',   prepTime:20, desc:'Quinoa cooked like upma with mustard, curry leaves and vegetables' },
  { id:2076, name:'Oats Chilla',               cat:'oats',        emoji:'🌾', protein:10, cal:200, carbs:28, fat:5,  fiber:5, sodium:300, calcium:50,  iron:2.0, vitC:5,  servingSize:'3 chillas',   bestMeal:['breakfast','snacks'],         difficulty:'easy',   prepTime:15, desc:'Savory oat flour pancakes with veggies — quick weekday breakfast' },

  // ── GREENS ────────────────────────────────────────────────── (8)
  { id:2077, name:'Palak Soup',                cat:'greens',      emoji:'🥬', protein:6,  cal:120, carbs:10, fat:4,  fiber:4, sodium:320, calcium:120, iron:3.5, vitC:28, servingSize:'1 bowl',      bestMeal:['snacks','lunch'],             difficulty:'easy',   prepTime:15, desc:'Velvety spinach soup with garlic, nutmeg and a swirl of cream' },
  { id:2078, name:'Broccoli Stir Fry',         cat:'greens',      emoji:'🥬', protein:8,  cal:160, carbs:14, fat:6,  fiber:5, sodium:300, calcium:80,  iron:2.0, vitC:90, servingSize:'1 bowl',      bestMeal:['dinner','lunch'],             difficulty:'easy',   prepTime:15, desc:'Quick stir-fried broccoli with garlic, ginger and soy-free sauce' },
  { id:2079, name:'Methi Thepla',              cat:'greens',      emoji:'🥬', protein:8,  cal:260, carbs:38, fat:7,  fiber:5, sodium:360, calcium:100, iron:3.0, vitC:12, servingSize:'3 theplas',   bestMeal:['breakfast','lunch'],          difficulty:'medium', prepTime:25, desc:'Thin Gujarati flatbread with fenugreek leaves and spices' },
  { id:2080, name:'Spinach Smoothie Bowl',     cat:'greens',      emoji:'🥬', protein:10, cal:220, carbs:30, fat:5,  fiber:4, sodium:80,  calcium:200, iron:3.0, vitC:30, servingSize:'1 bowl',      bestMeal:['breakfast'],                  difficulty:'easy',   prepTime:10, desc:'Blended spinach with banana, yogurt and protein-rich toppings' },
  { id:2081, name:'Green Moong Dal',           cat:'greens',      emoji:'🥬', protein:12, cal:200, carbs:28, fat:3,  fiber:7, sodium:360, calcium:55,  iron:3.0, vitC:8,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'easy',   prepTime:20, desc:'Whole green moong cooked with ginger, turmeric and lemon' },
  { id:2082, name:'Methi Paratha',             cat:'greens',      emoji:'🥬', protein:8,  cal:280, carbs:42, fat:7,  fiber:5, sodium:340, calcium:100, iron:2.8, vitC:10, servingSize:'2 parathas',  bestMeal:['breakfast','lunch'],          difficulty:'medium', prepTime:20, desc:'Fenugreek-infused flatbread — naturally iron-rich and aromatic' },
  { id:2083, name:'Broccoli Paneer Stir Fry',  cat:'greens',      emoji:'🥬', protein:15, cal:240, carbs:10, fat:16, fiber:4, sodium:400, calcium:240, iron:2.5, vitC:85, servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'easy',   prepTime:20, desc:'High-protein stir fry with broccoli, paneer and garlic sauce' },

  // ── NUTS ──────────────────────────────────────────────────── (5)
  { id:2085, name:'Peanut Butter Toast',       cat:'nuts',        emoji:'🥜', protein:8,  cal:280, carbs:26, fat:14, fiber:4, sodium:220, calcium:30,  iron:1.5, vitC:2,  servingSize:'2 slices',    bestMeal:['breakfast'],                  difficulty:'easy',   prepTime:5,  desc:'Whole-grain toast with natural peanut butter and banana slices' },
  { id:2086, name:'Almond Milk Smoothie',      cat:'nuts',        emoji:'🥜', protein:6,  cal:220, carbs:28, fat:8,  fiber:3, sodium:80,  calcium:200, iron:1.0, vitC:8,  servingSize:'300ml',       bestMeal:['breakfast','snacks'],         difficulty:'easy',   prepTime:5,  desc:'Blended almond milk with dates, banana and a pinch of cardamom' },
  { id:2087, name:'Peanut Chutney Dosa',       cat:'nuts',        emoji:'🥜', protein:10, cal:320, carbs:46, fat:10, fiber:4, sodium:380, calcium:50,  iron:1.8, vitC:4,  servingSize:'2 dosas',     bestMeal:['breakfast','lunch'],          difficulty:'medium', prepTime:20, desc:'Crispy rice dosa served with protein-rich peanut chutney' },
  { id:2088, name:'Mixed Nut Ladoo',           cat:'nuts',        emoji:'🥜', protein:7,  cal:260, carbs:20, fat:16, fiber:3, sodium:20,  calcium:60,  iron:2.0, vitC:2,  servingSize:'3 pieces',    bestMeal:['snacks'],                     difficulty:'medium', prepTime:20, desc:'Energy-dense nut balls with dates, seeds and no refined sugar' },
  { id:2089, name:'Sesame Peanut Chikki',      cat:'nuts',        emoji:'🥜', protein:8,  cal:200, carbs:18, fat:12, fiber:2, sodium:30,  calcium:80,  iron:2.5, vitC:1,  servingSize:'2 pieces',    bestMeal:['snacks'],                     difficulty:'medium', prepTime:20, desc:'Crunchy jaggery-bound sesame and peanut brittle — iron-rich snack' },

  // ── RICE ──────────────────────────────────────────────────── (7)
  { id:2090, name:'Protein Pulao',             cat:'rice',        emoji:'🍚', protein:12, cal:380, carbs:58, fat:7,  fiber:4, sodium:440, calcium:60,  iron:2.5, vitC:5,  servingSize:'1.5 cups',    bestMeal:['lunch','dinner'],             difficulty:'medium', prepTime:30, desc:'Vegetable pulao with added chickpeas and mixed seeds for protein' },
  { id:2091, name:'Lemon Rice with Peanuts',   cat:'rice',        emoji:'🍚', protein:8,  cal:320, carbs:54, fat:8,  fiber:3, sodium:360, calcium:40,  iron:1.5, vitC:10, servingSize:'1.5 cups',    bestMeal:['lunch','dinner'],             difficulty:'easy',   prepTime:15, desc:'South Indian tempered rice with lemon juice and crunchy peanuts' },
  { id:2092, name:'Bisi Bele Bath',            cat:'rice',        emoji:'🍚', protein:12, cal:380, carbs:62, fat:8,  fiber:8, sodium:480, calcium:70,  iron:3.5, vitC:8,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'hard',   prepTime:45, desc:'Karnataka one-pot rice, dal and vegetable dish with bisi bele spice mix' },
  { id:2093, name:'Vegetable Khichdi',         cat:'rice',        emoji:'🍚', protein:10, cal:300, carbs:50, fat:5,  fiber:7, sodium:380, calcium:55,  iron:2.8, vitC:8,  servingSize:'1 bowl',      bestMeal:['breakfast','lunch','dinner'], difficulty:'easy',   prepTime:20, desc:'Comforting rice and moong dal with vegetables and ghee' },
  { id:2094, name:'Tamarind Rice',             cat:'rice',        emoji:'🍚', protein:8,  cal:320, carbs:56, fat:8,  fiber:3, sodium:400, calcium:45,  iron:2.0, vitC:4,  servingSize:'1.5 cups',    bestMeal:['lunch','dinner'],             difficulty:'medium', prepTime:20, desc:'Andhra-style puliyodarai — tangy tamarind rice with peanuts' },
  { id:2095, name:'Brown Rice Dal Bowl',       cat:'rice',        emoji:'🍚', protein:12, cal:340, carbs:56, fat:5,  fiber:8, sodium:380, calcium:60,  iron:3.0, vitC:5,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'easy',   prepTime:25, desc:'Protein-optimised bowl with brown rice, dal, curd and salad' },
  { id:2096, name:'Curd Rice (Thayir Sadam)', cat:'rice',        emoji:'🍚', protein:8,  cal:250, carbs:40, fat:5,  fiber:2, sodium:280, calcium:160, iron:0.8, vitC:4,  servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'easy',   prepTime:15, desc:'Soothing South Indian curd rice with mustard and curry leaf tempering' },

  // ── SOUTH INDIAN ──────────────────────────────────────────── (10)
  { id:2097, name:'Pesarattu',                 cat:'southindian', emoji:'🫓', protein:12, cal:220, carbs:32, fat:4,  fiber:6, sodium:280, calcium:50,  iron:3.0, vitC:5,  servingSize:'2 dosas',     bestMeal:['breakfast','lunch'],          difficulty:'medium', prepTime:20, desc:'Andhra green moong dosa — high protein, no rice, naturally gluten-friendly' },
  { id:2098, name:'Idli Sambhar',              cat:'southindian', emoji:'🫓', protein:10, cal:280, carbs:50, fat:4,  fiber:5, sodium:420, calcium:55,  iron:2.5, vitC:8,  servingSize:'4 idlis',     bestMeal:['breakfast','lunch'],          difficulty:'medium', prepTime:30, desc:'Steamed rice-lentil cakes with protein-rich sambhar and chutney' },
  { id:2099, name:'Medu Vada',                 cat:'southindian', emoji:'🫓', protein:8,  cal:240, carbs:30, fat:10, fiber:4, sodium:360, calcium:55,  iron:2.0, vitC:4,  servingSize:'3 vadas',     bestMeal:['breakfast','snacks'],         difficulty:'hard',   prepTime:30, desc:'Crispy urad dal doughnuts — fermented for better digestion' },
  { id:2100, name:'Adai Dosa',                 cat:'southindian', emoji:'🫓', protein:14, cal:250, carbs:36, fat:6,  fiber:6, sodium:320, calcium:60,  iron:3.0, vitC:6,  servingSize:'2 dosas',     bestMeal:['breakfast','lunch'],          difficulty:'medium', prepTime:25, desc:'Multi-lentil thick dosa — higher protein than regular dosa' },
  { id:2101, name:'Rava Idli',                 cat:'southindian', emoji:'🫓', protein:8,  cal:220, carbs:36, fat:5,  fiber:3, sodium:360, calcium:50,  iron:1.5, vitC:4,  servingSize:'4 idlis',     bestMeal:['breakfast'],                  difficulty:'easy',   prepTime:20, desc:'Instant semolina idlis with cashews and coriander — no fermentation' },
  { id:2102, name:'Pongal',                    cat:'southindian', emoji:'🫓', protein:10, cal:320, carbs:54, fat:8,  fiber:4, sodium:340, calcium:50,  iron:2.0, vitC:4,  servingSize:'1 bowl',      bestMeal:['breakfast','lunch'],          difficulty:'easy',   prepTime:20, desc:'Comforting rice and moong dal cooked with ghee, cumin and black pepper' },
  { id:2103, name:'Uttapam',                   cat:'southindian', emoji:'🫓', protein:8,  cal:240, carbs:40, fat:5,  fiber:3, sodium:340, calcium:50,  iron:1.8, vitC:6,  servingSize:'2 uttapams',  bestMeal:['breakfast','lunch'],          difficulty:'medium', prepTime:20, desc:'Thick rice pancakes topped with onion, tomato and green chilli' },
  { id:2104, name:'Rasam',                     cat:'southindian', emoji:'🫓', protein:4,  cal:80,  carbs:10, fat:3,  fiber:2, sodium:400, calcium:30,  iron:1.5, vitC:15, servingSize:'1 bowl',      bestMeal:['lunch','dinner'],             difficulty:'easy',   prepTime:15, desc:'Thin, peppery tamarind broth — digestive and immunity-boosting' },
  { id:2105, name:'Kuzhi Paniyaram',           cat:'southindian', emoji:'🫓', protein:8,  cal:220, carbs:36, fat:5,  fiber:3, sodium:300, calcium:45,  iron:1.8, vitC:3,  servingSize:'6 pieces',    bestMeal:['breakfast','snacks'],         difficulty:'medium', prepTime:20, desc:'Crispy outside, soft inside — fermented rice-lentil dumplings' },
  { id:2106, name:'Kozhukattai',               cat:'southindian', emoji:'🫓', protein:6,  cal:200, carbs:36, fat:4,  fiber:3, sodium:120, calcium:30,  iron:1.2, vitC:2,  servingSize:'4 pieces',    bestMeal:['breakfast','snacks'],         difficulty:'medium', prepTime:25, desc:'Steamed rice flour dumplings stuffed with coconut and jaggery' },

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
