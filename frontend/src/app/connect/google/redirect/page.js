"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';

function GoogleAuthLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    // 1. Grab the Google access token from the URL
    const accessToken = searchParams.get("access_token");
    
    if (!accessToken) return;

    // 2. Exchange the Google token for an official Strapi JWT
    const authenticateWithStrapi = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL;
        
        // This is the magic endpoint that creates the user in Strapi and logs them in!
        const response = await fetch(`${backendUrl}/api/auth/google/callback?access_token=${accessToken}`);
        const data = await response.json();

        if (data.jwt) {
          // 3. Success! Save the actual Strapi JWT and User Info in the browser
          localStorage.setItem("jwt", data.jwt);
          localStorage.setItem("user", JSON.stringify(data.user));

          // 4. Redirect to the homepage
          router.push("/"); 
        } else {
          setError("Authentication failed: Could not get Strapi token.");
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