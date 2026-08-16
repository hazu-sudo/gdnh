import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "余韻の栞",
  description: "今すぐ送れない、でも忘れたくない気持ちを、あとで開けるしおりとして残すアプリ。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
