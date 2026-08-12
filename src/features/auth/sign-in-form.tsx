"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { authenticate } from "./actions";
import type { SignInState } from "./schemas";

const initialState: SignInState = {};

function SignInButton() {
  const { pending } = useFormStatus();
  return <button aria-disabled={pending} className="admin-primary-button" disabled={pending} type="submit"><span aria-live="polite">{pending ? "Signing in..." : "Sign in securely"}</span></button>;
}

export function SignInForm() {
  const [state, action] = useActionState(authenticate, initialState);
  return <form action={action} className="admin-login-form"><label htmlFor="admin-email">Email</label><input id="admin-email" name="email" type="email" autoComplete="username" required /><label htmlFor="admin-password">Password</label><input id="admin-password" name="password" type="password" autoComplete="current-password" minLength={12} required />{state.error ? <p className="admin-form-error" role="alert">{state.error}</p> : null}<SignInButton /></form>;
}
