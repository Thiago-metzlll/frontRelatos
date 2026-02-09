import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/api';

interface User {
    id: number;
    nome: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in (e.g., by fetching profile or checking cookie)
        const checkAuth = async () => {
            try {
                // Here we could have an /auth/me endpoint
                // For now, let's assume if there's no error, we check localStorage for a hint
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                console.error('Auth check failed', error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (data: any) => {
        const response = await authService.login(data);
        const { user: userData, access_token } = response.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', access_token);
    };

    const register = async (data: any) => {
        await authService.register(data);
    };

    const logout = async () => {
        // Opcional: chamar o endpoint de logout do servidor se houver lógica lá
        try { await authService.logout(); } catch (e) { }
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
