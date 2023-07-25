import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5005";

function UpdateUsername({ userId }) {
  const [newUsername, setNewUsername] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleUsernameChange = () => {
    const storedToken = localStorage.getItem("authToken");

    axios
      .put(
        `${API_URL}/api/users/${userId}`,
        { username: newUsername },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      )
      .then((response) => {
        console.log(response.data);
        setUpdateSuccess(true);
        setNewUsername("");
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
      <button onClick={handleUsernameChange}>Update Username</button>
      {updateSuccess && <p>Username updated successfully.</p>}
    </div>
  );
}

export default UpdateUsername;
