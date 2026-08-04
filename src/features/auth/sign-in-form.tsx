"use client";

import { useActionState } from "react";

import { authenticate } from "./actions";
import type { SignInState } from "./schemas";

const initialState: SignInState = {};

export function SignInForm() {
  const [state, action, pending] = useActionState(authenticate, initialState);

  return (
    <form action={action} className="admin-login-form">
      <label htmlFor="admin-email">Email</label>
      <input id="admin-email" name="email" type="email" autoComplete="username" required />

      <label htmlFor="admin-password">Password</label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        minLength={12}
        required
      />

      {state.error ? <p className="admin-form-error" role="alert">{state.error}</p> : null}

      <button className="admin-primary-button" disabled={pending} type="submit">
        {pending ? "Signing in…" : "Sign in securely"}
      </button>
    </form>
  );
}
