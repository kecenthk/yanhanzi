import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "官网后台", template: "%s｜艳汉子官网后台" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
