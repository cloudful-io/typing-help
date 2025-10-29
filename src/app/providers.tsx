// app/providers.tsx  (Client Component)
"use client";

import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "@/utils/createEmotionCache";
import ClientProviders from "./clientProviders";

const clientSideEmotionCache = createEmotionCache();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CacheProvider value={clientSideEmotionCache}>
        <ThemeProvider theme={baselightTheme}>
          <CssBaseline />
          <ClientProviders>{children}</ClientProviders>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
}