"use client"

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/supabase/auth";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground w-full"
    >
      <LogOut className="w-5 h-5" />
      <span className="font-medium">Sign Out</span>
    </button>
  );
}
