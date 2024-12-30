import type { Metadata } from "next";
import "./globals.css";
import {ThemeProvider} from "next-themes";
import {Toaster} from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "SPCAM",
  description: "New generation new way to learn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
          <html lang="en" suppressHydrationWarning>
          <head />
          <body>
          <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
          >
              {children}
              <Toaster />
          </ThemeProvider>
          </body>
          </html>
      </>
  );
}
