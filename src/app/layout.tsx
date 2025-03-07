import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DONCKERS Florian - WEB développeur",
  description: "Portfolio de DONCKERS Florian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
