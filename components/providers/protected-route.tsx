"use client";

import { useAuth } from "./auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (adminOnly && role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, role, loading, router, adminOnly]);

  if (loading || !user || (adminOnly && role !== "admin")) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground animate-pulse font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
