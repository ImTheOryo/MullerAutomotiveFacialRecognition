import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [adminToken, setAdminToken_] = useState(localStorage.getItem("adminToken"));
    const [userToken, setUserToken_] = useState(localStorage.getItem("userToken"));

    const setAdminToken = (newToken) => {
        setAdminToken_(newToken);
    };

    const setUserToken = (newToken) => {
        setUserToken_(newToken);
    };

    useEffect(() => {
        if (adminToken) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + adminToken;
            localStorage.setItem("adminToken", adminToken);
        } else if (userToken) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + userToken;
            localStorage.setItem("userToken", userToken);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem("adminToken");
            localStorage.removeItem("userToken");
        }
    }, [adminToken, userToken]);

    const contextValue = useMemo(
        () => ({
            adminToken,
            setAdminToken,
            userToken,
            setUserToken,
        }),
        [adminToken, userToken]
    );

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
