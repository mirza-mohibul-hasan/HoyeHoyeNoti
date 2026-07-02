"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading || user) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        HoyeHoyeNoti
      </h1>
      <p className="mt-3 max-w-sm text-zinc-600 dark:text-zinc-400">
        Sign in or create a student account to get started.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/login"
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="rounded-full border border-black/8 px-6 py-3 text-sm font-medium transition-colors hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
