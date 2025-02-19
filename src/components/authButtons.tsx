"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
    const { data: session } = useSession();

    return (
        <div>
            {session ? (
                <button onClick={() => signOut()} className="bg-red-600 text-white px-4 py-2 rounded">
                    Logout
                </button>
            ) : (
                <button onClick={() => signIn()} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Sign In
                </button>
            )}
        </div>
    );
}
