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
        "You are Campfire Chef, an outdoor cooking expert. Suggest 5 realistic camp meal ideas using only the user's available ingredients and equipment. Be concrete and practical.";
      userPrompt = `Ingredients & gear I have: ${ingredients}\nCamping mode: ${campingMode}\nGenerate 5 meal ideas.`;
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

    if (mode === "meal_plan") {
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