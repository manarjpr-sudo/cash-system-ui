import { createContext, useState } from "react";


export const AuthContext = createContext();



export function AuthProvider({ children }) {


    const storedUser = localStorage.getItem("user");


    const [user, setUser] = useState(
        storedUser ? JSON.parse(storedUser) : null
    );



    const [token, setToken] = useState(
        localStorage.getItem("token") || null
    );







    const login = (data) => {


        const userData = {

            ...data.user,

            permissions: data.user?.permissions || []

        };



        localStorage.setItem(
            "token",
            data.token
        );



        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );



        setToken(data.token);

        setUser(userData);


    };







    const logout = () => {


        localStorage.removeItem("token");

        localStorage.removeItem("user");


        setToken(null);

        setUser(null);


    };









    const hasPermission = (permission) => {


        return (

            user?.permissions?.includes(permission)

        );


    };







    return (


        <AuthContext.Provider

            value={{

                user,

                token,

                login,

                logout,

                hasPermission,

                isAuthenticated: !!token

            }}

        >


            {children}


        </AuthContext.Provider>


    );

}