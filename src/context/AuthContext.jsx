import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isInsider, setIsInsider] = useState(() => {
        return localStorage.getItem('isInsider') === 'true';
    });

    const [accessGranted, setAccessGranted] = useState(() => {

        return localStorage.getItem('accessGranted') === 'true';
    });

    const login = () => {
        localStorage.setItem('isInsider', 'true');
        setIsInsider(true);
    };

    const grantAccess = () => {
        localStorage.setItem('accessGranted', 'true');
        setAccessGranted(true);
    };
    const value = { 
        isInsider, 
        login, 
        accessGranted, 
        grantAccess 
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};