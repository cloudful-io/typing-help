"use client";
import { ModeProvider } from "@/contexts/ModeContext";
import { ClassProvider } from "@/contexts/ClassContext";
import GoogleAnalytics from "@/app/(DashboardLayout)/components/shared/GoogleAnalytics";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleAnalytics />
      <ModeProvider>
        <ClassProvider>{children}</ClassProvider>
      </ModeProvider>
    </>
  );
}