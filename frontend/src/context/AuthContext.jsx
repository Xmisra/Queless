import { createContext, useState,useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function checkAuth() {
        try {
            const response = await api.get("/admin/me");

            setUser(response.data.admin);
        }
        catch {
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        checkAuth();
    },[]);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                checkAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
export { AuthContext, AuthProvider };
