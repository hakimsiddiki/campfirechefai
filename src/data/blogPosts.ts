export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readMinutes: number;
  heroEmoji: string;
  // Lightweight markdown-ish content rendered as paragraphs / lists.
  body: Array<
    | { type: "p"; text: string }
    | { type: "h2"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "ol"; items: string[] }
  >;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "easy-camping-meals",
    title: "15 Easy Camping Meals You Can Cook in Under 20 Minutes",
    description:
      "Simple, no-stress camping meals for tents, RVs and backpacking trips. Minimal gear, short prep, and grocery-list friendly.",
    date: "2025-11-01",
    readMinutes: 6,
    heroEmoji: "🔥",
    body: [
      {
        type: "p",
        text: "When you're tired, cold, and hungry at camp, the last thing you want is a complicated recipe. These easy camping meals all come together in under 20 minutes with one pan, one pot, or a single foil packet — and most use ingredients you can buy at any grocery store.",
      },
      { type: "h2", text: "Breakfast" },
      {
        type: "ul",
        items: [
          "One-pan campfire scramble — eggs, pre-cooked sausage, shredded cheese",
          "Peanut butter banana wraps — tortilla, banana, peanut butter, honey",
          "Instant oatmeal upgrade — oats, powdered milk, dried fruit, a spoon of nut butter",
        ],
      },
      { type: "h2", text: "Lunch" },
      {
        type: "ul",
        items: [
          "Tuna avocado wraps — no cooking required",
          "Hummus + pita + sliced cucumber and bell pepper",
          "Quesadillas in a skillet — cheese, beans, salsa",
        ],
      },
      { type: "h2", text: "Dinner" },
      {
        type: "ul",
        items: [
          "Foil packet fajitas — chicken, peppers, onions, taco seasoning",
          "One-pot pasta — penne, jarred marinara, pre-cooked sausage",
          "Campfire chili — canned beans, ground beef, chili seasoning",
          "Sheet-pan sausage and potatoes (works on a grill grate)",
          "Loaded couscous — boil water, stir, eat in 5 minutes",
        ],
      },
      { type: "h2", text: "How to plan a full menu in 30 seconds" },
      {
        type: "p",
        text: "Instead of picking each meal manually, drop your trip length, group size, and gear into Campfire Chef AI and get a printable plan with a grocery list grouped by aisle. It's free to try and the PDF is download-ready.",
      },
    ],
  },
  {
    slug: "camping-food-ideas-no-refrigeration",
    title: "30 Camping Food Ideas That Don't Need Refrigeration",
    description:
      "Shelf-stable camping food ideas for tents, RVs and backpacking. No cooler required — perfect for hot weather and long trips.",
    date: "2025-11-04",
    readMinutes: 7,
    heroEmoji: "🥫",
    body: [
      {
        type: "p",
        text: "A cooler is heavy, leaks, and runs out of ice on day two. These 30 camping food ideas need zero refrigeration, travel well, and still make actual meals — not just snacks.",
      },
      { type: "h2", text: "Pantry staples to pack" },
      {
        type: "ul",
        items: [
          "Tortillas (last longer than bread)",
          "Peanut butter, almond butter, Nutella single-serves",
          "Hard cheeses like parmesan and aged cheddar (safe unrefrigerated for 1–2 days)",
          "Cured meats — salami, pepperoni, jerky",
          "Instant rice, couscous, ramen, instant mashed potatoes",
          "Canned tuna, chicken, beans, chili",
          "Dried fruit, nuts, trail mix",
          "Powdered milk, powdered eggs",
          "Olive oil in a small leak-proof bottle",
          "Hard-shell taco kits",
        ],
      },
      { type: "h2", text: "Full no-fridge meal ideas" },
      {
        type: "ol",
        items: [
          "Tuna wraps with mayo packets",
          "Bean and cheese burritos (use shelf-stable cheese)",
          "Salami and crackers with mustard packets",
          "Couscous with olive oil, sun-dried tomato, and feta in oil",
          "Instant rice with canned chicken curry pouch",
          "Ramen upgraded with peanut butter and sriracha",
          "Oatmeal with peanut butter and honey",
          "Powdered hummus + pita + olives",
        ],
      },
      { type: "h2", text: "Smarter than a packing list" },
      {
        type: "p",
        text: "Tell Campfire Chef AI you don't have a fridge and it builds the entire plan around shelf-stable ingredients automatically — including a grocery list with brands and pack sizes.",
      },
    ],
  },
  {
    slug: "camping-meal-planner-guide",
    title: "How to Plan Camping Meals: A Step-by-Step Guide for First-Time Campers",
    description:
      "A complete camping meal planner walkthrough — how many meals to bring, how to pack a cooler, and how AI can do the planning for you.",
    date: "2025-11-07",
    readMinutes: 8,
    heroEmoji: "🏕️",
    body: [
      {
        type: "p",
        text: "Most first-time campers overpack, underplan, and end up eating granola bars for three days. Here's the simple system experienced campers actually use to plan their meals — adapted for tent campers, RVers, and backpackers.",
      },
      { type: "h2", text: "Step 1: Count the meals, not the days" },
      {
        type: "p",
        text: "A 2-night trip is 2 dinners, 2 breakfasts, 1 lunch (you'll usually eat lunch out on day 1 and day 3). Multiply by your group size. Most people forget the math and pack double.",
      },
      { type: "h2", text: "Step 2: Match meals to your gear" },
      {
        type: "ul",
        items: [
          "Backpacking stove only: dehydrated meals, instant rice, ramen",
          "Two-burner camp stove: one-pot pasta, fajitas, breakfast scrambles",
          "Campfire + grate: foil packets, sausages, grilled veg",
          "RV with kitchen: anything you'd make at home, scaled down",
        ],
      },
      { type: "h2", text: "Step 3: Plan around what spoils first" },
      {
        type: "p",
        text: "Eat fresh meat day 1, fresh produce day 1–2, dairy day 2, and shelf-stable meals day 3+. Pack the cooler in reverse order — last meal at the bottom.",
      },
      { type: "h2", text: "Step 4: Build one master grocery list" },
      {
        type: "p",
        text: "Don't shop per recipe. Combine quantities across meals, group by aisle, and check off as you pack the bins.",
      },
      { type: "h2", text: "Or let the camping meal planner do it" },
      {
        type: "p",
        text: "Campfire Chef AI is a free AI camping meal planner — answer 5 quick questions about your trip, gear, and group, and it generates a full menu, a grouped grocery list, and a printable PDF in under 30 seconds.",
      },
    ],
  },
  {
    slug: "backpacking-meals-lightweight",
    title: "Lightweight Backpacking Meals: 12 High-Calorie Ideas Under 200g",
    description:
      "Ultralight backpacking meals that pack small, weigh under 200g per serving, and deliver 600+ calories. Stove and no-cook options included.",
    date: "2025-11-10",
    readMinutes: 7,
    heroEmoji: "🎒",
    body: [
      { type: "p", text: "On a multi-day hike every gram matters, but so does every calorie. These 12 lightweight backpacking meals all weigh under 200g per serving and deliver at least 600 calories — the sweet spot for thru-hikers and weekend backpackers alike." },
      { type: "h2", text: "Why weight-to-calorie ratio matters" },
      { type: "p", text: "A good backpacking meal targets ~125 calories per ounce (4.4 cal/g). Anything less and you're carrying water weight; anything more is usually pure fat (still good — peanut butter is king)." },
      { type: "h2", text: "Stove meals (boil water only)" },
      { type: "ol", items: [
        "Instant mashed potatoes + olive oil + bacon bits — 700 cal, 160g",
        "Couscous + tuna pouch + olive oil — 650 cal, 180g",
        "Ramen + peanut butter + sriracha — 680 cal, 140g",
        "Instant rice + foil-pack curry + cashews — 720 cal, 195g",
        "Mac & cheese + powdered milk + extra butter — 800 cal, 200g",
      ]},
      { type: "h2", text: "No-cook meals" },
      { type: "ol", items: [
        "Tortilla + peanut butter + honey + granola — 650 cal, 150g",
        "Salami + hard cheese + crackers — 700 cal, 180g",
        "Cold-soak overnight oats + nut butter + dried fruit — 620 cal, 170g",
        "Tuna packet + mayo + tortilla wrap — 600 cal, 160g",
      ]},
      { type: "h2", text: "Snacks that count as meals" },
      { type: "ul", items: [
        "Trail mix bombs — nuts, M&Ms, coconut flakes (160 cal/oz)",
        "Nut butter packets — 190 cal each, weigh nothing",
        "Olive oil shots — purest calorie/gram on earth",
      ]},
      { type: "h2", text: "Plan your whole trip in 30 seconds" },
      { type: "p", text: "Tell Campfire Chef AI you're backpacking and it filters every recipe by weight and calorie density automatically — then exports a grocery list and a printable trail menu PDF." },
    ],
  },
  {
    slug: "rv-meal-planning-week",
    title: "RV Meal Planning: A 7-Day Menu That Actually Fits Your Tiny Kitchen",
    description:
      "A full week of RV meals built around a 2-burner stove, mini fridge, and one skillet. Grocery list, prep tips, and storage hacks included.",
    date: "2025-11-13",
    readMinutes: 8,
    heroEmoji: "🚐",
    body: [
      { type: "p", text: "RV kitchens are tiny: two burners, a microwave if you're lucky, a fridge the size of a carry-on. This 7-day RV meal plan was built specifically for that constraint — every meal uses one pan, fits the fridge, and leaves room for actual living." },
      { type: "h2", text: "The week at a glance" },
      { type: "ul", items: [
        "Mon — Sheet-pan chicken fajitas",
        "Tue — One-pot creamy pasta with sausage",
        "Wed — Taco bowls with leftover chicken",
        "Thu — Skillet shrimp & rice",
        "Fri — Foil-pack burgers & potatoes",
        "Sat — Pancakes-for-dinner + bacon",
        "Sun — Cold-cut wraps + chips (travel day)",
      ]},
      { type: "h2", text: "Mini-fridge packing order" },
      { type: "p", text: "Pack the meals you'll eat last at the bottom. Fresh chicken goes on day 1 or freeze it for day 3. Eggs last 3 weeks unrefrigerated if unwashed — store them out of the fridge to save space." },
      { type: "h2", text: "One grocery list for the whole week" },
      { type: "p", text: "Grouped by aisle so you shop once: proteins, produce, dairy, dry, sauces. Skip multi-trip waste and impulse buys." },
      { type: "h2", text: "Let AI plan it for your rig" },
      { type: "p", text: "Campfire Chef AI asks about your RV setup — fridge size, burner count, oven yes/no — and adapts the whole menu. Free to try, PDF-ready." },
    ],
  },
  {
    slug: "one-pot-camping-meals",
    title: "20 One-Pot Camping Meals With Almost No Cleanup",
    description:
      "One-pot camping recipes that mean one pot to scrub. Hearty, fast, and built for campsites where dishwater is a luxury.",
    date: "2025-11-16",
    readMinutes: 6,
    heroEmoji: "🍲",
    body: [
      { type: "p", text: "Doing dishes at a campsite is the worst part of cooking outdoors — cold water, no sink, soap residue everywhere. These 20 one-pot camping meals leave you with exactly one pot to clean." },
      { type: "h2", text: "Pasta & grains" },
      { type: "ol", items: [
        "One-pot mac & cheese with bacon",
        "Cajun sausage pasta",
        "Lemon-garlic shrimp orzo",
        "Cheesy taco pasta",
        "Pesto pasta with peas",
      ]},
      { type: "h2", text: "Rice bowls" },
      { type: "ol", items: [
        "Chicken fried rice",
        "Sausage jambalaya",
        "Black bean burrito bowl",
        "Teriyaki chicken & rice",
      ]},
      { type: "h2", text: "Soups & chilis" },
      { type: "ol", items: [
        "Campfire chili",
        "Loaded potato soup",
        "White chicken chili",
        "Tortellini soup",
      ]},
      { type: "h2", text: "Breakfast skillets" },
      { type: "ol", items: [
        "Hash brown & egg scramble",
        "Breakfast burrito filling",
        "French toast bake",
      ]},
      { type: "h2", text: "Pick your pot in the planner" },
      { type: "p", text: "Filter Campfire Chef AI to 'one-pot only' and every meal in your trip plan respects that — automatic." },
    ],
  },
  {
    slug: "cheap-camping-food-budget",
    title: "Cheap Camping Food: Feed 4 People for Under $50 a Weekend",
    description:
      "Budget camping meal plan for a family of four under $50 for the weekend. Real grocery list, real prices, real recipes.",
    date: "2025-11-19",
    readMinutes: 7,
    heroEmoji: "💰",
    body: [
      { type: "p", text: "Camping is supposed to be the cheap vacation — but groceries can blow the budget faster than the campsite fee. Here's a tested cheap camping food plan that feeds 4 people 6 meals for under $50." },
      { type: "h2", text: "The menu" },
      { type: "ul", items: [
        "Fri dinner — Hot dogs, beans, chips (~$8)",
        "Sat breakfast — Pancakes & sausage (~$6)",
        "Sat lunch — PB&J + apples + chips (~$5)",
        "Sat dinner — Foil-pack chicken fajitas (~$14)",
        "Sun breakfast — Scrambled eggs & toast (~$5)",
        "Sun lunch — Quesadillas (~$6)",
      ]},
      { type: "h2", text: "Where the savings come from" },
      { type: "ul", items: [
        "Buy meat on sale and freeze it (acts as ice in the cooler)",
        "Bulk eggs, tortillas, and pancake mix — cheapest cal/dollar",
        "Pre-mix dry ingredients at home to skip travel-size markup",
        "Skip pre-cut produce, single-serve anything, and pre-cooked meat",
      ]},
      { type: "h2", text: "Budget-aware AI planning" },
      { type: "p", text: "Set a budget in Campfire Chef AI and the planner picks recipes that stay under it — then generates a grocery list with estimated prices." },
    ],
  },
  {
    slug: "best-camping-breakfast-ideas",
    title: "17 Best Camping Breakfast Ideas (Hot, Cold, and Make-Ahead)",
    description:
      "The best camping breakfast ideas for cold mornings: hot skillets, make-ahead burritos, no-cook options, and coffee tips.",
    date: "2025-11-22",
    readMinutes: 6,
    heroEmoji: "🍳",
    body: [
      { type: "p", text: "A good camping breakfast saves the whole day. These 17 ideas cover hot stove-top meals, make-ahead options you prep before leaving home, and zero-cook breakfasts for travel mornings." },
      { type: "h2", text: "Hot breakfasts" },
      { type: "ul", items: [
        "Campfire breakfast burritos",
        "Bacon, egg & cheese English muffins",
        "Cast-iron biscuits & gravy",
        "Sheet-pan hash with peppers",
        "Dutch baby pancakes over the fire",
      ]},
      { type: "h2", text: "Make-ahead breakfasts" },
      { type: "ul", items: [
        "Freezer breakfast burritos (reheat in foil)",
        "Overnight oats in mason jars",
        "Pre-mixed pancake batter in a squeeze bottle",
        "Hard-boiled eggs (last 1 week in cooler)",
        "Egg muffins baked at home",
      ]},
      { type: "h2", text: "No-cook breakfasts" },
      { type: "ul", items: [
        "Granola + powdered milk + cold water",
        "Bagels with cream cheese & smoked salmon",
        "Yogurt cups + granola + berries",
        "Peanut butter banana wraps",
      ]},
      { type: "h2", text: "Camp coffee that doesn't suck" },
      { type: "ul", items: [
        "AeroPress Go — best brew per gram",
        "Pour-over with a collapsible cone",
        "Cowboy coffee (just grounds + boiling water, let settle)",
      ]},
      { type: "h2", text: "Build your trip menu free" },
      { type: "p", text: "Campfire Chef AI plans every breakfast around your gear and group — try it free and download the printable plan." },
    ],
  },
];

export const getPostBySlug = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);