import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Providers from "../providers/Providers";

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-bengali",
});

export const metadata = {
  title: "School Management System",
  description: "Developed by Sadman Sakib",
  icons: {
    icon: "./favicon.svg", // Place the file in your /public folder
    // apple: "/apple-touch-icon.png", // Optional for iOS
  },
};

export default function RootLayout({ children }) {


  return (
    <html lang="bn" data-theme="indigo">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      </head>
      
      <body
        className={`${notoBengali.variable} antialiased`}
      >

        <Providers>{children}</Providers>

      </body>
    </html>
  );
}
