import type { Metadata } from "next";
import { Poppins, Anton } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "ENDOmind",
  description: "Association de patientes sur l'endométriose",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${poppins.variable} ${anton.variable}`}>
      <body>{children}</body>
    </html>
  );
}
