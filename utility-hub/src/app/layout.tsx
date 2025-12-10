import "@/app/styles/globals.css";
import type { ReactNode } from "react";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body lang="en">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}