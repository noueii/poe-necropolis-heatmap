import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from 'next/headers'
import CookieConsent from "@/components/app/CookieConsent";
const inter = Inter({ subsets: ["latin"] });
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: "noueii's Graveyard Simulator",
  description: "PoE Graveyard Simulator",
};

export default function RootLayout({ children }) {
  const cookieStore = cookies()
  let ccu = cookieStore.get('ccu')
  
  
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
        {!ccu && <CookieConsent/>}
      </body>
    </html>
  );
}
