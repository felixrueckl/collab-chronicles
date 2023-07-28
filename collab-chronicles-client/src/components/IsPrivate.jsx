import { useContext, cloneElement } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";

function IsPrivate({ children, ...restProps }) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  // If the authentication is still loading
  if (isLoading) return <p>Loading ...</p>;

  if (!isLoggedIn) {
    // If the user is not logged in
    return <Navigate to="/login" />;
  } else {
    // If the user is logged in, allow to see the page
    return cloneElement(children, restProps);
  }
}

export default IsPrivate;
