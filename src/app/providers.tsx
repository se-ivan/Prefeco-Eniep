// app/providers.tsx
"use client";

import { SWRConfig } from 'swr';
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const allowDarkTheme = pathname === "/";

  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then((res) => {
          if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
          }
          return res.json();
        }),
        dedupingInterval: 3000,
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        forcedTheme={allowDarkTheme ? undefined : "light"}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SWRConfig>
  );
}