import React, { useContext } from "react";
import { AuthContext } from "../context/auth.context";

function HomePage() {
  const imageUrl =
    "https://res.cloudinary.com/dse6ivx7u/image/upload/f_auto,q_auto/v1/Collab%20Chronicles/sftle6eu66n6ujhzs7x1";
  const { user } = useContext(AuthContext);

  return (
    <>
      <h1>Home Page</h1>
      <div className="homepage">
        <img src={imageUrl} alt="Cover-up Story" className="responsive-image" />
        {user && <h2>Welcome to Collab Chronicles, {user.username}!</h2>}
      </div>
    </>
  );
}

export default HomePage;
