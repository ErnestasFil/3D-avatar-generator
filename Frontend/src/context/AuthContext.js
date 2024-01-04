import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect, useContext } from 'react';
const AuthContext = React.createContext();
export function useAuth() {
    return useContext(AuthContext);
}
export function AuthProvider(props) {
    const [user, setUser] = useState(null);
    const [access, setAccess] = useState(null);
    const [refresh, setRefresh] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loadingState, setLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem('access-token');
        setAccess(accessToken);
        const refreshToken = localStorage.getItem('refresh-token');
        setRefresh(refreshToken);
        if (accessToken) {
            const decoded = jwtDecode(accessToken);
            setUser(decoded.user_id);
            setIsLoggedIn(true);
        } else {
            setAccess(null);
            setRefresh(null);
        }
        setLoading(false);
    }, []);
    if (loadingState) return null;
    const login = (user) => {
        if (user) {
            setAccess(user['access-token']);
            localStorage.setItem('access-token', user['access-token']);
            setRefresh(user['refresh-token']);
            localStorage.setItem('refresh-token', user['refresh-token']);
            const decoded = jwtDecode(user['access-token']);
            setUser(decoded.user_id);
            setIsLoggedIn(true);
        } else {
            localStorage.removeItem('access-token');
            localStorage.removeItem('refresh-token');
            setAccess(null);
            setRefresh(null);
            setUser(null);
            setIsLoggedIn(false);
        }
        return login;
    };

    const value = {
        user,
        setUser,
        access,
        setAccess,
        refresh,
        setRefresh,
        isLoggedIn,
        setIsLoggedIn,
        login,
        loadingState
    };
    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}
