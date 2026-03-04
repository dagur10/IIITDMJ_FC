"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// 1. Move your main logic into a separate component
function GoogleAuthHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Your logic to grab the token from the URL and send it to Strapi goes here
    const accessToken = searchParams.get("access_token");
    
    if (accessToken) {
      // Handle login, save cookie, then redirect to dashboard
    }
  }, [searchParams, router]);

  return <div className="text-green-600 flex justify-center mt-10">Authenticating with Google...</div>;
}

// 2. Wrap that component in Suspense in your default export
export default function RedirectPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <GoogleAuthHandler />
    </Suspense>
  );
}