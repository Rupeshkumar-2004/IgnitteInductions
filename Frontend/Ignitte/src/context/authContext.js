import { createContext } from 'react';

//Authcontext 
export const AuthContext = createContext(undefined);

//why we have two files Authcontext and AuthContext.jsx
//because it is good practice to have a separate file for the context
//which will provide the authentication state to the children components