import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window { paypal?: any }
}

const PAYPAL_CLIENT_ID =
  "ARoxtzRFI9Eh5AMbtnmrG-PoN8duJYTgWBocC953md3xxPB_bGQYIOmSg3fE-I37l1VCtYLuH9HJpJXc";

type PlanCard = {
  id: "free" | "pro" | "crew";
  name: string;
  tagline: string;
  monthlyKey?: string;
  yearlyKey?: string;
  monthly: string;
  yearly: string;
  monthlyNum?: number;
  yearlyNum?: number;
  perks: string[];
  featured?: boolean;
};

const PLANS: PlanCard[] = [
  {
    id: "free", name: "Basecamp", tagline: "Try the magic — free forever",
    monthly: "$0", yearly: "$0",
    perks: [
      "3 AI meal plans / month",
      "5 recipe ideas / month",
      "Basic PDF download",
      "1 saved trip",
    ],
  },
  {
    id: "pro", name: "Trailblazer", tagline: "For the regular outdoor cook",
    monthlyKey: "pro_monthly", yearlyKey: "pro_yearly",
    monthly: "$6.99", yearly: "$49",
    monthlyNum: 6.99, yearlyNum: 49,
    featured: true,
    perks: [
      "Unlimited meal plans & recipes",
      "Unlimited PDF downloads (clean, no footer)",
      "Save unlimited trips & favorites",
      "Grocery list export + shareable link",
      "All 3 audience modes unlocked",
      "Priority AI (faster responses)",
    ],
  },
  {
    id: "crew", name: "Crew", tagline: "Family & group trips",
    monthlyKey: "crew_monthly", yearlyKey: "crew_yearly",
    monthly: "$12.99", yearly: "$89",
    monthlyNum: 12.99, yearlyNum: 89,
    perks: [
      "Everything in Trailblazer",
      "Up to 5 member accounts",
      "Shared trip planning",
      "Group meal voting / dietary mixing",
      "Trip cost-splitting calculator",
    ],
  },
];

function usePaypalSdk() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.paypal) { setReady(true); return; }
    const s = document.createElement("script");
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
    s.onload = () => setReady(true);
    s.onerror = () => toast.error("Could not load PayPal");
    document.body.appendChild(s);
  }, []);
  return ready;
}

function PayPalCheckout({
  planKey, onSuccess,
}: { planKey: string; onSuccess: () => void }) {
  const ready = usePaypalSdk();
  const containerId = `paypal-${planKey}`;

  useEffect(() => {
    if (!ready || !window.paypal) return;
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = "";
    window.paypal.Buttons({
      style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },
      createOrder: async () => {
        const { data, error } = await supabase.functions.invoke("paypal-create-order", { body: { planKey } });
        if (error || !data?.id) { toast.error("Failed to create order"); throw new Error("createOrder failed"); }
        return data.id;
      },
      onApprove: async (data: any) => {
        const { error } = await supabase.functions.invoke("paypal-capture-order", { body: { orderId: data.orderID } });
        if (error) { toast.error("Payment capture failed"); return; }
        toast.success("You're upgraded! 🎉");
        onSuccess();
      },
      onError: (err: any) => { console.error(err); toast.error("PayPal error"); },
    }).render(`#${containerId}`);
  }, [ready, planKey, containerId, onSuccess]);

  return (
    <div className="mt-4">
      {!ready && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />Loading PayPal…</div>}
      <div id={containerId} />
    </div>
  );
}

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const { user, subscription, refreshSubscription } = useAuth();
  const navigate = useNavigate();

  const onUpgrade = () => { refreshSubscription(); navigate("/planner"); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Pricing — Campfire Chef AI</title>
        <meta name="description" content="Simple pricing for Campfire Chef AI. Free, Pro, and Crew plans for camping, RV, and backpacking meal planning." />
      </Helmet>

      <header className="container mx-auto px-4 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Campfire Chef AI" width={32} height={32} className="w-8 h-8 rounded-full" />
          <span className="font-extrabold">Campfire Chef AI</span>
        </Link>
        <Button variant="ghost" size="sm" asChild><Link to="/planner"><ArrowLeft className="w-4 h-4" />Planner</Link></Button>
      </header>

      <section className="container mx-auto px-4 pt-8 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Pick your trail</h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Start free. Upgrade when you want unlimited plans, saved trips, and clean printable PDFs.
        </p>

        <div className="mt-6 inline-flex items-center gap-3 bg-muted rounded-full px-4 py-2">
          <span className={!annual ? "font-semibold" : "text-muted-foreground"}>Monthly</span>
          <Switch checked={annual} onCheckedChange={setAnnual} />
          <span className={annual ? "font-semibold" : "text-muted-foreground"}>Annual <Badge variant="secondary" className="ml-1">Save ~40%</Badge></span>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10 text-left">
          {PLANS.map((p) => {
            const isCurrent = subscription?.plan === p.id && subscription?.status === "active";
            const planKey = annual ? p.yearlyKey : p.monthlyKey;
            return (
              <Card key={p.id} className={p.featured ? "border-primary shadow-lg relative" : ""}>
                {p.featured && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most popular</Badge>}
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {p.name}
                    {isCurrent && <Badge variant="secondary">Current</Badge>}
                  </CardTitle>
                  <CardDescription>{p.tagline}</CardDescription>
                  <div className="pt-3">
                    {annual && p.monthlyNum && p.yearlyNum ? (() => {
                      const regular = +(p.monthlyNum * 12).toFixed(2);
                      const pct = Math.round((1 - p.yearlyNum / regular) * 100);
                      return (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground line-through">${regular}</span>
                            <Badge className="bg-accent text-accent-foreground">Save {pct}%</Badge>
                          </div>
                          <div>
                            <span className="text-4xl font-extrabold">{p.yearly}</span>
                            <span className="text-muted-foreground ml-1">/ year</span>
                          </div>
                        </div>
                      );
                    })() : (
                      <>
                        <span className="text-4xl font-extrabold">{annual ? p.yearly : p.monthly}</span>
                        <span className="text-muted-foreground ml-1">/ {annual ? "year" : "month"}</span>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {p.perks.map((perk) => (
                      <li key={perk} className="flex gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />{perk}</li>
                    ))}
                  </ul>

                  {p.id === "free" ? (
                    <Button variant="outline" className="w-full mt-6" asChild>
                      <Link to={user ? "/planner" : "/auth"}>{user ? "Go to Planner" : "Get started"}</Link>
                    </Button>
                  ) : !user ? (
                    <Button className="w-full mt-6" asChild>
                      <Link to={`/auth?redirect=/pricing`}>Sign in to upgrade</Link>
                    </Button>
                  ) : isCurrent ? (
                    <Button variant="outline" className="w-full mt-6" disabled>You're on this plan</Button>
                  ) : planKey ? (
                    <PayPalCheckout planKey={planKey} onSuccess={onUpgrade} />
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 inline-block border border-primary/30 rounded-xl px-6 py-4 bg-card">
          <p className="text-sm uppercase tracking-wider text-muted-foreground">Launch deal</p>
          <p className="text-2xl font-extrabold mt-1">Lifetime Pro — $99 one-time</p>
          <p className="text-sm text-muted-foreground mt-1">First 500 customers. No renewals, ever.</p>
          {user ? (
            <div className="mt-3 max-w-xs mx-auto">
              <PayPalCheckout planKey="pro_lifetime" onSuccess={onUpgrade} />
            </div>
          ) : (
            <Button className="mt-3" asChild><Link to="/auth?redirect=/pricing">Sign in to claim</Link></Button>
          )}
        </div>
      </section>
    </div>
  );
}