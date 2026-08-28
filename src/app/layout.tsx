import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { CartDrawer } from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Nuvana - Premium Dry Fruits & Nuts",
  description: "Freshly packed dry fruits and nuts, sourced directly from the best farms around the world.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
