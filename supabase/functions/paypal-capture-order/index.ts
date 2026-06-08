import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAYPAL_BASE = "https://api-m.paypal.com";

const PLAN_META: Record<string, { plan: string; cycle: string }> = {
  pro_monthly:  { plan: "pro",  cycle: "monthly" },
  pro_yearly:   { plan: "pro",  cycle: "yearly" },
  crew_monthly: { plan: "crew", cycle: "monthly" },
  crew_yearly:  { plan: "crew", cycle: "yearly" },
  pro_lifetime: { plan: "pro",  cycle: "lifetime" },
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
  return (await r.json()).access_token as string;
}

function periodEnd(cycle: string): string | null {
  const d = new Date();
  if (cycle === "monthly") { d.setMonth(d.getMonth() + 1); return d.toISOString(); }
  if (cycle === "yearly")  { d.setFullYear(d.getFullYear() + 1); return d.toISOString(); }
  if (cycle === "lifetime") return null;
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Auth required" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUser = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await supabaseUser.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { orderId } = await req.json();
    if (!orderId) return new Response(JSON.stringify({ error: "orderId required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const token = await getAccessToken();
    const r = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const data = await r.json();
    if (!r.ok || data.status !== "COMPLETED") {
      console.error("Capture failed", data);
      return new Response(JSON.stringify({ error: "Payment capture failed. Please try again." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const customId: string = data.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id
      ?? data.purchase_units?.[0]?.custom_id ?? "";
    const [uidFromOrder, planKey] = customId.split("|");
    if (uidFromOrder !== user.id) {
      return new Response(JSON.stringify({ error: "Order does not belong to user" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const meta = PLAN_META[planKey];
    if (!meta) return new Response(JSON.stringify({ error: "Unknown plan" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { error: upErr } = await admin.from("subscriptions").upsert({
      user_id: user.id,
      plan: meta.plan,
      billing_cycle: meta.cycle,
      status: "active",
      paypal_order_id: orderId,
      current_period_end: periodEnd(meta.cycle),
    }, { onConflict: "user_id" });
    if (upErr) {
      console.error("DB upsert err", upErr);
      return new Response(JSON.stringify({ error: "DB error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ ok: true, plan: meta.plan, cycle: meta.cycle }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});