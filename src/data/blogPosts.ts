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
];

export const getPostBySlug = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);