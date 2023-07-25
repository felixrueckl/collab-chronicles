import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5005";

function UpdatePassword({ userId }) {
  const [newPassword, setNewPassword] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handlePasswordChange = () => {
    const storedToken = localStorage.getItem("authToken");

    axios
      .put(
        `${API_URL}/api/users/${userId}`,
        { password: newPassword },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      )
      .then((response) => {
        console.log(response.data);
        setUpdateSuccess(true);
        setNewPassword("");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h3>Change Password:</h3>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handlePasswordChange}>Update Password</button>
      {updateSuccess && <p>Password updated successfully.</p>}
    </div>
  );
}

export default UpdatePassword;
