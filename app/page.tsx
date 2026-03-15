"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-muted-foreground flex flex-col items-center gap-2">
        <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
        <p className="font-medium italic">Redirecting to platform...</p>
      </div>
    </div>
  );
}
