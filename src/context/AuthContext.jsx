import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isInsider, setIsInsider] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('isInsider') === 'true') {
            setIsInsider(true);
        }
    }, []);

    const login = () => {
        sessionStorage.setItem('isInsider', 'true');
        setIsInsider(true);
    };

    const value = { isInsider, login };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};