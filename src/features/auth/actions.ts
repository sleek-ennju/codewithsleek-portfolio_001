"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { signInSchema, type SignInState } from "@/features/auth/schemas";

export async function authenticate(
  _previousState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your sign-in details." };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: "/admin/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "The email or password is incorrect." };
    }
    throw error;
  }

  redirect("/admin/dashboard");
}

export async function endAdminSession() {
  await signOut({ redirectTo: "/admin/login" });
}
