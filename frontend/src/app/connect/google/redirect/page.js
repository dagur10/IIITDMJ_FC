"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// 1. Isolate the search params logic in its own component
function GoogleAuthLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    if (accessToken) {
      console.log("Token received:", accessToken);
      // Your Strapi fetch logic will go here
    }
  }, [searchParams, router]);

  return <div className="text-green-600 mt-10 text-center">Finalizing login...</div>;
}

// 2. Wrap that component in Suspense so Vercel's build doesn't crash
export default function RedirectPage() {
  return (
    <Suspense fallback={<div className="mt-10 text-center">Loading...</div>}>
      <GoogleAuthLogic />
    </Suspense>
  );
}