"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type SessionInfo = {
  sessionId: string;
  customerId: string;
  customerEmail: string | null;
  customerName: string | null;
  subscriptionId: string;
  subscriptionStatus: string | null;
  paymentStatus: string;
};

export default function DashboardClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [data, setData] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const [error, setError] = useState<string | null>(
    sessionId ? null : "No session provided. Complete onboarding and payment first."
  );

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch((err) => setError(err.message ?? "Failed to verify session"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/30">
        <h2 className="font-semibold text-red-800 dark:text-red-200">
          Unable to load dashboard
        </h2>
        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
          {error ?? "Invalid or expired session."}
        </p>
        <Link
          href="/onboarding"
          className="mt-4 inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
        >
          Go to onboarding
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-950/30">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white">
            ✓
          </div>
          <div>
            <h2 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
              Payment complete
            </h2>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Your subscription is active. You’re all set.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-medium text-slate-900 dark:text-white">
          Account
        </h3>
        <dl className="mt-3 space-y-2 text-sm">
          {data.customerName && (
            <>
              <dt className="text-slate-500 dark:text-slate-400">Name</dt>
              <dd className="font-medium text-slate-900 dark:text-white">
                {data.customerName}
              </dd>
            </>
          )}
          {data.customerEmail && (
            <>
              <dt className="text-slate-500 dark:text-slate-400">Email</dt>
              <dd className="font-medium text-slate-900 dark:text-white">
                {data.customerEmail}
              </dd>
            </>
          )}
          <dt className="text-slate-500 dark:text-slate-400">Subscription</dt>
          <dd className="font-medium capitalize text-slate-900 dark:text-white">
            {data.subscriptionStatus ?? "Active"}
          </dd>
        </dl>
      </div>

      <Link
        href="/"
        className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-center font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        Back to home
      </Link>
    </div>
  );
}
