"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { profileSchema } from "@/lib/utils/validation"
import { NestButton } from "@/components/nest/nest-button"
import { NestCard, NestCardContent, NestCardHeader, NestCardTitle } from "@/components/nest/nest-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building, CreditCard, User, Upload, Crown } from "lucide-react"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'billing'>('profile')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      company_name: '',
      company_address: '',
      company_phone: '',
      company_email: '',
    }
  })

  const handleSaveProfile = async (data: z.infer<typeof profileSchema>) => {
    setIsSaving(true)
    try {
      // TODO: Implement actual API call
      console.log('Saving profile:', data)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="w-4 h-4 inline mr-2" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'company'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building className="w-4 h-4 inline mr-2" />
          Company
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'billing'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <CreditCard className="w-4 h-4 inline mr-2" />
          Billing
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit(handleSaveProfile)} className="space-y-6">
          <NestCard className="animate-nest-settle">
            <NestCardHeader>
              <NestCardTitle>Personal Information</NestCardTitle>
            </NestCardHeader>
            <NestCardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <NestButton type="button" variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </NestButton>
                  <p className="text-sm text-muted-foreground mt-1">JPG or PNG, max 2MB</p>
                </div>
              </div>

              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  {...register('full_name')}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="user@example.com"
                  disabled
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>
            </NestCardContent>
          </NestCard>

          <div className="flex justify-end">
            <NestButton type="submit" disabled={isSaving} withNest>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </NestButton>
          </div>
        </form>
      )}

      {/* Company Tab */}
      {activeTab === 'company' && (
        <form onSubmit={handleSubmit(handleSaveProfile)} className="space-y-6">
          <NestCard className="animate-nest-settle">
            <NestCardHeader>
              <NestCardTitle>Company Information</NestCardTitle>
            </NestCardHeader>
            <NestCardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                  <Building className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <NestButton type="button" variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </NestButton>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will appear on your invoices
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  {...register('company_name')}
                  placeholder="Acme Inc."
                />
              </div>

              <div>
                <Label htmlFor="company_email">Company Email</Label>
                <Input
                  id="company_email"
                  type="email"
                  {...register('company_email')}
                  placeholder="billing@acmeinc.com"
                />
                {errors.company_email && (
                  <p className="text-sm text-destructive mt-1">{errors.company_email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company_phone">Phone Number</Label>
                <Input
                  id="company_phone"
                  {...register('company_phone')}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="company_address">Address</Label>
                <Textarea
                  id="company_address"
                  {...register('company_address')}
                  placeholder="123 Main St, Suite 100&#10;City, State ZIP"
                  rows={4}
                />
              </div>
            </NestCardContent>
          </NestCard>

          <div className="flex justify-end">
            <NestButton type="submit" disabled={isSaving} withNest>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </NestButton>
          </div>
        </form>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <NestCard className="animate-nest-settle">
            <NestCardHeader>
              <NestCardTitle>Current Plan</NestCardTitle>
            </NestCardHeader>
            <NestCardContent>
              <div className="flex items-center justify-between p-6 border border-border rounded-lg bg-muted/20">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold">Free Tier</h3>
                    <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded">Current</span>
                  </div>
                  <p className="text-muted-foreground mt-1">5 invoices per month • 3 clients</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">$0</div>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Crown className="w-5 h-5 text-accent mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold">Upgrade to Pro</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Unlock unlimited invoices, remove watermarks, and access premium features
                    </p>
                  </div>
                  <NestButton withNest>
                    Upgrade Now
                  </NestButton>
                </div>
              </div>
            </NestCardContent>
          </NestCard>

          <NestCard className="animate-nest-settle" style={{ animationDelay: '0.1s' }}>
            <NestCardHeader>
              <NestCardTitle>Usage This Month</NestCardTitle>
            </NestCardHeader>
            <NestCardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Invoices</span>
                  <span className="font-medium">0 / 5</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '0%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Clients</span>
                  <span className="font-medium">3 / 3</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '100%' }} />
                </div>
                <p className="text-sm text-orange-600 mt-1">Limit reached - upgrade to add more clients</p>
              </div>
            </NestCardContent>
          </NestCard>
        </div>
      )}
    </div>
  )
}
