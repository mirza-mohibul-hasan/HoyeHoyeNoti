import type { Role, Token, User } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail)) {
      return body.detail.map((e: { msg?: string }) => e.msg).join(", ");
    }
  } catch {
    // response had no JSON body
  }
  return `Request failed with status ${response.status}`;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorMessage(response));
  }
  return response.json() as Promise<T>;
}

export function registerUser(name: string, email: string, password: string) {
  return apiFetch<User>("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
}

export function loginUser(email: string, password: string) {
  const body = new URLSearchParams({ username: email, password });
  return apiFetch<Token>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
}

export function fetchMe(token: string) {
  return apiFetch<User>("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createUser(
  token: string,
  input: { name: string; email: string; password: string; role: Role }
) {
  return apiFetch<User>("/api/auth/create-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
}
