import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const payload = await req.json();
    const {
      mode = "meal_plan",
      days = 2,
      people = 2,
      mealsPerDay = 3,
      campingMode = "Tent camping",
      equipment = "campfire, cast iron skillet",
      diet = "no restrictions",
      budget = "",
      ingredients = "",
      storage = "cooler",
      minimalDishes = false,
      question = "",
    } = payload ?? {};

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "ingredient_ideas") {
      systemPrompt =
        `You are Campfire Chef — a warm, friendly outdoor cooking buddy.

RULES (must follow strictly):
- Suggest realistic camp meals using ONLY the user's ingredients (plus pantry basics: salt, oil, water, butter if reasonable).
- REJECT weird or unappetizing combinations. If the user's ingredients can't reasonably make 5 good meals, return fewer (minimum 2). Quality over quantity.
- Write like a real human friend at the campsite — warm, simple, sensory (aroma, crisp, golden, smoky). Never sound like AI.
- BANNED phrases — never use: "add acid", "satisfying meal", "packed start", "flavor profile", "elevate", "delicious meal", "perfect for", "burst of flavor".
- Steps must be short imperative bullets (max ~16 words). Each step includes a realistic time like "(2 min)" at the end.
- Always include common seasonings the user likely has (salt, black pepper, garlic powder, soy sauce, hot sauce, etc.) under \`seasonings\`.
- Always list the cookware needed (skillet, pot, campfire grate, foil, spatula, etc.).
- Add 1–3 recipe badges from this fixed list ONLY: "High Protein", "One Pan", "Budget Meal", "Kid Friendly", "Quick", "No Fridge", "Vegetarian".
- Give realistic estimated calories and protein per serving.
- Add a short, practical storage tip (leftovers, cooler, dry bag).
Return everything via the provided tool.`;
      userPrompt = `Ingredients & gear I have: ${ingredients}\nCamping mode: ${campingMode}\nGive me up to 5 quick, doable meal ideas. Reject any that wouldn't actually taste good with these ingredients.`;
    } else if (mode === "chat") {
      systemPrompt =
        "You are Campfire Chef Assistant — a friendly, practical outdoor cooking expert. Give concise, useful answers about camp cooking, food safety, gear, and trip planning. Use short paragraphs and bullet points.";
      userPrompt = question;
    } else {
      systemPrompt = `You are Campfire Chef, an outdoor cooking expert specializing in realistic, low-effort camp meals. Always respond with valid JSON that strictly matches the requested schema. Recipes must be practical for the given equipment and storage situation. Prioritize simple prep, few dishes, and durable ingredients.`;
      userPrompt = `Build a complete camping meal plan.

Trip details:
- Days: ${days}
- People: ${people}
- Meals per day: ${mealsPerDay} (breakfast, lunch, dinner${mealsPerDay > 3 ? ", snacks" : ""})
- Camping mode: ${campingMode}
- Equipment available: ${equipment}
- Storage: ${storage}
- Dietary preferences: ${diet}
- Budget: ${budget || "no strict limit"}
- Minimal dishes mode: ${minimalDishes ? "YES — favor one-pot meals" : "no"}
- Ingredients on hand (optional): ${ingredients || "none specified"}

Return JSON via the provided tool.`;
    }

    const body: any = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    };

    if (mode === "ingredient_ideas") {
      body.tools = [
        {
          type: "function",
          function: {
            name: "return_ideas",
            description: "Return friendly camp meal ideas with short bullet steps.",
            parameters: {
              type: "object",
              properties: {
                intro: { type: "string", description: "One warm friendly sentence to open." },
                ideas: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string", description: "Catchy short recipe name" },
                      emoji: { type: "string", description: "One food emoji" },
                      imageQuery: { type: "string", description: "2-4 word search query describing the dish for a stock food photo, e.g. 'fried egg rice bowl'" },
                      timeMinutes: { type: "number" },
                      difficulty: { type: "string", description: "Easy / Medium / Hard" },
                      tagline: { type: "string", description: "One sensory line — aroma, taste, vibe." },
                      ingredients: { type: "array", items: { type: "string" } },
                      seasonings: { type: "array", items: { type: "string" }, description: "Common seasonings used (e.g. salt, black pepper, garlic powder, soy sauce, hot sauce)." },
                      cookware: { type: "array", items: { type: "string" }, description: "Cookware needed (skillet, pot, campfire grate, foil, etc.)" },
                      badges: { type: "array", items: { type: "string", enum: ["High Protein", "One Pan", "Budget Meal", "Kid Friendly", "Quick", "No Fridge", "Vegetarian"] }, description: "1–3 recipe badges." },
                      calories: { type: "number", description: "Estimated calories per serving." },
                      proteinGrams: { type: "number", description: "Estimated protein grams per serving." },
                      storageTip: { type: "string", description: "Short practical leftover/storage tip." },
                      steps: { type: "array", items: { type: "string" }, description: "3-6 short imperative bullets. Each step MUST end with a time in parentheses, e.g. 'Heat the skillet over medium coals. (2 min)'." },
                      proTip: { type: "string" },
                    },
                    required: ["name", "emoji", "imageQuery", "timeMinutes", "difficulty", "tagline", "ingredients", "seasonings", "cookware", "badges", "calories", "proteinGrams", "storageTip", "steps"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["intro", "ideas"],
              additionalProperties: false,
            },
          },
        },
      ];
      body.tool_choice = { type: "function", function: { name: "return_ideas" } };
    } else if (mode === "meal_plan") {
      body.tools = [
        {
          type: "function",
          function: {
            name: "return_meal_plan",
            description: "Return a structured camping meal plan",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                summary: { type: "string" },
                totalEstimatedCost: { type: "string" },
                fuelTip: { type: "string" },
                days: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      day: { type: "number" },
                      meals: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            type: { type: "string", description: "Breakfast/Lunch/Dinner/Snack" },
                            name: { type: "string" },
                            ingredients: { type: "array", items: { type: "string" } },
                            instructions: { type: "array", items: { type: "string" } },
                            prepMinutes: { type: "number" },
                            cookMinutes: { type: "number" },
                            cleanup: { type: "string", description: "Easy / Medium / Hard" },
                            fuelEfficiency: { type: "string" },
                          },
                          required: ["type", "name", "ingredients", "instructions", "prepMinutes", "cookMinutes", "cleanup"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["day", "meals"],
                    additionalProperties: false,
                  },
                },
                groceryList: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: { type: "string" },
                      items: { type: "array", items: { type: "string" } },
                    },
                    required: ["category", "items"],
                    additionalProperties: false,
                  },
                },
                prepChecklist: { type: "array", items: { type: "string" } },
                storageTips: { type: "array", items: { type: "string" } },
              },
              required: ["title", "summary", "days", "groceryList", "prepChecklist", "storageTips"],
              additionalProperties: false,
            },
          },
        },
      ];
      body.tool_choice = { type: "function", function: { name: "return_meal_plan" } };
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("AI gateway error:", resp.status, text);
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests — please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();

    if (mode === "meal_plan") {
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No structured plan returned");
      const plan = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ plan }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (mode === "ingredient_ideas") {
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No ideas returned");
      const ideas = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ ideas }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const text = data.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("plan-meals error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});