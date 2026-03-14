import Link from "next/link";
import { Suspense } from "react";
import OnboardingForm from "./OnboardingForm";

export const metadata = {
  title: "Onboarding | Get started",
  description: "Complete your profile and subscription",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            ← Home
          </Link>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Onboarding
          </span>
          <span className="w-12" />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Get started
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Enter your details, then choose your subscription. You’ll complete
            payment securely on the next page.
          </p>
          <div className="mt-6">
            <Suspense
              fallback={
                <div className="flex min-h-[120px] items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                </div>
              }
            >
              <OnboardingForm />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
