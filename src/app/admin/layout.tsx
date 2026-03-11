import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Vila Deleite CMS",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
