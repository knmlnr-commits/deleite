import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Casa Deleite CMS",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
