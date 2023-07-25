import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5005";

function UpdateEmail({ userId }) {
  const [newEmail, setNewEmail] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleEmailChange = () => {
    const storedToken = localStorage.getItem("authToken");

    axios
      .put(
        `${API_URL}/api/users/${userId}`,
        { email: newEmail },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      )
      .then((response) => {
        console.log(response.data);
        setUpdateSuccess(true);
        setNewEmail("");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h3>Change Email:</h3>
      <input
        type="email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />
      <button onClick={handleEmailChange}>Update Email</button>
      {updateSuccess && <p>Email updated successfully.</p>}
    </div>
  );
}

export default UpdateEmail;
