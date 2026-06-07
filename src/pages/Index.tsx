import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Flame, Tent, Caravan, Mountain, Users, Sparkles, Clock,
  ShoppingBasket, FileDown, MessageCircle, ArrowRight, Leaf, DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import heroImg from "@/assets/hero-campfire.jpg";

const features = [
  { icon: Sparkles, title: "AI Meal Planner", desc: "Full breakfast/lunch/dinner plans in under 30 seconds." },
  { icon: Leaf, title: "Use What You Have", desc: "Type your ingredients — get instant camp-friendly recipes." },
  { icon: FileDown, title: "Printable Meal Pack", desc: "One-tap PDF with meals, grocery list, prep checklist." },
  { icon: DollarSign, title: "Budget Mode", desc: "“Feed 4 campers under $50” — done." },
  { icon: ShoppingBasket, title: "Smart Grocery Export", desc: "Organized shopping lists grouped by aisle." },
  { icon: MessageCircle, title: "Campfire Assistant", desc: "Ask anything: water-light meals, no-fridge food, fuel tips." },
];

const modes = [
  { icon: Tent, label: "Tent Camping" },
  { icon: Caravan, label: "RV Travel" },
  { icon: Mountain, label: "Backpacking" },
  { icon: Flame, label: "Survival / Minimalist" },
  { icon: Users, label: "Family Camping" },
];

const Index = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    toast.success("You're in! Your free meal plan is on the way.");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Campfire Chef AI — AI Camping & RV Meal Planner</title>
        <meta name="description" content="Plan your entire camping menu in 30 seconds. AI-powered meal plans, grocery lists, and printable PDFs for tents, RVs, and backpacking trips." />
        <link rel="canonical" href="https://campfirechefai.lovable.app/" />
        <meta property="og:title" content="Campfire Chef AI — AI Camping & RV Meal Planner" />
        <meta property="og:description" content="Stress-free outdoor cooking. Perfect meals for campfires, RV trips, and adventure travel." />
        <meta property="og:url" content="https://campfirechefai.lovable.app/" />
      </Helmet>
      {/* Nav */}
      <header className="absolute top-0 inset-x-0 z-20">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground">
            <img src="/logo.png" alt="Campfire Chef AI logo" width={36} height={36} className="w-9 h-9 rounded-full shadow-warm" />
            <span className="font-extrabold tracking-tight text-lg">Campfire Chef AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/pricing">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 font-semibold">
                Pricing
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="sm"
                className="bg-gradient-ember text-accent-foreground font-bold shadow-warm hover:opacity-90 hover:shadow-lg transition-all border border-accent/40"
              >
                <Sparkles className="w-4 h-4" />
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[100svh] flex items-center">
        <img
          src={heroImg}
          alt="Cast iron skillet cooking over a glowing campfire next to a tent in a pine forest"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/60 to-primary/95" />

        <div className="relative container mx-auto px-4 py-28 md:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-primary-foreground uppercase tracking-wider">
                AI Camping Meal Planner
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-primary-foreground leading-[1.05] tracking-tight">
              Plan your entire camping menu in{" "}
              <span className="bg-gradient-ember bg-clip-text text-transparent">30 seconds.</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
              Stress-free outdoor cooking. Perfect meals for campfires, RV trips, and adventure travel —
              tailored to your gear, budget, and group.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link to="/planner" className="sm:flex-shrink-0">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 bg-accent hover:bg-accent/90 text-accent-foreground shadow-warm font-bold text-base"
                >
                  Generate my meal plan
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <Link to="/planner?mode=ingredients" className="sm:flex-shrink-0">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-8 bg-background/10 backdrop-blur border-primary-foreground/30 text-primary-foreground hover:bg-background/20 hover:text-primary-foreground font-semibold text-base"
                >
                  I have ingredients
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-primary-foreground/70">
              Free to try • No signup required • Printable PDF included
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-accent font-semibold uppercase tracking-wider text-sm mb-3">Why campers love it</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Outdoor cooking, finally figured out.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-7 rounded-2xl bg-gradient-card border border-border shadow-soft hover:shadow-warm hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                  <f.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modes */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Built for every kind of trip</h2>
            <p className="mt-3 text-muted-foreground">From a weekend tent to a 6-week RV haul.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {modes.map((m) => (
              <div
                key={m.label}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-card border border-border shadow-soft hover:border-accent/50 transition-all"
              >
                <m.icon className="w-8 h-8 text-primary" />
                <span className="text-sm font-semibold text-center">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { n: "01", t: "Tell us your trip", d: "Days, people, gear, dietary needs, and budget. Takes 20 seconds." },
              { n: "02", t: "AI builds your menu", d: "Smart, fuel-efficient meals matched to your equipment and storage." },
              { n: "03", t: "Pack & go", d: "Download a print-ready PDF with grocery list, prep checklist, and storage tips." },
            ].map((s) => (
              <div key={s.n} className="relative p-8 rounded-2xl bg-gradient-card border border-border shadow-soft">
                <span className="absolute -top-4 left-6 text-5xl font-black text-accent/20">{s.n}</span>
                <Clock className="w-7 h-7 text-accent mb-4" />
                <h3 className="font-bold text-xl mb-2">{s.t}</h3>
                <p className="text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden bg-gradient-hero shadow-warm">
            <div className="p-10 md:p-14 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-4">
                Get a free 3-day campfire meal plan
              </h2>
              <p className="text-primary-foreground/85 mb-8 max-w-xl mx-auto">
                Drop your email and we'll send a printable starter pack — plus weekly seasonal recipes.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <Label htmlFor="email-capture" className="sr-only">Email address</Label>
                <Input
                  id="email-capture"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-background/95 border-0 text-foreground"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 px-7 bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-warm"
                >
                  Send me the plan
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Campfire Chef AI logo" width={28} height={28} loading="lazy" className="w-7 h-7 rounded-full" />
            <span className="font-bold">Campfire Chef AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Campfire Chef AI. Cook wild.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
