
import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// REQUIRED USER TO ACCESS THESEP PAGES
const blacklistedPages = ['/dashboard', '/admin', '/login', '/usermanagement']

interface UserContextProps {
    user: User | null;
    login: (username: string) => void;
    validateUserAccess: (route: string) => void
    logout: () => void;
}

interface User {
    username: string;
}

export const UserContext = createContext<UserContextProps>({
    user: null,
    login: () => { },
    logout: () => { },
    validateUserAccess: () => { }
});

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const nav = useNavigate()
    const [user, setUser] = useState<User | null>(null);

    const login = (username: string) => {
        console.log('logging in: ', username)
        setUser({ username });
        nav(`/dashboard`)
    };


    const logout = () => {
        setUser(null);
        nav(`/login`)
    };

    const validateUserAccess = () => {
        if (user === null && blacklistedPages.includes(window.location.pathname)) {
            console.log('not logged in!')
            nav(`/login`)
        }
    }

    return (
        <UserContext.Provider value={{ user, login, logout, validateUserAccess }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
