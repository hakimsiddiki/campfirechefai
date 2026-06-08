import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAYPAL_BASE = "https://api-m.paypal.com";

const PLANS: Record<string, { plan: string; cycle: string; amount: string; name: string }> = {
  pro_monthly:  { plan: "pro",  cycle: "monthly",  amount: "6.99",  name: "Campfire Chef Pro — Monthly" },
  pro_yearly:   { plan: "pro",  cycle: "yearly",   amount: "49.00", name: "Campfire Chef Pro — Yearly" },
  crew_monthly: { plan: "crew", cycle: "monthly",  amount: "12.99", name: "Campfire Chef Crew — Monthly" },
  crew_yearly:  { plan: "crew", cycle: "yearly",   amount: "89.00", name: "Campfire Chef Crew — Yearly" },
  pro_lifetime: { plan: "pro",  cycle: "lifetime", amount: "99.00", name: "Campfire Chef Pro — Lifetime" },
};

async function getAccessToken() {
  const id = Deno.env.get("PAYPAL_CLIENT_ID")!;
  const secret = Deno.env.get("PAYPAL_SECRET")!;
  const auth = btoa(`${id}:${secret}`);
  const r = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`PayPal token error: ${JSON.stringify(j)}`);
  return j.access_token as string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Auth required" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { planKey } = await req.json();
    const plan = PLANS[planKey];
    if (!plan) return new Response(JSON.stringify({ error: "Invalid plan" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const token = await getAccessToken();
    const r = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          description: plan.name,
          amount: { currency_code: "USD", value: plan.amount },
          custom_id: `${user.id}|${planKey}`,
        }],
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      console.error("PayPal create order failed", data);
      return new Response(JSON.stringify({ error: "Order creation failed. Please try again." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ id: data.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});