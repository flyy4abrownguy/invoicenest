import { NestLogoWithText } from "@/components/nest/nest-logo";
import Link from "next/link";
import { Home, FileText, Users, Settings, Repeat } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { LogoutButton } from "@/components/dashboard/logout-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/dashboard">
            <NestLogoWithText />
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Your Nest</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/invoices"
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Invoices</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/recurring-invoices"
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                <Repeat className="w-5 h-5" />
                <span className="font-medium">Recurring</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/clients"
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Clients</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-border">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-8 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
