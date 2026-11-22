'use client';

import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation";

function Login() {
  const { data: session, status } = useSession();
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.replace('/pages/dashboard')
    }
  }, [status, router])

  if (status === "loading" || status === "authenticated") {
    return <p>Checking session...</p>
  }

  if (status === "unauthenticated" || !session) {
  return (
    <div>
      Not signed in <br />
      <button className="p-4 text-white font-bold rounded-lg bg-gray-600 hover:bg-gray-700 duration-75" onClick={() => signIn()}>Sign in</button>
    </div>
    )
  }
  return null;
}

export default Login;