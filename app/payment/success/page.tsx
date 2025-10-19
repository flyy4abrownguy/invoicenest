import { NestCard, NestCardContent } from "@/components/nest/nest-card"
import { NestButton } from "@/components/nest/nest-button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <NestCard className="w-full max-w-md text-center">
        <NestCardContent className="p-8 space-y-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p className="text-muted-foreground mt-2">
              Your payment has been processed successfully. The invoice has been marked as paid.
            </p>
          </div>
          <Link href="/dashboard">
            <NestButton className="w-full" size="lg" withNest>
              Return to Dashboard
            </NestButton>
          </Link>
        </NestCardContent>
      </NestCard>
    </div>
  )
}
