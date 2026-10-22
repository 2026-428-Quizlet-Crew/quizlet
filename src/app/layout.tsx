import type { Metadata } from "next";
import type { ReactNode } from "react";
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
      <head>
        <link rel="icon" type="image/svg+xml" href="q-plus-plus-logo.svg" />
      </head>
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
