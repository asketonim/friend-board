import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Friend Board",
  description: "Visualize guitar notes, scales, and live pitch on a fretboard.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
