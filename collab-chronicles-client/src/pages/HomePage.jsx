import React, { useContext } from "react";
import { AuthContext } from "../context/auth.context";

function HomePage() {
  const imageUrl =
    "https://res.cloudinary.com/dse6ivx7u/image/upload/f_auto,q_auto/v1/Collab%20Chronicles/sftle6eu66n6ujhzs7x1";
  const { user } = useContext(AuthContext);

  return (
    <>
      {!user && <h1>Welcome to Collab Chronicles</h1>}
      {user && <h1>Welcome back, {user.username}!</h1>}
      <div className="homepage">
        <img src={imageUrl} alt="Cover-up Story" className="responsive-image" />
        {!user && <h2>Unleashe Your Creativity:</h2>}
        {!user && (
          <h2>
            Join the Collab Chronicles for Fun-filled Storytelling Adventures!
          </h2>
        )}
        {user && <h2>You opened the Gateway to Creativity:</h2>}
        {user && <h2>Begin Your Storytelling Adventure now.</h2>}
      </div>
    </>
  );
}

export default HomePage;
