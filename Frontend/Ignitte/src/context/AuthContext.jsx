import { useState, useEffect } from 'react';
import { authAPI } from '@/utils/api';
import { AuthContext } from './authContext';

//This is the auth provider which will provide the auth to the all the components 
// which are wrapped inside the AuthProvider and its children
export const AuthProvider = ({ children }) => {
  //user is the user who is logged in and it can be anything
  const [user, setUser] = useState(null);
  //isLoading is a boolean which will tell us whether the user is logged in or not
  const [isLoading, setIsLoading] = useState(true);

  //This function is used to check the authentication of the user
  //and it is called only once when the component is mounted
  useEffect(() => {
    checkAuth();
  }, []);


  const checkAuth = async () => {
    try {
      //get token from local storage
      const token = localStorage.getItem('accessToken');
      //if token is present then check the authentication of the user
      if (token) {
        // make the API request and set the user
        const response = await authAPI.getCurrentUser();
        setUser(response.data.user);
      }
    }
    catch (error) {
      //for safety purpose remove the access token from the local storage
      localStorage.removeItem('accessToken');
      setUser(null);
      console.log(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  //login function
  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });

    if (response.data && response.data.data) {
      //store the token in local storage
      localStorage.setItem('accessToken', response.data.data.accessToken);
      const user = response.data.data.user;
      setUser(user);
      return user; // <--- Return the user here
    }
    throw new Error("Login failed");
  };

  // register function:
  const register = async (fullName, email, password, department, phone, rollNumber) => {
    // Notice the keys match what the backend expects
    const response = await authAPI.register({ fullName, email, password, department, phone, rollNumber });

    if (response.data && response.data.data) {
      //store the token in local storage
      localStorage.setItem('accessToken', response.data.data.accessToken);
      setUser(response.data.data.user);
    }
  };

  //logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    }
    catch (error) {
      console.error('Logout error:', error);
    }
    finally {
      //remove the token from local storage
      localStorage.removeItem('accessToken');
      //remove the user from state
      setUser(null);
    }
  };

  return (
    // AuthContext.Provider is used to provide the authentication state to the children components
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};