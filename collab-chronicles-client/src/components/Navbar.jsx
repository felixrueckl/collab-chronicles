import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">
        <button>Home</button>
      </Link>

      {isLoggedIn && (
        <>
          <Link to="/new">
            <button>New Story</button>
          </Link>

          <Link to={`/gameroom/user/${user._id}/stories/open`}>
            <button>Join Story</button>
          </Link>

          <Link to={`/users/${user._id}/stories`}>
            <button>My Stories</button>
          </Link>

          <Link to={`/users/${user._id}`}>
            <button>My Profile</button>
          </Link>

          <button onClick={logOutUser}>Logout</button>
        </>
      )}

      {!isLoggedIn && (
        <>
          <Link to="/signup">
            {" "}
            <button>Sign Up</button>{" "}
          </Link>
          <Link to="/login">
            {" "}
            <button>Login</button>{" "}
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
