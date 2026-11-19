"use client"

import { useCallback, useState, type FormEvent } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { fadeUpVariants } from "@/components/utils/animation"
import { Eye, EyeOff, Mail, Lock, User, Check, X } from "lucide-react"
import { FaGoogle } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"

type RegisterFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const RegisterPage = () => {
  const reduceMotion = useReducedMotion()
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = useCallback(
    (key: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [key]: e.target.value }))
    },
    []
  )

  const validatePassword = useCallback((password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasMinLength = password.length >= 6

    if (!hasUpperCase || !hasLowerCase || !hasMinLength) {
      alert(
        "Password must contain at least one uppercase letter, one lowercase letter, and be at least 6 characters long."
      )
      console.log("[Register] Password validation failed:", {
        hasUpperCase,
        hasLowerCase,
        hasMinLength,
        length: password.length,
      })
      return false
    }

    return true
  }, [])

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const { name, email, password, confirmPassword } = formData

      if (!name || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.")
        console.log("[Register] Registration failed: All fields are required")
        return
      }

      if (password !== confirmPassword) {
        alert("Password and confirm password do not match.")
        console.log("[Register] Registration failed: Passwords do not match")
        return
      }

      if (!validatePassword(password)) {
        return
      }

      const userData = { name, email, password }
      console.log("[Register] Registration successful. Stored user data:", userData)

      alert("Account created successfully!")
    },
    [formData, validatePassword]
  )

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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange("name")}
                />
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
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange("email")}
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
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange("password")}
                    placeholder="••••••"
                    autoComplete="new-password"
                    className="pl-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#1B1F16]/60 transition hover:text-[#1B1F16]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <ul className="grid gap-1.5 pt-2 sm:grid-cols-3">
                  {[
                    { label: "One uppercase letter", ok: /[A-Z]/.test(formData.password) },
                    { label: "One lowercase letter", ok: /[a-z]/.test(formData.password) },
                    { label: "At least 6 characters", ok: formData.password.length >= 6 },
                  ].map((r) => (
                    <li
                      key={r.label}
                      className={`flex items-center gap-1.5 text-[10px] font-medium transition ${
                        r.ok ? "text-[#3F6212]" : "text-[#1B1F16]/50"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full ${
                          r.ok ? "bg-[#7CB518] text-[#1B1F16]" : "bg-[#1B1F16]/10"
                        }`}
                      >
                        {r.ok ? <Check className="h-3 w-3" aria-hidden /> : <X className="h-3 w-3" aria-hidden />}
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
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••"
                    className="pl-10 pr-10"
                    value={formData.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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
                className={`w-full h-10 bg-[#7CB518] cursor-pointer text-white font-semibold hover:bg-[#679b16] transition-colors`}
              >
                Create Account
              </Button>

              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden
                >
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                  <span className="bg-card px-3 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-black text-white h-10"
                onClick={() => {
                  console.log("[Register] Google sign-in clicked (Better Auth to be implemented)")
                }}
              >
                <Image src="/google.png" alt="google" width={14} height={14}/>
                Register with Google
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t-0 bg-transparent p-6">
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
  )
}

export default RegisterPage
