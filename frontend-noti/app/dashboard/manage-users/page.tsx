"use client";

import { useState, type FormEvent } from "react";

import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { ApiError, createUser } from "@/lib/api";
import type { Role } from "@/lib/types";
import { getToken } from "@/lib/auth-storage";

function CreateUserForm() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const token = getToken();
    if (!token) return;

    setSubmitting(true);
    try {
      const created = await createUser(token, { name, email, password, role });
      setSuccess(`Created ${created.name} as ${created.role}.`);
      setName("");
      setEmail("");
      setPassword("");
      setRole("student");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Manage Users
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Signed in as {user?.name}. Create teaching assistant or student accounts below.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex max-w-md flex-col gap-4 rounded-2xl border border-black/8 bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950"
      >
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/8 px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/[.145] dark:focus:border-white/40"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/8 px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/[.145] dark:focus:border-white/40"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/8 px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/[.145] dark:focus:border-white/40"
          />
        </div>
        <div>
          <label htmlFor="role" className="text-sm font-medium">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="mt-1 w-full rounded-lg border border-black/8 px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/[.145] dark:focus:border-white/40"
          >
            <option value="student">Student</option>
            <option value="teaching_assistant">Teaching Assistant</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {submitting ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}

export default function ManageUsersPage() {
  return (
    <AuthGuard roles={["teacher"]}>
      <CreateUserForm />
    </AuthGuard>
  );
}
