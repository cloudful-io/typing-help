// app/providers.tsx  (Client Component)
"use client";

import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GoogleAnalytics from "@/app/(DashboardLayout)/components/shared/GoogleAnalytics";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleAnalytics />
      <ThemeProvider theme={baselightTheme}>
        <CssBaseline />
          {children}
      </ThemeProvider>
    </>
  );
}
