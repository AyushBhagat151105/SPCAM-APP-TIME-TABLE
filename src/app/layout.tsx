import type { Metadata } from "next";
import "./globals.css";
import {ThemeProvider} from "next-themes";

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
          </ThemeProvider>
          </body>
          </html>
      </>
  );
}
