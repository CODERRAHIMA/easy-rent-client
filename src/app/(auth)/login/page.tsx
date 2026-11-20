"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUpVariants } from "@/components/utils/animation";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/lib/auth-client";

const LoginPage = () => {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState<"email" | "google" | null>(null);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending("email");

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      setPending(null);
      return;
    }

    let signedIn = false;
    try {
      const { data, error } = await signIn.email({
        email,
        password,
        rememberMe: true,
      });

      if (data) {
        toast.success("Welcome back!");
        signedIn = true;
      } else {
        toast.error(error?.message || "Invalid email or password.");
      }
    } catch {
      toast.error("Unable to sign you in right now. Please try again.");
    } finally {
      setPending(null);
    }

    if (signedIn) {
      router.push("/");
      router.refresh();
    }
  };

  // async function handleGoogleSignIn() {
  //   setPending("google");

  //   try {
  //     const { error } = await authClient.signIn.social({
  //       provider: "google",
  //     });

  //     if (error) {
  //       toast.error(error.message || "Unable to continue with Google.");
  //     } else {
  //       toast.success("Google Signin Successful.");
  //     }
  //   } catch {
  //     toast.error("Unable to continue with Google right now. Please try again.");
  //   } finally {
  //     setPending(null);
  //   }
  // }

  return (
    <div className="min-h-[calc(100vh-rem(200px))] flex items-center justify-center bg-[#F4F4F3] px-4 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants(reduceMotion)}
        className="w-full max-w-md"
      >
        <Card className="overflow-hidden border-neutral-200">
          <CardHeader className="pb-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#7CB518]/10 text-[#7CB518] mb-4">
              <User className="size-5" />
            </div>
            <CardTitle className="mb-2">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your Easy Rent account to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="">
            <form onSubmit={handleSignIn} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={pending !== null}
                className={`w-full h-10 bg-[#7CB518] text-white font-semibold hover:bg-[#679b16] transition-colors`}
              >
                {pending === "email" ? "Signing in..." : "Sign in"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden>
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                  <span className="bg-card px-3 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-10 bg-black text-white"
                // onClick={handleGoogleSignIn}
                disabled={pending !== null}
              >
                <Image src="/google.png" alt="google" width={14} height={14} />
                {pending === "google" ? "Connecting..." : "Continue with Google"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center pt-4 border-t-0 bg-transparent p-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className={`text-[#7CB518] font-semibold hover:underline transition-colors`}
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;