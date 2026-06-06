import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type Subscription = {
  plan: "free" | "pro" | "crew";
  billing_cycle: string | null;
  status: string;
  current_period_end: string | null;
};

type Ctx = {
  user: User | null;
  session: Session | null;
  subscription: Subscription | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSub = async (uid: string) => {
    const { data } = await supabase
      .from("subscriptions")
      .select("plan, billing_cycle, status, current_period_end")
      .eq("user_id", uid)
      .maybeSingle();
    setSubscription((data as Subscription) ?? null);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) setTimeout(() => fetchSub(s.user.id), 0);
      else setSubscription(null);
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) fetchSub(s.user.id);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        user, session, subscription, loading,
        signOut: async () => { await supabase.auth.signOut(); },
        refreshSubscription: async () => { if (user) await fetchSub(user.id); },
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}