import "./globals.css";
import { LangProvider } from "@/context/LangContext";
import { BrandProvider } from "@/context/BrandContext";
import MetaPixel from "@/components/MetaPixel";

export const metadata = {
  title: "Valley Seeds | Premium Vegetable Seeds",
  description:
    "Valley Seeds is Egypt's leading importer of elite vegetable seeds. Connecting global agricultural innovation with Egyptian farmers since 2018.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <BrandProvider>
          <LangProvider>
            {children}
          </LangProvider>
        </BrandProvider>
        {/* MetaPixel: client component — fires PageView on public site load,
            Lead on contact form submit. No-op when metaPixelId is not set. */}
        <MetaPixel />
      </body>
    </html>
  );
}
