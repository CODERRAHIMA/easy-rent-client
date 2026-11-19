"use client"

import { useCallback, useState, type FormEvent } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { fadeUpVariants } from "@/components/utils/animation"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
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

const BRAND_GREEN = "#7CB518"
const BRAND_GREEN_HOVER = "#679b16"

type LoginFormData = {
  email: string
  password: string
}

const LoginPage = () => {
  const reduceMotion = useReducedMotion()
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = useCallback(
    (key: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [key]: e.target.value }))
    },
    []
  )

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const { email, password } = formData

      if (!email || !password) {
        alert("Please fill in all fields.")
        console.log("[Login] Login failed: All fields are required")
        return
      }

      // Store data locally so it can be sent to Better Auth later
      console.log("[Login] Login attempted with:", { email, password })

      alert("Login successful!")
    },
    [formData]
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
            <CardTitle className="mb-2">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your Easy Rent account to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={handleChange("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className={`w-full h-10 bg-[#7CB518] text-white font-semibold hover:bg-[#679b16] transition-colors`}
              >
                Sign in
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
                className="w-full h-10 bg-black text-white"
                onClick={() => {
                  console.log("[Login] Google sign-in clicked (Better Auth to be implemented)")
                }}
              >
                <Image src="/google.png" alt="google" width={14} height={14}/>
                Continue with Google
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center pt-4 border-t-0 bg-transparent p-6">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
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
  )
}

export default LoginPage
