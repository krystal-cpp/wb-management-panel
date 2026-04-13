import type { Metadata } from "next";
import { getSellerInfo, getSellerRating } from "@/api/seller";
import AntdRegistry from './AntdRegistry';
import AppHeader from './AppHeader';
import "./globals.css";

export const metadata: Metadata = {
  title: "WB Panel",
  description: "Панель управления магазином Wildberries",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sellerInfo, sellerRating] = await Promise.all([
    getSellerInfo(),
    getSellerRating()
  ])
  return (
    <html
      lang="ru">
      <body>
        <AntdRegistry>
          <AppHeader info={sellerInfo} rating={sellerRating}/>
          <main style={{ padding: '24px' }}>{children}</main>
        </AntdRegistry>
      </body>
    </html>
  );
}
