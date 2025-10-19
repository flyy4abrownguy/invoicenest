"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { NestButton } from "@/components/nest/nest-button"
import { NestCard, NestCardContent, NestCardHeader, NestCardTitle } from "@/components/nest/nest-card"
import { NestLogoWithText } from "@/components/nest/nest-logo"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, CheckCircle } from "lucide-react"
import { formatPhoneNumber } from "@/lib/utils/phone-formatter"

const welcomeSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  company_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  company_phone: z.string().optional(),
  company_address: z.string().optional(),
})

export default function WelcomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<z.infer<typeof welcomeSchema>>({
    resolver: zodResolver(welcomeSchema),
  })

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('company_phone', formatted)
  }

  const onSubmit = async (data: z.infer<typeof welcomeSchema>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <NestLogoWithText />
        </div>

        {/* Welcome Card */}
        <NestCard className="animate-nest-settle">
          <NestCardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <NestCardTitle className="text-2xl">Welcome to InvoiceNest!</NestCardTitle>
                <p className="text-muted-foreground mt-1">
                  Let&apos;s set up your company profile
                </p>
              </div>
            </div>
          </NestCardHeader>
          <NestCardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  {...register('company_name')}
                  placeholder="Acme Inc."
                  disabled={isLoading}
                />
                {errors.company_name && (
                  <p className="text-sm text-destructive mt-1">{errors.company_name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company_email">Company Email</Label>
                <Input
                  id="company_email"
                  type="email"
                  {...register('company_email')}
                  placeholder="billing@acme.com"
                  disabled={isLoading}
                />
                {errors.company_email && (
                  <p className="text-sm text-destructive mt-1">{errors.company_email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company_phone">Company Phone</Label>
                <Input
                  id="company_phone"
                  {...register('company_phone')}
                  onChange={handlePhoneChange}
                  placeholder="(555) 123-4567"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="company_address">Company Address</Label>
                <Textarea
                  id="company_address"
                  {...register('company_address')}
                  placeholder="123 Main St, City, State 12345"
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="pt-4 space-y-4">
                <NestButton
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                  withNest
                >
                  {isLoading ? 'Setting up...' : 'Complete Setup'}
                </NestButton>

                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  Skip for now
                </button>
              </div>
            </form>

            {/* Benefits */}
            <div className="pt-6 border-t border-border space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Why add your company info?
              </p>
              <div className="space-y-2">
                {[
                  'Appears on your invoices and PDFs',
                  'Included in email communications',
                  'Professional branding for your business',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </NestCardContent>
        </NestCard>

        <p className="text-center text-sm text-muted-foreground">
          You can always update this information later in Settings
        </p>
      </div>
    </div>
  )
}
