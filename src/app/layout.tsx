import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "./Providers";
import { AuthProvider } from "@/auth/AuthProvider";
import { DeckServiceProvider } from "@/hooks/DeckServiceProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Quizlet BB",
    default: "Quizlet BB",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <AuthProvider>
          <DeckServiceProvider>{children}</DeckServiceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
