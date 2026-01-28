"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSession } from "@/actions/auth";

interface User {
    id: number;
    name: string;
    role: string;
    email: string;
}

interface SessionContextType {
    user: User | null;
    refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
    user: null,
    refreshSession: async () => { },
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const refreshSession = async () => {
        try {
            // We need a client-safe way to get session or pass it from server component
            // For simplicity in this structure, we might need a server wrapper or just fetch an API
            // But since getSession is a server action, we can call it? 
            // Server actions can be imported in client components in Next.js 14+ specific cases but usually for event handlers.
            // Let's rely on a Prop passed from Layout or similar, OR use a useEffect with a server action if allowed.
            // Actually, calling server action from useEffect is fine.
            const session = await getSession();
            setUser(session);
        } catch (err) {
            console.error("Failed to fetch session", err);
        }
    };

    useEffect(() => {
        refreshSession();
    }, []);

    return (
        <SessionContext.Provider value={{ user, refreshSession }}>
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => useContext(SessionContext);
