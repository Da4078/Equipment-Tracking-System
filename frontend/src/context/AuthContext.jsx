import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() =>
        localStorage.getItem('token')
    );

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');

        if (!savedUser) {
            return null;
        }

        try {
            return JSON.parse(savedUser);
        } catch {
            localStorage.removeItem('user');
            return null;
        }
    });

    const login = (authToken, userData) => {
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));

        setToken(authToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAuthenticated: Boolean(token)
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}