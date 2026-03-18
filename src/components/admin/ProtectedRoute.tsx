"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Physical lock: Must be logged in AND must be the specific admin email
      if (!currentUser || currentUser.email?.toLowerCase() !== "egliderenterprise@gmail.com") {
        console.log("Access denied. Current user email:", currentUser?.email);
        router.push("/admin/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If user is null but it finished loading, the useEffect will push to /admin/login
  // So returning null here prevents a flash of content before redirect completes.
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
