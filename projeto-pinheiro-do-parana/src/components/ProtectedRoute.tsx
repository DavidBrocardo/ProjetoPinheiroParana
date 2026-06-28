import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChange } from "../services/authService";
import type { User } from "firebase/auth";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChange((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "#F8F5F0",
                color: "#1E3F20",
                fontFamily: "Inter, sans-serif"
            }}>
                <h3>Carregando...</h3>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
