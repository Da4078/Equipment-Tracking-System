import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import keycloak from '../auth/keycloak';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        keycloak
            .init({
                onLoad: 'check-sso',
                checkLoginIframe: false,
                pkceMethod: 'S256'
            })
            .then((authenticated) => {
                console.log('Keycloak initialized. Authenticated:', authenticated);
                setIsAuthenticated(authenticated);
                if (authenticated) {
                    extractUserData();
                }
            })
            .catch((error) => {
                console.error('Keycloak Init Error:', error);
            })
            .finally(() => {
                setLoading(false);
            });

        keycloak.onTokenExpired = () => {
            keycloak
                .updateToken(30)
                .then((refreshed) => {
                    if (refreshed) {
                        extractUserData();
                    }
                })
                .catch(() => {
                    logout();
                });
        };
    }, []);

    const extractUserData = () => {
        const parsed = keycloak.tokenParsed || {};

        const realmRoles = parsed.realm_access?.roles || [];
        const clientRoles = parsed.resource_access?.[keycloak.clientId]?.roles || [];

        const allRoles = Array.from(new Set([...realmRoles, ...clientRoles]));

        setUser({
            id: parsed.sub,
            email: parsed.email || parsed.preferred_username || '',
            name: parsed.name || parsed.preferred_username || 'User',
            roles: allRoles
        });
    };

    const login = () => {
        return keycloak.login({
            redirectUri: window.location.origin + '/'
        });
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        return keycloak.logout({
            redirectUri: window.location.origin + '/login'
        });
    };

    const getToken = async () => {
        try {
            await keycloak.updateToken(30);
            return keycloak.token;
        } catch (error) {
            console.error('Failed to refresh Keycloak token:', error);
            logout();
            return null;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                login,
                logout,
                getToken,
                keycloak
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};