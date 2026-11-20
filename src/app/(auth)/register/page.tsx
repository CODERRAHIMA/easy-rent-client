"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUpVariants } from "@/components/utils/animation";
import { Eye, EyeOff, Mail, Lock, User, Check, X } from "lucide-react";

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
import { authClient } from "@/lib/auth-client";

const RegisterPage = () => {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [password, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pending, setPending] = useState<"email" | "google" | null>(null);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending("email");

    const formData = new FormData(e.currentTarget);

    if (!formData.get("image")) {
      formData.set("image", "/girlReview.jpg");
    }

    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match.");
      setPending(null);
      return;
    }

    const unmetRequirements: string[] = [];

    if (!/[A-Z]/.test(password)) {
      unmetRequirements.push("At least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      unmetRequirements.push("At least one lowercase letter");
    }
    if (password.length < 6) {
      unmetRequirements.push("At least 6 characters");
    }

    if (unmetRequirements.length > 0) {
      toast.error(
        `Password requirements not met:\n\n${unmetRequirements.join("\n")}`,
      );
      setPending(null);
      return;
    }

    const user = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      image: String(formData.get("image") ?? ""),
      password,
    };

    let accountCreated = false;
    try {
      const { data, error } = await authClient.signUp.email({
        ...user,
      });

      if (data) {
        toast.success("Your account has been created.");
        accountCreated = true;
      } else {
        toast.error(error?.message || "Unable to create your account.");
      }
    } catch {
      toast.error("Unable to create your account right now. Please try again.");
    } finally {
      setPending(null);
    }

    if (accountCreated) {
      router.push("/");
      router.refresh();
    }
  };

  async function handleGoogleSignIn() {
    setPending("google");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
      });

      if (error) {
        toast.error(error.message || "Unable to continue with Google.");
      } else {
        toast.success("Google Signin Successful.");
      }
    } catch {
      toast.error("Unable to continue with Google right now. Please try again.");
    } finally {
      setPending(null);
    }
  }

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
            <CardTitle className="mb-2">Create an account</CardTitle>
            <CardDescription>
              Join Easy Rent and start renting equipment today.
            </CardDescription>
          </CardHeader>

          <CardContent className="">
            <form onSubmit={handleSignUp} className="space-y-5">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-black text-white h-10 cursor-pointer hover:bg-gray-900 hover:text-white"
                onClick={handleGoogleSignIn}
                disabled={pending !== null}
              >
                <Image src="/google.png" alt="google" width={14} height={14} />
                {pending === "google" ? "Connecting..." : "Register with Google"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden>
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                  <span className="bg-card px-3 text-muted-foreground">Or</span>
                </div>
              </div>


              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Profile Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  autoComplete="url"
                  placeholder="https://unsplash.com/..."
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Leave empty for default avatar
                </p>
              </div>

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
                  <Label htmlFor="password" className="text-sm font-semibold">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3F6212]"
                    aria-hidden
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    autoComplete="new-password"
                    className="pl-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#1B1F16]/60 transition hover:text-[#1B1F16]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <ul className="grid gap-1.5 pt-2 sm:grid-cols-3">
                  {[
                    {
                      label: "One uppercase letter",
                      ok: /[A-Z]/.test(password),
                    },
                    {
                      label: "One lowercase letter",
                      ok: /[a-z]/.test(password),
                    },
                    {
                      label: "At least 6 characters",
                      ok: password.length >= 6,
                    },
                  ].map((r) => (
                    <li
                      key={r.label}
                      className={`flex items-center gap-1.5 text-[10px] font-medium transition ${
                        r.ok ? "text-[#3F6212]" : "text-[#1B1F16]/50"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full ${
                          r.ok
                            ? "bg-[#7CB518] text-[#1B1F16]"
                            : "bg-[#1B1F16]/10"
                        }`}
                      >
                        {r.ok ? (
                          <Check className="h-3 w-3" aria-hidden />
                        ) : (
                          <X className="h-3 w-3" aria-hidden />
                        )}
                      </span>
                      {r.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
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
                className={`w-full h-10 bg-[#7CB518] cursor-pointer text-white font-semibold hover:bg-[#679b16] transition-colors`}
              >
                {pending === "email" ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t-0 bg-transparent p-6 pt-0">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className={`text-[#7CB518] font-semibold hover:underline transition-colors`}
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;