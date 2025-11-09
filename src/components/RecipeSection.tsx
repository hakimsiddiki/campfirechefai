import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface RecipeSectionProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const RecipeSection = ({ icon: Icon, title, children, className = "" }: RecipeSectionProps) => {
  return (
    <Card className={`p-6 bg-gradient-card shadow-soft hover:shadow-warm transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      <div className="text-foreground/90">
        {children}
      </div>
    </Card>
  );
};
