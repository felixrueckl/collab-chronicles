import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5005";

function EditStoryPage(props) {
  const [title, setTitle] = useState("");
  const { storyId } = useParams();
  const storedToken = localStorage.getItem("authToken");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/stories/${storyId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        const oneStory = response.data;
        setTitle(oneStory.title);
      })
      .catch((error) => console.log(error));
  }, [storyId]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const requestBody = { title };

    axios
      .put(`${API_URL}/api/stories/${storyId}`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        navigate(`/stories/${storyId}`);
      });
  };

  const deleteStory = () => {
    axios
      .delete(`${API_URL}/api/stories/${storyId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(() => {
        navigate("/stories");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="EditStoryPage">
      <h3>Edit the Story</h3>

      <form onSubmit={handleFormSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input type="submit" value="Submit" />
      </form>

      <button onClick={deleteStory}>Delete Story</button>
    </div>
  );
}

export default EditStoryPage;
