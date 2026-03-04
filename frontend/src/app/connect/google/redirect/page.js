"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';

function GoogleAuthLogic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    // 1. Grab the official Strapi JWT that Strapi put in the URL
    const jwt = searchParams.get("access_token");
    
    if (!jwt) return;

    // 2. We have the token! Now fetch the user's profile details
    const fetchUserProfile = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL;
        
        // Ask Strapi "Who am I?" using the new token
        const response = await fetch(`${backendUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        
        const user = await response.json();

        if (user && user.id) {
          // 3. Success! Save the token and user info in the browser
          localStorage.setItem("jwt", jwt);
          localStorage.setItem("user", JSON.stringify(user));

          // 4. Redirect the logged-in user to the club homepage or dashboard
          router.push("/"); // Change this to "/dashboard" if you have a dashboard page
        } else {
          setError("Failed to load user profile.");
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("An error occurred during login.");
      }
    };

    fetchUserProfile();
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