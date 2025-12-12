"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AuthRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing Google Login...");

  useEffect(() => {
    let isMounted = true;

    const handleLogin = async () => {
      // 1. Get the Google Access Token from the URL
      const googleAccessToken = searchParams.get('access_token');

      if (!googleAccessToken) {
        setStatus("Error: No Google token found.");
        return;
      }

      try {
        setStatus("Authenticating with Server...");

        // 2. EXCHANGE STEP: Send Google token to Strapi to get a Strapi JWT
        const strapiResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}/api/auth/google/callback?access_token=${googleAccessToken}`
        );

        if (!strapiResponse.ok) {
          throw new Error(`Strapi authentication failed: ${strapiResponse.statusText}`);
        }

        const data = await strapiResponse.json();
        // The data object looks like: { jwt: "...", user: { ... } }

        if (!data.jwt) {
          throw new Error("Server didn't return a JWT.");
        }

        console.log("Login Success! Strapi Token received.");

        // 3. Save the REAL Strapi Token
        Cookies.set('jwt', data.jwt, { expires: 7, secure: true, sameSite: 'Strict' });
        Cookies.set('userData', JSON.stringify(data.user), { expires: 7 });

        // 4. Redirect to Profile
        if (isMounted) {
            setStatus("Success! Redirecting...");
            router.push('/profile');
        }

      } catch (err) {
        console.error("Login Error:", err);
        if (isMounted) {
            setStatus(`Login Failed: ${err.message}`);
        }
      }
    };

    handleLogin();

    return () => { isMounted = false; };
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-blue-900">
      <div className="text-2xl font-bold mb-4">Finalizing Login...</div>
      <div className="text-sm bg-gray-100 p-4 rounded border font-mono text-gray-700">
        Status: <span className="font-semibold text-blue-600">{status}</span>
      </div>
      <div className="mt-6 animate-spin rounded-full h-10 w-10 border-b-4 border-blue-900"></div>
    </div>
  );
}