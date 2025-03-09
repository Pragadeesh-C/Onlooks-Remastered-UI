"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Validate token by checking expiry
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        const isExpired = payload.exp * 1000 < Date.now();

        if (!isExpired) {
          router.push("/dashboard"); // Redirect to dashboard if token is valid
          return;
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }

    router.push("/login"); // Redirect to login if no valid token
  }, [router]);

  return null; // No UI needed since it redirects
}
