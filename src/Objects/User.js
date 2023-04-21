import { createContext } from 'react';
export const User = createContext({
    uid:'',
    firstName:'',
    lastName:'',
    gender:'',
    isDriver:false,
    profileImageUrl:'',
    loggedIn:false,
});