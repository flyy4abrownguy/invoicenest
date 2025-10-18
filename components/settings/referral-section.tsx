"use client"

import { useState, useEffect } from "react"
import { NestCard, NestCardContent, NestCardHeader, NestCardTitle } from "@/components/nest/nest-card"
import { NestButton } from "@/components/nest/nest-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Users, Gift, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ReferralStats {
  totalReferrals: number
  activeReferrals: number
  rewardEarned: number
  pendingRewards: number
}

export function ReferralSection() {
  const [referralCode, setReferralCode] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [userEmail, setUserEmail] = useState<string>("")
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    activeReferrals: 0,
    rewardEarned: 0,
    pendingRewards: 0
  })

  useEffect(() => {
    async function loadUserAndReferralCode() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
        // Generate referral code from email (simple hash)
        const code = btoa(user.email).slice(0, 8).toUpperCase()
        setReferralCode(code)
      }
    }
    loadUserAndReferralCode()
  }, [])

  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Referral Program Overview */}
      <NestCard>
        <NestCardHeader>
          <NestCardTitle>Referral Program</NestCardTitle>
        </NestCardHeader>
        <NestCardContent className="space-y-4">
          <p className="text-muted-foreground">
            Invite your friends and colleagues to InvoiceNest and earn rewards! You'll get <span className="font-semibold text-primary">1 month of Pro for free</span> for every 3 people who sign up using your referral link and create their first invoice.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Referral Code */}
            <div>
              <Label htmlFor="referral-code">Your Referral Code</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="referral-code"
                  value={referralCode}
                  readOnly
                  className="font-mono font-bold text-lg"
                />
                <NestButton
                  type="button"
                  variant="outline"
                  onClick={() => handleCopy(referralCode)}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </NestButton>
              </div>
            </div>

            {/* Referral Link */}
            <div>
              <Label htmlFor="referral-link">Your Referral Link</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="referral-link"
                  value={referralLink}
                  readOnly
                  className="text-sm"
                />
                <NestButton
                  type="button"
                  variant="outline"
                  onClick={() => handleCopy(referralLink)}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </NestButton>
              </div>
            </div>
          </div>
        </NestCardContent>
      </NestCard>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <NestCard>
          <NestCardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalReferrals}</div>
                <div className="text-sm text-muted-foreground">Total Referrals</div>
              </div>
            </div>
          </NestCardContent>
        </NestCard>

        <NestCard>
          <NestCardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.activeReferrals}</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
            </div>
          </NestCardContent>
        </NestCard>

        <NestCard>
          <NestCardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Gift className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.rewardEarned}</div>
                <div className="text-sm text-muted-foreground">Rewards Earned</div>
              </div>
            </div>
          </NestCardContent>
        </NestCard>

        <NestCard>
          <NestCardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Gift className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.pendingRewards}</div>
                <div className="text-sm text-muted-foreground">Pending Rewards</div>
              </div>
            </div>
          </NestCardContent>
        </NestCard>
      </div>

      {/* How it Works */}
      <NestCard>
        <NestCardHeader>
          <NestCardTitle>How It Works</NestCardTitle>
        </NestCardHeader>
        <NestCardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold">Share Your Link</h4>
                <p className="text-sm text-muted-foreground">
                  Copy your unique referral link and share it with friends, colleagues, or on social media.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold">They Sign Up</h4>
                <p className="text-sm text-muted-foreground">
                  When someone signs up using your link, they'll be tracked as your referral.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold">They Create an Invoice</h4>
                <p className="text-sm text-muted-foreground">
                  Once your referral creates their first invoice, they become an "active" referral.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold">Earn Rewards</h4>
                <p className="text-sm text-muted-foreground">
                  For every 3 active referrals, you'll earn 1 month of Pro access for free! Rewards are automatically applied to your account.
                </p>
              </div>
            </div>
          </div>
        </NestCardContent>
      </NestCard>

      {/* Share Buttons */}
      <NestCard>
        <NestCardHeader>
          <NestCardTitle>Share on Social Media</NestCardTitle>
        </NestCardHeader>
        <NestCardContent>
          <div className="flex gap-3 flex-wrap">
            <NestButton
              type="button"
              variant="outline"
              onClick={() => {
                const text = encodeURIComponent("Check out InvoiceNest - the easiest way to create and manage invoices!")
                const url = encodeURIComponent(referralLink)
                window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
              }}
            >
              Share on X (Twitter)
            </NestButton>
            <NestButton
              type="button"
              variant="outline"
              onClick={() => {
                const url = encodeURIComponent(referralLink)
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
              }}
            >
              Share on LinkedIn
            </NestButton>
            <NestButton
              type="button"
              variant="outline"
              onClick={() => {
                const url = encodeURIComponent(referralLink)
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
              }}
            >
              Share on Facebook
            </NestButton>
            <NestButton
              type="button"
              variant="outline"
              onClick={() => {
                const text = encodeURIComponent("Check out InvoiceNest - the easiest way to create and manage invoices!")
                const url = encodeURIComponent(referralLink)
                window.open(`mailto:?subject=${text}&body=${text}%0A%0A${url}`, '_self')
              }}
            >
              Share via Email
            </NestButton>
          </div>
        </NestCardContent>
      </NestCard>
    </div>
  )
}
