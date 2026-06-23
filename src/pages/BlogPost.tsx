import { Link, Navigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPostBySlug } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const url = `https://campfirechefai.lovable.app/blog/${post.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Campfire Chef AI" },
    mainEntityOfPage: url,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{post.title} — Campfire Chef AI</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
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

      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> All posts
        </Link>

        <div className="text-5xl mb-4">{post.heroEmoji}</div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">{post.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} ·{" "}
          {post.readMinutes} min read
        </p>

        <div className="mt-8 space-y-5 text-foreground/90 leading-relaxed">
          {post.body.map((block, i) => {
            if (block.type === "p") return <p key={i}>{block.text}</p>;
            if (block.type === "h2")
              return (
                <h2 key={i} className="text-2xl font-bold mt-10 mb-2 tracking-tight">
                  {block.text}
                </h2>
              );
            if (block.type === "ul")
              return (
                <ul key={i} className="list-disc pl-6 space-y-1.5">
                  {block.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              );
            return (
              <ol key={i} className="list-decimal pl-6 space-y-1.5">
                {block.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ol>
            );
          })}
        </div>

        <div className="mt-12 p-7 rounded-2xl bg-gradient-hero text-primary-foreground shadow-warm">
          <h3 className="text-xl font-bold mb-2">Skip the planning, eat better at camp.</h3>
          <p className="text-primary-foreground/85 mb-5">
            Campfire Chef AI builds your full camping menu, grocery list, and printable PDF in under 30 seconds — free to try.
          </p>
          <Link to="/planner">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
              Plan my trip <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </article>

      <footer className="border-t border-border py-10 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Campfire Chef AI. Cook wild.
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;