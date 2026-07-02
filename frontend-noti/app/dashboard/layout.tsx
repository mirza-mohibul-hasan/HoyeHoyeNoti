"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";

const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  teaching_assistant: "Teaching Assistant",
  teacher: "Teacher",
};

function DashboardShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="flex items-center justify-between border-b border-black/8 px-6 py-4 dark:border-white/[.145]">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold text-black dark:text-zinc-50">
            HoyeHoyeNoti
          </Link>
          {user?.role === "teacher" && (
            <Link
              href="/dashboard/manage-users"
              className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Manage Users
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {user.name} &middot; {ROLE_LABELS[user.role] ?? user.role}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="rounded-full border border-black/8 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="flex flex-1 flex-col px-6 py-8">{children}</main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
