import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Flame, ArrowLeft, FileDown, Loader2, Sparkles, ShoppingBasket, ListChecks, Clock, MessageCircle, Send } from "lucide-react";
import jsPDF from "jspdf";

type Meal = {
  type: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepMinutes: number;
  cookMinutes: number;
  cleanup: string;
  fuelEfficiency?: string;
};
type Plan = {
  title: string;
  summary: string;
  totalEstimatedCost?: string;
  fuelTip?: string;
  days: { day: number; meals: Meal[] }[];
  groceryList: { category: string; items: string[] }[];
  prepChecklist: string[];
  storageTips: string[];
};

const Planner = () => {
  const [params] = useSearchParams();
  const defaultTab = params.get("mode") === "ingredients" ? "ingredients" : params.get("mode") === "chat" ? "chat" : "plan";

  // Plan form
  const [days, setDays] = useState(3);
  const [people, setPeople] = useState(2);
  const [campingMode, setCampingMode] = useState("Tent camping");
  const [equipment, setEquipment] = useState("campfire, cast iron skillet, pot");
  const [diet, setDiet] = useState("no restrictions");
  const [budget, setBudget] = useState("");
  const [storage, setStorage] = useState("cooler with ice");
  const [minimalDishes, setMinimalDishes] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);

  // Ingredient ideas
  const [ingredients, setIngredients] = useState("");
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideas, setIdeas] = useState("");

  // Chat
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hey! I'm your Campfire Chef Assistant. Ask me anything — meals with no fridge, hot-weather food, water-light recipes, fuel tips…" },
  ]);

  const handleApiError = (err: any) => {
    const msg = err?.message || "Something went wrong";
    if (msg.includes("429") || msg.toLowerCase().includes("too many")) toast.error("Too many requests — give it a moment.");
    else if (msg.includes("402") || msg.toLowerCase().includes("credit")) toast.error("AI credits exhausted. Add credits in your workspace.");
    else toast.error(msg);
  };

  const generatePlan = async () => {
    setPlanLoading(true);
    setPlan(null);
    try {
      const { data, error } = await supabase.functions.invoke("plan-meals", {
        body: { mode: "meal_plan", days, people, mealsPerDay: 3, campingMode, equipment, diet, budget, storage, minimalDishes },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPlan(data.plan);
      toast.success("Your camp menu is ready!");
    } catch (e) {
      handleApiError(e);
    } finally {
      setPlanLoading(false);
    }
  };

  const generateIdeas = async () => {
    if (!ingredients.trim()) {
      toast.error("Add some ingredients first");
      return;
    }
    setIdeasLoading(true);
    setIdeas("");
    try {
      const { data, error } = await supabase.functions.invoke("plan-meals", {
        body: { mode: "ingredient_ideas", ingredients, campingMode },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setIdeas(data.text);
    } catch (e) {
      handleApiError(e);
    } finally {
      setIdeasLoading(false);
    }
  };

  const sendChat = async () => {
    const question = chatInput.trim();
    if (!question) return;
    setChatInput("");
    setChatMessages((m) => [...m, { role: "user", content: question }]);
    setChatLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("plan-meals", {
        body: { mode: "chat", question },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setChatMessages((m) => [...m, { role: "assistant", content: data.text }]);
    } catch (e) {
      handleApiError(e);
    } finally {
      setChatLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!plan) return;
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 48;
    let y = margin;

    const addText = (text: string, opts: { size?: number; bold?: boolean; gap?: number; color?: [number, number, number] } = {}) => {
      const { size = 11, bold = false, gap = 4, color = [30, 30, 30] } = opts;
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, pageW - margin * 2);
      lines.forEach((ln: string) => {
        if (y > 740) { doc.addPage(); y = margin; }
        doc.text(ln, margin, y);
        y += size + gap;
      });
    };

    addText("Campfire Chef AI", { size: 10, color: [200, 80, 30], bold: true, gap: 2 });
    addText(plan.title, { size: 22, bold: true, gap: 8 });
    addText(plan.summary, { size: 11, gap: 10, color: [80, 80, 80] });
    if (plan.totalEstimatedCost) addText(`Estimated cost: ${plan.totalEstimatedCost}`, { size: 11, bold: true, gap: 4 });
    if (plan.fuelTip) addText(`Fuel tip: ${plan.fuelTip}`, { size: 11, gap: 10, color: [80, 80, 80] });

    plan.days.forEach((d) => {
      y += 6;
      addText(`Day ${d.day}`, { size: 16, bold: true, gap: 6, color: [30, 80, 50] });
      d.meals.forEach((m) => {
        addText(`${m.type}: ${m.name}`, { size: 13, bold: true, gap: 4 });
        addText(`Prep ${m.prepMinutes}m · Cook ${m.cookMinutes}m · Cleanup: ${m.cleanup}`, { size: 10, color: [110, 110, 110], gap: 4 });
        addText("Ingredients: " + m.ingredients.join(", "), { size: 10, gap: 4 });
        m.instructions.forEach((step, i) => addText(`${i + 1}. ${step}`, { size: 10, gap: 3 }));
        y += 4;
      });
    });

    doc.addPage(); y = margin;
    addText("Grocery List", { size: 20, bold: true, gap: 8, color: [30, 80, 50] });
    plan.groceryList.forEach((g) => {
      addText(g.category, { size: 13, bold: true, gap: 4 });
      g.items.forEach((it) => addText("• " + it, { size: 11, gap: 3 }));
      y += 4;
    });

    y += 8;
    addText("Prep Checklist", { size: 16, bold: true, gap: 6, color: [200, 80, 30] });
    plan.prepChecklist.forEach((p) => addText("☐ " + p, { size: 11, gap: 3 }));

    y += 8;
    addText("Storage Tips", { size: 16, bold: true, gap: 6, color: [200, 80, 30] });
    plan.storageTips.forEach((p) => addText("• " + p, { size: 11, gap: 3 }));

    doc.save(`${plan.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gradient-ember flex items-center justify-center">
              <Flame className="w-4 h-4 text-accent-foreground" />
            </span>
            <span className="font-extrabold">Campfire Chef AI</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Home</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Plan your camp menu</h1>
        <p className="text-muted-foreground mb-8">Tell us about your trip — we'll do the cooking part of the thinking.</p>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="plan"><Sparkles className="w-4 h-4 mr-2 hidden sm:inline" />Meal Plan</TabsTrigger>
            <TabsTrigger value="ingredients"><ListChecks className="w-4 h-4 mr-2 hidden sm:inline" />My Ingredients</TabsTrigger>
            <TabsTrigger value="chat"><MessageCircle className="w-4 h-4 mr-2 hidden sm:inline" />Assistant</TabsTrigger>
          </TabsList>

          {/* PLAN */}
          <TabsContent value="plan" className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4 p-6 rounded-2xl bg-card border border-border shadow-soft">
              <div className="space-y-2">
                <Label>Trip length (days)</Label>
                <Input type="number" min={1} max={14} value={days} onChange={(e) => setDays(+e.target.value || 1)} />
              </div>
              <div className="space-y-2">
                <Label>People</Label>
                <Input type="number" min={1} max={20} value={people} onChange={(e) => setPeople(+e.target.value || 1)} />
              </div>
              <div className="space-y-2">
                <Label>Camping mode</Label>
                <Select value={campingMode} onValueChange={setCampingMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tent camping">Tent camping</SelectItem>
                    <SelectItem value="RV camping">RV camping</SelectItem>
                    <SelectItem value="Backpacking">Backpacking</SelectItem>
                    <SelectItem value="Survival / minimalist">Survival / minimalist</SelectItem>
                    <SelectItem value="Family camping">Family camping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Storage</Label>
                <Select value={storage} onValueChange={setStorage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cooler with ice">Cooler with ice</SelectItem>
                    <SelectItem value="RV fridge">RV fridge</SelectItem>
                    <SelectItem value="no refrigeration">No refrigeration</SelectItem>
                    <SelectItem value="dry storage only">Dry storage only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Cooking equipment</Label>
                <Input value={equipment} onChange={(e) => setEquipment(e.target.value)} placeholder="campfire, portable stove, grill…" />
              </div>
              <div className="space-y-2">
                <Label>Dietary preference</Label>
                <Select value={diet} onValueChange={setDiet}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no restrictions">No restrictions</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="gluten-free">Gluten-free</SelectItem>
                    <SelectItem value="high-protein">High-protein</SelectItem>
                    <SelectItem value="kid-friendly">Kid-friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Budget (optional)</Label>
                <Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="$50 total, or per person" />
              </div>
              <div className="sm:col-span-2 flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                <div>
                  <p className="font-semibold">Minimal dishes mode</p>
                  <p className="text-sm text-muted-foreground">Favor one-pot meals & easy cleanup</p>
                </div>
                <Switch checked={minimalDishes} onCheckedChange={setMinimalDishes} />
              </div>
            </div>

            <Button
              onClick={generatePlan}
              disabled={planLoading}
              size="lg"
              className="w-full h-14 bg-accent hover:bg-accent/90 text-accent-foreground shadow-warm font-bold text-base"
            >
              {planLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Building your menu…</> : <><Sparkles className="w-5 h-5 mr-2" /> Generate meal plan</>}
            </Button>

            {plan && (
              <div className="space-y-6 mt-8 animate-in fade-in duration-500">
                <div className="p-6 rounded-2xl bg-gradient-hero shadow-warm">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-primary-foreground">{plan.title}</h2>
                  <p className="mt-2 text-primary-foreground/90">{plan.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {plan.totalEstimatedCost && (
                      <span className="px-3 py-1.5 rounded-full bg-background/20 text-primary-foreground text-sm font-semibold">
                        💰 {plan.totalEstimatedCost}
                      </span>
                    )}
                    {plan.fuelTip && (
                      <span className="px-3 py-1.5 rounded-full bg-background/20 text-primary-foreground text-sm">
                        🔥 {plan.fuelTip}
                      </span>
                    )}
                  </div>
                  <Button onClick={downloadPdf} className="mt-5 bg-background text-foreground hover:bg-background/90">
                    <FileDown className="w-4 h-4 mr-2" /> Download printable PDF
                  </Button>
                </div>

                {plan.days.map((d) => (
                  <div key={d.day} className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                    <h3 className="text-xl font-extrabold mb-4 text-primary">Day {d.day}</h3>
                    <div className="space-y-5">
                      {d.meals.map((m, i) => (
                        <div key={i} className="border-l-4 border-accent pl-4">
                          <div className="flex flex-wrap items-baseline gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-accent">{m.type}</span>
                            <h4 className="text-lg font-bold">{m.name}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3 flex flex-wrap gap-3">
                            <span><Clock className="w-3 h-3 inline mr-1" />{m.prepMinutes + m.cookMinutes} min</span>
                            <span>Cleanup: {m.cleanup}</span>
                            {m.fuelEfficiency && <span>Fuel: {m.fuelEfficiency}</span>}
                          </p>
                          <p className="text-sm mb-2"><span className="font-semibold">Ingredients:</span> {m.ingredients.join(", ")}</p>
                          <ol className="text-sm space-y-1 list-decimal pl-5 text-muted-foreground">
                            {m.instructions.map((step, j) => <li key={j}>{step}</li>)}
                          </ol>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                  <h3 className="text-xl font-extrabold mb-4 flex items-center gap-2"><ShoppingBasket className="w-5 h-5 text-accent" /> Grocery List</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {plan.groceryList.map((g) => (
                      <div key={g.category}>
                        <p className="font-bold text-primary mb-2">{g.category}</p>
                        <ul className="space-y-1 text-sm">
                          {g.items.map((it, i) => <li key={i} className="flex gap-2"><span className="text-accent">✓</span>{it}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                    <h3 className="text-lg font-extrabold mb-3">Prep Checklist</h3>
                    <ul className="space-y-2 text-sm">
                      {plan.prepChecklist.map((c, i) => <li key={i} className="flex gap-2"><span>☐</span>{c}</li>)}
                    </ul>
                  </div>
                  <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                    <h3 className="text-lg font-extrabold mb-3">Storage Tips</h3>
                    <ul className="space-y-2 text-sm">
                      {plan.storageTips.map((t, i) => <li key={i} className="flex gap-2"><span className="text-accent">•</span>{t}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* INGREDIENTS */}
          <TabsContent value="ingredients" className="space-y-4">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-soft space-y-4">
              <Label>What ingredients & gear do you have?</Label>
              <Textarea
                rows={4}
                placeholder="eggs, tortillas, beans, portable stove…"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
              <Button onClick={generateIdeas} disabled={ideasLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-warm">
                {ideasLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cooking up ideas…</> : <><Sparkles className="w-4 h-4 mr-2" /> Get meal ideas</>}
              </Button>
            </div>
            {ideas && (
              <div className="p-6 rounded-2xl bg-card border border-border shadow-soft whitespace-pre-wrap text-sm leading-relaxed">
                {ideas}
              </div>
            )}
          </TabsContent>

          {/* CHAT */}
          <TabsContent value="chat" className="space-y-4">
            <div className="rounded-2xl bg-card border border-border shadow-soft p-4 space-y-3 min-h-[400px] flex flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[60vh]">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`p-3 rounded-xl text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground ml-12" : "bg-secondary mr-12"}`}>
                    {m.content}
                  </div>
                ))}
                {chatLoading && <div className="bg-secondary mr-12 p-3 rounded-xl"><Loader2 className="w-4 h-4 animate-spin" /></div>}
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); sendChat(); }}
                className="flex gap-2"
              >
                <Input
                  placeholder="What can I cook with limited water?"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={chatLoading}
                />
                <Button type="submit" disabled={chatLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Planner;