import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RecipeSection } from "@/components/RecipeSection";
import { 
  ChefHat, Clock, Users, Flame, ListChecks, Utensils, 
  Lightbulb, Apple, Heart, Sparkles, BookOpen, Share2 
} from "lucide-react";
import heroFood from "@/assets/hero-food.jpg";

const Index = () => {
  const [dishName, setDishName] = useState("");
  const [showRecipe, setShowRecipe] = useState(false);

  const handleGenerate = () => {
    if (dishName.trim()) {
      setShowRecipe(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroFood})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/30 backdrop-blur-sm rounded-full mb-6 shadow-soft">
              <ChefHat className="w-5 h-5 text-primary-foreground" />
              <span className="text-sm font-medium text-primary-foreground">World-Class Recipe Generator</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Create Professional Recipes in Seconds
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 leading-relaxed">
              Get detailed, chef-quality recipes with nutritional info, cooking tips, and beautiful presentation ideas. 
              From traditional classics to modern fusion — your culinary journey starts here.
            </p>

            {/* Recipe Input */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <Input
                placeholder="Enter dish name (e.g., Butter Chicken, Tiramisu, Pad Thai)"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
                className="flex-1 h-12 bg-card shadow-soft border-border/50 text-foreground placeholder:text-muted-foreground"
              />
              <Button 
                onClick={handleGenerate}
                size="lg"
                className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground shadow-warm font-semibold"
              >
                Generate Recipe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Display */}
      {showRecipe && (
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Title & Description */}
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {dishName || "Your Amazing Dish"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A delightful fusion of authentic flavors and modern techniques, this dish brings warmth to your table 
                with its aromatic spices and perfectly balanced textures. Perfect for both weeknight dinners and special occasions.
              </p>
            </div>

            {/* Quick Info */}
            <RecipeSection icon={Clock} title="Quick Info">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Prep Time</p>
                  <p className="font-semibold">20 minutes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cook Time</p>
                  <p className="font-semibold">35 minutes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Time</p>
                  <p className="font-semibold">55 minutes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Servings</p>
                  <p className="font-semibold">4 people</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
                  <p className="font-semibold">Medium</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cuisine</p>
                  <p className="font-semibold">Fusion</p>
                </div>
              </div>
            </RecipeSection>

            {/* Ingredients */}
            <RecipeSection icon={ListChecks} title="Ingredients">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-primary mb-2">Main Ingredients</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>500g chicken breast (or tofu for vegetarian option)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>200ml coconut cream</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>2 tablespoons olive oil</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>1 large onion, finely diced</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">Spices & Seasonings</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>2 teaspoons garam masala</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>1 teaspoon turmeric powder</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Salt and pepper to taste</span>
                    </li>
                  </ul>
                </div>
              </div>
            </RecipeSection>

            {/* Equipment */}
            <RecipeSection icon={Utensils} title="Equipment Needed">
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium">Large Pan</span>
                <span className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium">Cutting Board</span>
                <span className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium">Sharp Knife</span>
                <span className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium">Mixing Bowl</span>
                <span className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium">Wooden Spoon</span>
              </div>
            </RecipeSection>

            {/* Cooking Instructions */}
            <RecipeSection icon={Flame} title="Step-by-Step Instructions">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</span>
                  <div>
                    <p className="font-medium mb-1">Prepare the ingredients</p>
                    <p className="text-sm text-muted-foreground">Dice the onion finely, cut chicken into bite-sized pieces, and measure all spices. This mise en place saves time later.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</span>
                  <div>
                    <p className="font-medium mb-1">Sear the protein</p>
                    <p className="text-sm text-muted-foreground">Heat oil in a large pan over medium-high heat. Add chicken pieces and cook for 5-6 minutes until golden brown. Set aside.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</span>
                  <div>
                    <p className="font-medium mb-1">Build the base</p>
                    <p className="text-sm text-muted-foreground">In the same pan, sauté onions until translucent (about 4 minutes). Add spices and stir continuously for 30 seconds to release aromas.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">4</span>
                  <div>
                    <p className="font-medium mb-1">Combine and simmer</p>
                    <p className="text-sm text-muted-foreground">Return chicken to pan, add coconut cream, and bring to a gentle simmer. Cook uncovered for 15-20 minutes, stirring occasionally.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">5</span>
                  <div>
                    <p className="font-medium mb-1">Final touches</p>
                    <p className="text-sm text-muted-foreground">Adjust seasoning with salt and pepper. Let rest for 5 minutes off heat before serving for flavors to meld beautifully.</p>
                  </div>
                </li>
              </ol>
            </RecipeSection>

            {/* Chef Tips */}
            <RecipeSection icon={Lightbulb} title="Chef Tips & Common Mistakes">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-accent mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Pro Tips
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-accent">✓</span>
                      <span>Let chicken come to room temperature before cooking for even heat distribution</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">✓</span>
                      <span>Toast whole spices first, then grind for maximum flavor depth</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent">✓</span>
                      <span>Use full-fat coconut cream for richer, more authentic taste</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-destructive mb-2">Common Mistakes to Avoid</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-destructive">✗</span>
                      <span>Overcrowding the pan — cook in batches if needed</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-destructive">✗</span>
                      <span>Adding salt too early can dry out the protein</span>
                    </li>
                  </ul>
                </div>
              </div>
            </RecipeSection>

            {/* Nutrition */}
            <RecipeSection icon={Apple} title="Nutritional Information">
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold text-primary">420</p>
                    <p className="text-sm text-muted-foreground">Calories</p>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold text-primary">32g</p>
                    <p className="text-sm text-muted-foreground">Protein</p>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold text-primary">18g</p>
                    <p className="text-sm text-muted-foreground">Carbs</p>
                  </div>
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold text-primary">24g</p>
                    <p className="text-sm text-muted-foreground">Fats</p>
                  </div>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                  <p className="text-sm">
                    <span className="font-semibold">Health Insight:</span> High in protein and healthy fats, 
                    this dish supports muscle recovery and sustained energy. Perfect for post-workout meals or active lifestyles.
                  </p>
                </div>
              </div>
            </RecipeSection>

            {/* Pairings */}
            <RecipeSection icon={Heart} title="Flavor Pairings & Serving">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-2">Perfect Pairings</h3>
                  <p className="text-sm">Serve with fluffy basmati rice, warm naan bread, or cauliflower rice for a low-carb option. 
                  Pair with a crisp white wine or mango lassi.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Plating Ideas</h3>
                  <p className="text-sm">Garnish with fresh cilantro, a swirl of cream, and a sprinkle of garam masala. 
                  Serve in a shallow bowl with sides arranged artistically for Instagram-worthy presentation.</p>
                </div>
              </div>
            </RecipeSection>

            {/* Variations */}
            <RecipeSection icon={Users} title="Recipe Variations">
              <div className="space-y-3">
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="font-semibold mb-2">🌱 Vegan Version</h3>
                  <p className="text-sm">Replace chicken with firm tofu or chickpeas. Use coconut yogurt instead of cream for tang.</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="font-semibold mb-2">⚡ Quick 15-Min Version</h3>
                  <p className="text-sm">Use pre-cooked rotisserie chicken and jarred curry paste. Skip marination and simmer for just 8 minutes.</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="font-semibold mb-2">🌾 Gluten-Free</h3>
                  <p className="text-sm">Already naturally gluten-free! Just ensure spice blends contain no wheat-based fillers.</p>
                </div>
              </div>
            </RecipeSection>

            {/* Fun Fact */}
            <RecipeSection icon={BookOpen} title="Fun Fact">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm leading-relaxed">
                  🌏 This fusion dish combines traditional South Asian cooking techniques with modern ingredient innovations, 
                  reflecting how cuisines evolve through cultural exchange and creativity.
                </p>
              </div>
            </RecipeSection>

            {/* Social Caption */}
            <RecipeSection icon={Share2} title="Share Your Creation">
              <div className="space-y-3">
                <div className="p-4 bg-gradient-hero rounded-lg">
                  <p className="text-primary-foreground text-sm italic leading-relaxed">
                    "Just whipped up this melt-in-your-mouth {dishName || "masterpiece"} and my kitchen smells like heaven! 
                    The golden-brown sear, that creamy coconut sauce, those aromatic spices — pure culinary magic ✨🍽️"
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">#HomeCooking</span>
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">#FoodieLife</span>
                  <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium">#RecipeOfTheDay</span>
                </div>
              </div>
            </RecipeSection>

          </div>
        </section>
      )}

      {/* Footer CTA */}
      {!showRecipe && (
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Cook Something Amazing?
            </h2>
            <p className="text-muted-foreground mb-8">
              Enter any dish name above and get a complete, professional recipe with detailed instructions, 
              nutritional info, and chef tips.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-card rounded-lg shadow-soft">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Chef-Quality</h3>
                <p className="text-sm text-muted-foreground">Professional recipes with precise measurements</p>
              </div>
              <div className="p-6 bg-card rounded-lg shadow-soft">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Time-Accurate</h3>
                <p className="text-sm text-muted-foreground">Real prep and cook times you can trust</p>
              </div>
              <div className="p-6 bg-card rounded-lg shadow-soft">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Pro Tips Included</h3>
                <p className="text-sm text-muted-foreground">Learn techniques from expert chefs</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
