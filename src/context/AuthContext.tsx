import {
    createContext,
    type ReactNode,
    useEffect,
    useState,
} from "react";

import type { User } from "@supabase/supabase-js";
import { supabase } from "../services/Supabase/supabaseClient";

type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProp = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProp) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            console.log("AUTH PROVIDER SESSION:", session);

            setUser(session?.user ?? null);
        };

        loadSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                console.log(
                    "AUTH STATE:",
                    _event,
                    session?.user?.id
                );

                setUser(session?.user ?? null);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;