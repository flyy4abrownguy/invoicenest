"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signUp, signInWithGoogle } from "@/lib/supabase/auth"
import { NestButton } from "@/components/nest/nest-button"
import { NestCard, NestCardContent, NestCardHeader, NestCardTitle } from "@/components/nest/nest-card"
import { NestLogoWithText } from "@/components/nest/nest-logo"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, CheckCircle2 } from "lucide-react"

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  })

  const handleSignUp = async (data: z.infer<typeof signupSchema>) => {
    setIsLoading(true)
    setError(null)

    try {
      await signUp(data.email, data.password, data.fullName)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google')
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <NestCard className="animate-nest-settle text-center">
            <NestCardContent className="p-8 space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Check your email</h2>
                <p className="text-muted-foreground mt-2">
                  We&apos;ve sent you a confirmation link. Click it to verify your account and get started.
                </p>
              </div>
              <Link href="/auth/login">
                <NestButton className="w-full" withNest>
                  Back to Login
                </NestButton>
              </Link>
            </NestCardContent>
          </NestCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <NestLogoWithText />
        </div>

        {/* Signup Card */}
        <NestCard className="animate-nest-settle">
          <NestCardHeader>
            <NestCardTitle className="text-2xl text-center">Create Your Nest</NestCardTitle>
            <p className="text-center text-muted-foreground mt-2">
              Start managing invoices beautifully
            </p>
          </NestCardHeader>
          <NestCardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...register('fullName')}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <NestButton
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
                withNest
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </NestButton>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <NestButton
              type="button"
              variant="outline"
              className="w-full"
              size="lg"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              <Mail className="w-4 h-4 mr-2" />
              Google
            </NestButton>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </NestCardContent>
        </NestCard>

        <p className="text-center text-sm text-muted-foreground">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
