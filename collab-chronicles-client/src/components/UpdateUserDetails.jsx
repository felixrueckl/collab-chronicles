import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function UpdateUserDetails({ userId }) {
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { authenticateUser } = useContext(AuthContext);

  const handleDetailsChange = () => {
    const storedToken = localStorage.getItem("authToken");
    let updateObject = {};

    if (newPassword !== "") updateObject.password = newPassword;
    if (newUsername !== "") updateObject.username = newUsername;
    if (newEmail !== "") updateObject.email = newEmail;

    axios
      .put(`${API_URL}/api/users/${userId}`, updateObject, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        console.log(response.data);
        setUpdateSuccess(true);
        setNewUsername("");
        setNewEmail("");
        setNewPassword("");
        authenticateUser();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h3>Change Username:</h3>
      <input
        type="text"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />

      <h3>Change Email:</h3>
      <input
        type="email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />

      <h3>Change Password:</h3>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button onClick={handleDetailsChange}>Update Details</button>
      {updateSuccess && <p>User details updated successfully.</p>}
    </div>
  );
}

export default UpdateUserDetails;
