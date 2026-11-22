'use client';

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Dashboard = () => {

    const {data: session, status} = useSession();
    const router = useRouter()
    useEffect(() => {
    if (status === "unauthenticated") {
        router.replace('/pages/login')
    }
    }, [status, router])

    if (status === "loading" || status === "unauthenticated") {
    return <p>Checking session...</p>
    }
    
    if (status === "authenticated" && session) {
        return ( 
        <div>
            <p>Welcome {session.user.name}</p>
            <Image alt="profile" width={50} height={50} src={session.user.image} className="rounded-full"/> <br />
            <button className="p-4 text-white font-bold rounded-lg bg-gray-600 hover:bg-gray-700 duration-75" onClick={() => signOut()}>Sign Out</button>
        </div>
     );
    }
    return null;
}
 
export default Dashboard;