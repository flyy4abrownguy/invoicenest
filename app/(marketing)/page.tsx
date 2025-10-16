import { NestButton } from "@/components/nest/nest-button";
import { NestCard, NestCardContent, NestCardHeader, NestCardTitle } from "@/components/nest/nest-card";
import Link from "next/link";
import { CheckCircle, FileText, TrendingUp, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-weave">
              Your Invoices, Safely Nested
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-weave" style={{ animationDelay: '0.1s' }}>
              Create, organize, and manage professional invoices in one cozy place
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-weave" style={{ animationDelay: '0.2s' }}>
              <Link href="/auth/signup">
                <NestButton size="lg" withNest>
                  Build Your Nest (Start Free)
                </NestButton>
              </Link>
              <Link href="#features">
                <NestButton size="lg" variant="outline">
                  Learn More
                </NestButton>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">No credit card required • 5 invoices free forever</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Makes Our Nest Special</h2>
            <p className="text-lg text-muted-foreground">Everything you need to manage your invoices professionally</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <NestCard className="animate-nest-settle" style={{ animationDelay: '0s' }}>
              <NestCardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <NestCardTitle>Professional Invoices</NestCardTitle>
              </NestCardHeader>
              <NestCardContent>
                <p className="text-muted-foreground">
                  Create beautiful, professional invoices in minutes with our intuitive editor. Your invoices, perfectly nested.
                </p>
              </NestCardContent>
            </NestCard>

            <NestCard className="animate-nest-settle" style={{ animationDelay: '0.1s' }}>
              <NestCardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <NestCardTitle>Client Management</NestCardTitle>
              </NestCardHeader>
              <NestCardContent>
                <p className="text-muted-foreground">
                  Save client details for quick reuse. No more copy-pasting addresses and information.
                </p>
              </NestCardContent>
            </NestCard>

            <NestCard className="animate-nest-settle" style={{ animationDelay: '0.2s' }}>
              <NestCardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
                <NestCardTitle>Payment Tracking</NestCardTitle>
              </NestCardHeader>
              <NestCardContent>
                <p className="text-muted-foreground">
                  Track invoice status from draft to paid. Know exactly where your money is at all times.
                </p>
              </NestCardContent>
            </NestCard>

            <NestCard className="animate-nest-settle" style={{ animationDelay: '0.3s' }}>
              <NestCardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <NestCardTitle>Revenue Insights</NestCardTitle>
              </NestCardHeader>
              <NestCardContent>
                <p className="text-muted-foreground">
                  Visualize your revenue with beautiful charts and reports. See your nest grow over time.
                </p>
              </NestCardContent>
            </NestCard>

            <NestCard className="animate-nest-settle" style={{ animationDelay: '0.4s' }}>
              <NestCardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-secondary" />
                </div>
                <NestCardTitle>PDF Export</NestCardTitle>
              </NestCardHeader>
              <NestCardContent>
                <p className="text-muted-foreground">
                  Download professional PDFs with one click. Share invoices that look amazing.
                </p>
              </NestCardContent>
            </NestCard>

            <NestCard className="animate-nest-settle" style={{ animationDelay: '0.5s' }}>
              <NestCardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
                <NestCardTitle>Recurring Billing</NestCardTitle>
              </NestCardHeader>
              <NestCardContent>
                <p className="text-muted-foreground">
                  Set up recurring invoices and let them generate automatically. More time for you.
                </p>
              </NestCardContent>
            </NestCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your Nest?</h2>
          <p className="text-lg text-muted-foreground mb-8">Join thousands of businesses managing their invoices with InvoiceNest</p>
          <Link href="/auth/signup">
            <NestButton size="lg" withNest>
              Get Started for Free
            </NestButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
