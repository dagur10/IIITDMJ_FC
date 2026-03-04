"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function GoogleAuthLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    // 1. Grab the token Google put in the URL
    const accessToken = searchParams.get("access_token");
    if (!accessToken) return;

    // 2. Send it to Strapi for verification
    const authenticateWithStrapi = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${backendUrl}/api/auth/google/callback?access_token=${accessToken}`);
        const data = await response.json();

        if (data.jwt) {
          // 3. Success! Save the Strapi JWT and User Info securely
          // Using localStorage for simplicity (you can upgrade to HTTP-only cookies later)
          localStorage.setItem("jwt", data.jwt);
          localStorage.setItem("user", JSON.stringify(data.user));

          // 4. Redirect the logged-in user to the club dashboard
          router.push("/dashboard"); 
        } else {
          setError("Authentication failed. Please try again.");
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("An error occurred during login.");
      }
    };

    authenticateWithStrapi();
  }, [searchParams, router]);

  if (error) return <div className="text-red-500 text-center mt-10 font-bold">{error}</div>;

  return (
    <div className="text-green-600 mt-10 text-center text-lg font-semibold">
      Finalizing your login...
    </div>
  );
}

export default function RedirectPage() {
  return (
    <Suspense fallback={<div className="mt-10 text-center text-green-600">Loading...</div>}>
      <GoogleAuthLogic />
    </Suspense>
  );
}