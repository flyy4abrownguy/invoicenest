import { NestButton } from "@/components/nest/nest-button";
import { NestCard, NestCardContent, NestCardHeader, NestCardTitle } from "@/components/nest/nest-card";
import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter Nest",
    price: "Free",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "5 invoices per month",
      "3 saved clients",
      "Basic invoice templates",
      "PDF generation",
      "Email sending",
      "Mobile responsive",
    ],
    cta: "Start Free",
    href: "/auth/signup",
    popular: false,
  },
  {
    name: "Pro Nest",
    price: "$9.99",
    period: "/month",
    description: "For growing businesses",
    features: [
      "Unlimited invoices",
      "Unlimited clients",
      "No watermark",
      "Recurring invoices",
      "Payment tracking",
      "Multiple tax rates",
      "Multi-currency support",
      "3 custom templates",
      "Expense tracking",
      "Payment links (Stripe)",
      "File attachments",
      "Custom fields",
      "Late fee automation",
      "Revenue dashboard",
      "Export data (CSV/Excel)",
      "Custom branding",
    ],
    cta: "Upgrade to Pro",
    href: "/auth/signup?plan=pro",
    popular: true,
  },
  {
    name: "Business Nest",
    price: "$24.99",
    period: "/month",
    description: "For established businesses",
    features: [
      "All Pro features",
      "Multi-user access (up to 5)",
      "Role-based permissions",
      "Client portal",
      "Automated reminders",
      "QuickBooks/Xero integration",
      "API access",
      "Priority support",
      "White-label option",
    ],
    cta: "Go Business",
    href: "/auth/signup?plan=business",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Nest</h1>
          <p className="text-xl text-muted-foreground">
            Start free, upgrade when you&apos;re ready
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <NestCard
              key={plan.name}
              className={`relative ${plan.popular ? 'border-2 border-primary shadow-lg scale-105' : ''} animate-nest-settle`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <NestCardHeader>
                <NestCardTitle className="text-2xl">{plan.name}</NestCardTitle>
                <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </NestCardHeader>
              <NestCardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="block">
                  <NestButton
                    variant={plan.popular ? "primary" : "outline"}
                    className="w-full"
                    withNest={plan.popular}
                  >
                    {plan.cta}
                  </NestButton>
                </Link>
              </NestCardContent>
            </NestCard>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            All plans include our beautiful nest-themed interface and world-class support
          </p>
        </div>
      </div>
    </div>
  );
}
