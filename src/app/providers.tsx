// app/providers.tsx  (Client Component)
"use client";

import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GoogleAnalytics from "@/app/(DashboardLayout)/components/shared/GoogleAnalytics";
import { CacheProvider } from "@emotion/react";
import { ModeProvider } from "@/contexts/ModeContext";
import { ClassProvider } from "@/contexts/ClassContext";
import createEmotionCache from "@/createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleAnalytics />
      <CacheProvider value={clientSideEmotionCache}>
        <ThemeProvider theme={baselightTheme}>
          <ModeProvider>
            <ClassProvider>
              <CssBaseline />
              {children}
            </ClassProvider>
          </ModeProvider>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
}