import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Camping Meal Planning Tips & Recipes — Campfire Chef AI Blog</title>
        <meta
          name="description"
          content="Easy camping meals, no-fridge food ideas, and step-by-step meal planning guides for tent campers, RVers, and backpackers."
        />
        <link rel="canonical" href="https://campfirechefai.lovable.app/blog" />
        <meta property="og:title" content="Campfire Chef AI Blog — Camping Meals & Planning" />
        <meta property="og:url" content="https://campfirechefai.lovable.app/blog" />
      </Helmet>

      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Campfire Chef AI logo" width={36} height={36} className="w-9 h-9 rounded-full shadow-warm" />
            <span className="font-extrabold tracking-tight text-lg">Campfire Chef AI</span>
          </Link>
          <Link to="/planner">
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
              Plan my trip
            </Button>
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full mb-4">
            <Flame className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">The Field Notes</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Camping meal planning, simplified.
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Easy meals, smart packing, and outdoor cooking tips from the Campfire Chef AI team.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {blogPosts.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="group p-7 rounded-2xl bg-gradient-card border border-border shadow-soft hover:shadow-warm hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-4">{p.heroEmoji}</div>
              <h2 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors">
                {p.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{p.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(p.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-accent">
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Campfire Chef AI. Cook wild.
        </div>
      </footer>
    </div>
  );
};

export default Blog;