import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase"
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const userAuthContext = createContext();

export function UserAuthContextProvider({children}){

    const [token, setToken] = useState('')

    useEffect(()=>{

        auth.onIdTokenChanged((e)=>{
            const token = e.getIdToken().then((token)=>{
                setToken(token)
            });
        })
        
    }, [])

    const sendOtp = async (phone) => {

        const recaptchaVerifier = new RecaptchaVerifier(
            'recaptcha-container',
            {}, 
            auth
        );

        recaptchaVerifier.render()
        
       return await signInWithPhoneNumber(auth, phone, recaptchaVerifier)
    }

    const value = {
        sendOtp,
        token
    }

    return(
        <userAuthContext.Provider value={value}>
            {children}
        </userAuthContext.Provider>
    )
};

export function useAuth(){
    return useContext(userAuthContext)
}