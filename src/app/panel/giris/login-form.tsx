"use client";

import { Loader2, Lock } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { panelLogin } from "./actions";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, action, pending] = useActionState(panelLogin, null);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="sonra" value={nextPath} />
      <label className="block">
        <span className="mb-2 block text-xs font-semibold tracking-[0.14em] text-fg-muted uppercase">Parola</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="h-12 w-full rounded-xl border border-line bg-raised px-4 text-fg focus:border-accent focus:outline-none"
        />
      </label>
      {state && !state.ok ? (
        <p className="text-sm font-medium text-danger" role="alert">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
        {pending ? "Giriş yapılıyor…" : "Giriş yap"}
      </Button>
    </form>
  );
}
