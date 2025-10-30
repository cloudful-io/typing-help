// app/providers.tsx  (Client Component)
"use client";

import { ThemeModeProvider } from "@/contexts/ThemeModeContext";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "@/utils/createEmotionCache";
import ClientProviders from "./clientProviders";

const clientSideEmotionCache = createEmotionCache();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CacheProvider value={clientSideEmotionCache}>
        <ThemeModeProvider>
          <ClientProviders>{children}</ClientProviders>
        </ThemeModeProvider>
      </CacheProvider>
    </>
  );
}