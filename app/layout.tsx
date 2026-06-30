import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "会う前のしおり",
  description: "誰かに話したかったことを、次に会う前にそっと思い出すアプリ。",
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
