import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

// custom hook for using the auth context
// this will return the authentication state to the components
// and if the user is not logged in then it will throw an error
export const useAuth = () => {
  const context = useContext(AuthContext);
  //if the context is undefined then it will throw an error
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
