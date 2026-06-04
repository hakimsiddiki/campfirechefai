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
      // Pre-validation of user input — reject empty/nonsense submissions before spending a call.
      const cleanedIngredients = String(ingredients || "").trim();
      const letterCount = (cleanedIngredients.match(/[a-zA-Z]/g) || []).length;
      if (cleanedIngredients.length < 3 || letterCount < 3) {
        return new Response(
          JSON.stringify({ error: "Please list at least one real ingredient (e.g. eggs, rice, beans)." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      // Block obviously non-food / unsafe inputs.
      const blockedInput = /(petrol|gasoline|bleach|soap|plastic|battery|poison|raw chicken liver shake|cigarette)/i;
      if (blockedInput.test(cleanedIngredients)) {
        return new Response(
          JSON.stringify({ error: "Some items don't look safe or edible. Please list real food ingredients." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      systemPrompt =
        `You are Campfire Chef — a warm, friendly outdoor cooking buddy.

RULES (must follow strictly):
- Suggest ONLY real, classic, well-known camp meals (eggs & beans tacos, one-pan rice, grilled cheese, foil-pack veggies, skillet pasta, etc.). NO invented or experimental dishes.
- Use ONLY the user's ingredients plus reasonable pantry basics (salt, pepper, oil, water, butter). Never invent ingredients the user didn't list.
- REJECT weird or unappetizing combinations (e.g. fish + chocolate, sweet + savory clashes, raw flour mixes). If the user's ingredients can only support 2 good meals, return 2. Quality over quantity — minimum 2, maximum 5.
- Steps must be PRACTICAL and physically possible on the stated camping gear. No oven, no microwave, no blender unless listed. Realistic times (eggs scramble 2–3 min, rice 15–20 min, etc.).
- Ingredient quantities should be implied through normal cooking sense — don't suggest absurd amounts.
- Write like a real human friend at the campsite — warm, simple, sensory (aroma, crisp, golden, smoky). Never sound like AI.
- BANNED phrases — never use: "add acid", "satisfying meal", "packed start", "flavor profile", "elevate", "delicious meal", "perfect for", "burst of flavor".
- Steps must be short imperative bullets (max ~16 words). Each step includes a realistic time like "(2 min)" at the end.
- Always include common seasonings the user likely has (salt, black pepper, garlic powder, soy sauce, hot sauce, etc.) under \`seasonings\`.
- Always list the cookware needed (skillet, pot, campfire grate, foil, spatula, etc.).
- Add 1–3 recipe badges from this fixed list ONLY: "High Protein", "One Pan", "Budget Meal", "Kid Friendly", "Quick", "No Fridge", "Vegetarian".
- Give realistic estimated calories and protein per serving.
- Add a short, practical storage tip (leftovers, cooler, dry bag).
- imageQuery must be 2–4 plain English words naming the dish (e.g. "scrambled eggs tortilla", "one pot pasta"). No adjectives like "delicious".
Return everything via the provided tool.`;
      userPrompt = `Ingredients & gear I have: ${ingredients}\nCamping mode: ${campingMode}\nGive me up to 5 realistic, classic meal ideas. Reject any combination that wouldn't actually taste good or isn't practical to cook with this gear.`;
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

      // Post-validation: filter out unrealistic recipes (impossible gear, weird combos, absurd times).
      const gearLower = String(equipment || "").toLowerCase();
      const hasOven = /oven|dutch oven|camp oven/.test(gearLower);
      const hasMicrowave = /microwave/.test(gearLower);
      const hasBlender = /blender/.test(gearLower);
      const bannedStepPhrases = [
        "add acid", "satisfying meal", "packed start", "flavor profile",
        "elevate", "delicious meal", "burst of flavor", "sous vide", "deep fry",
      ];
      const weirdCombos: Array<[RegExp, RegExp]> = [
        [/\bfish\b|\btuna\b|\bsalmon\b/i, /\bchocolate\b|\bjam\b|\bnutella\b/i],
        [/\bice cream\b/i, /\bbeans\b|\brice\b|\bfish\b/i],
        [/\braw flour\b/i, /./],
      ];
      const isRealisticIdea = (r: any): boolean => {
        if (!r || !Array.isArray(r.steps) || r.steps.length === 0) return false;
        if (!Array.isArray(r.ingredients) || r.ingredients.length === 0) return false;
        if (typeof r.timeMinutes === "number" && (r.timeMinutes < 2 || r.timeMinutes > 180)) return false;
        const stepsText = r.steps.join(" ").toLowerCase();
        if (!hasOven && /\boven\b|\bbake\b|\bbaking\b/.test(stepsText)) return false;
        if (!hasMicrowave && /\bmicrowave\b/.test(stepsText)) return false;
        if (!hasBlender && /\bblender\b|\bblend until\b/.test(stepsText)) return false;
        if (bannedStepPhrases.some((p) => stepsText.includes(p))) return false;
        const ingText = r.ingredients.join(" ").toLowerCase();
        for (const [a, b] of weirdCombos) {
          if (a.test(ingText) && b.test(ingText)) return false;
        }
        return true;
      };
      if (Array.isArray(ideas?.ideas)) {
        ideas.ideas = ideas.ideas.filter(isRealisticIdea);
        if (ideas.ideas.length === 0) {
          return new Response(
            JSON.stringify({ error: "Couldn't find realistic recipes from those ingredients. Try adding a few more pantry items." }),
            { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      }

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