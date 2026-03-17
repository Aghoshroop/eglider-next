import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Eglider - Top Swimwear Manufacturer",
  description: "Create an account with Eglider to join the elite tier of professional swimmers. Best swimwear manufacturer offering competitive racing suits.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
