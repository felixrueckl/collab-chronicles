import React, { useState, useEffect } from "react";
import axios from "axios";
const API_URL = "http://localhost:5005";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  const authenticateUser = async () => {
    return new Promise((resolve, reject) => {
      // Get the stored token from the localStorage
      const storedToken = localStorage.getItem("authToken");

      // If the token exists in the localStorage
      if (storedToken) {
        axios
          .get(`${API_URL}/auth/verify`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          })
          .then((response) => {
            // If the server verifies that the JWT token is valid
            const user = response.data;
            // Update state variables
            setIsLoggedIn(true);
            setIsLoading(false);
            setUser(user);
            resolve(); // Resolve the promise after successful authentication
          })
          .catch((error) => {
            // If the server sends an error response (invalid token)
            // Update state variables
            setIsLoggedIn(false);
            setIsLoading(false);
            setUser(null);
            reject(error); // Reject the promise if authentication fails
          });
      } else {
        // If the token is not available (or is removed)
        setIsLoggedIn(false);
        setIsLoading(false);
        setUser(null);
        resolve(); // Resolve the promise if there is no token
      }
    });
  };

  const removeToken = () => {
    // Upon logout, remove the token from the localStorage
    localStorage.removeItem("authToken");
  };

  const logOutUser = () => {
    // To log out the user, remove the token
    removeToken();
    // and update the state variables
    authenticateUser();
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };
