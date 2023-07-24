// src/components/AddTask.jsx

import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5005";

function AddComment(props) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const { userId, storyId } = props;
    const text = comment;
    const requestBody = { userId, storyId, text };
    const storedToken = localStorage.getItem("authToken");

    axios
      .post(`${API_URL}/api/comments`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        setComment("");
        props.refreshStories();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="AddComment">
      <h3>Add New Comment</h3>

      <form onSubmit={handleSubmit}>
        <label>Comment:</label>
        <input
          type="text"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
}

export default AddComment;
