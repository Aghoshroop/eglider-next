import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Eglider - Top Swimwear Manufacturer",
  description: "Sign in to your Eglider account to access your elite orders and wishlist. Eglider is the top swimwear manufacturer in Kolkata.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
