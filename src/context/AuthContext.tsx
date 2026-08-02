import { createContext, type ReactNode, useState } from "react";
import { type User } from "@supabase/supabase-js";

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

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;