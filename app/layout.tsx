import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Afro Hair and Beauty Shop: Premium Black Hair & Beauty Products',
  description: 'Discover a wide range of premium black hair and beauty products at Afro Hair and Beauty Shop. Natural, organic, and specially curated for you. Shop now!',
  keywords: 'Afro Hair, Black Beauty, Natural Hair Care, Organic Beauty Products',
  robots: {
    follow: true,
    index: true,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
