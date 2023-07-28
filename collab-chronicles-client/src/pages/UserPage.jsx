import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import UpdateUserDetails from "../components/UpdateUserDetails";

const API_URL = "http://localhost:5005";

function UserPage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="ProfileCard">
      <h2>Profile</h2>
      <div className="ProfileUsername">
        <h3>Username: {user && user.username}</h3>
      </div>
      <div className="ProfileEmail">
        <h3>Email: {user && user.email}</h3>
      </div>
      <div className="ProfilePassword">
        <UpdateUserDetails userId={user._id} />
      </div>
    </div>
  );
}
export default UserPage;
