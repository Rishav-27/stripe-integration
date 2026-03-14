import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Stripe testing
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Get started by adding a payment method.
      </p>
      <Link
        href="/onboarding"
        className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition hover:bg-indigo-500"
      >
        Go to onboarding
      </Link>
    </div>
  );
}
