"use client";

import { useAuth } from "@/context/AuthContext";

const ROLE_LABELS: Record<string, string> = {
  student: "Student",
  teaching_assistant: "Teaching Assistant",
  teacher: "Teacher",
};

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Welcome, {user.name}
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        You&apos;re signed in as a {ROLE_LABELS[user.role] ?? user.role}.
      </p>

      <div className="mt-8 max-w-md rounded-2xl border border-black/8 bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-zinc-500">Your profile</h2>
        <dl className="mt-3 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">Email</dt>
            <dd className="text-black dark:text-zinc-50">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Role</dt>
            <dd className="text-black dark:text-zinc-50">
              {ROLE_LABELS[user.role] ?? user.role}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Member since</dt>
            <dd className="text-black dark:text-zinc-50">
              {new Date(user.created_at).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
