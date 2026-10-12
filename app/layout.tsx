import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Jayhun Choyxona", description: "Milliy taomlar va mehmondo‘stlik." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="uz"><body>{children}</body></html>;
}
