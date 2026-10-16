import type { Metadata } from "next";
import { Suspense } from "react";
import { Logo } from "@/components/layout/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Panel girişi", robots: { index: false, follow: false } };

export default function PanelLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sonra?: string }>;
}) {
  return (
    <div className="tone-dark grain flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-[20px] border border-night-line bg-night-raised p-8">
          <h1 className="text-h3">Ofis paneli</h1>
          <p className="mt-2 mb-6 text-sm text-muted">Devam etmek için parolanızı girin.</p>
          <Suspense fallback={<LoginForm nextPath="/panel" />}>
            <LoginFormWithNext searchParams={searchParams} />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          Parolanızı unuttuysanız <code className="rounded bg-white/5 px-1.5 py-0.5">PANEL_PASSWORD_HASH_B64</code>{" "}
          ortam değişkenini güncelleyin.
        </p>
      </div>
    </div>
  );
}

async function LoginFormWithNext({ searchParams }: { searchParams: Promise<{ sonra?: string }> }) {
  const { sonra } = await searchParams;
  return <LoginForm nextPath={sonra && sonra.startsWith("/panel") ? sonra : "/panel"} />;
}
