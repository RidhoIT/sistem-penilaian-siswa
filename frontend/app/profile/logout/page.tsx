"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, { method: "POST", credentials: "include" })
      .finally(() => router.push("/auth/login"));
  }, []);
  return <div className="p-8">Logging out…</div>;
}
