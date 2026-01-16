import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider =({children})=>{


    const [login,setLogin] =useState(false);

    const loginIt =()=>{

        const token = sessionStorage.getItem("token");

        sessionStorage.setItem("token",token);

        setLogin(true);

    }

    const logoutIt = ()=>{

        const token =localStorage.getItem("token");

        localStorage.removeItem("token",token);

        setLogin(false);

    }

    return (
        <AuthContext.Provider value={{login,loginIt,logoutIt,}}>
            
            {children}
          
        </AuthContext.Provider>
    )

}


