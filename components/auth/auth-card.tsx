"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, "Enter your full name.")
});

type Mode = "signin" | "signup";
type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

export function AuthCard({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const schema = mode === "signup" ? signUpSchema : signInSchema;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInValues | SignUpValues>({
    resolver: zodResolver(schema)
  });

  async function onSubmit(values: SignInValues | SignUpValues) {
    setLoading(true);
    const supabase = createBrowserSupabaseClient();

    try {
      if (mode === "signup") {
        const payload = values as SignUpValues;
        const { error } = await supabase.auth.signUp({
          email: payload.email,
          password: payload.password,
          options: {
            data: { full_name: payload.fullName }
          }
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
        router.push("/signin");
        router.refresh();
        return;
      }

      const payload = values as SignInValues;
      const { error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password
      });

      if (error) throw error;
      toast.success("Signed in successfully.");
      router.push("/account");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function oauth(provider: "google" | "apple") {
    const supabase = createBrowserSupabaseClient();
    const redirectTo = `${window.location.origin}/account`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo }
    });
    if (error) toast.error(error.message);
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border bg-white p-6 shadow-lg dark:bg-slate-900">
      <h1 className="text-2xl font-bold">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {mode === "signin"
          ? "Sign in to manage orders, wishlist, and smart devices."
          : "Sign up to save preferences and unlock faster checkout."}
      </p>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {mode === "signup" ? (
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <input className="w-full text-sm" {...register("fullName")} />
            {"fullName" in errors ? <p className="mt-1 text-xs text-red-500">{errors.fullName?.message}</p> : null}
          </div>
        ) : null}

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input type="email" className="w-full text-sm" {...register("email")} />
          {"email" in errors ? <p className="mt-1 text-xs text-red-500">{errors.email?.message}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input type="password" className="w-full text-sm" {...register("password")} />
          {"password" in errors ? <p className="mt-1 text-xs text-red-500">{errors.password?.message}</p> : null}
        </div>

        <Button className="w-full" disabled={loading} type="submit">
          {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </Button>
      </form>

      <div className="my-4 h-px bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-2">
        <Button variant="outline" className="w-full" onClick={() => oauth("google")}>
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full" onClick={() => oauth("apple")}>
          Continue with Apple
        </Button>
      </div>

      <p className="mt-5 text-sm text-slate-500">
        {mode === "signin" ? "New to installease?" : "Already have an account?"}{" "}
        <Link href={mode === "signin" ? "/signup" : "/signin"} className="font-semibold text-indigo-600">
          {mode === "signin" ? "Create account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}
