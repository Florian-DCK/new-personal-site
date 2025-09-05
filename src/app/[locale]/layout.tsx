import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";
import { Metadata } from "next";
import { Lexend, Raleway } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "DONCKERS Florian",
  description: "DONCKERS Florian's portfolio",
};

// const lexend = Lexend({
// 	subsets: ['latin'],
// 	display: 'swap',
// 	variable: '--font-lexend'
// });

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
  weight: ["400", "700"],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={` ${raleway.variable}`}>
      <body className="bg-amber-500">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
