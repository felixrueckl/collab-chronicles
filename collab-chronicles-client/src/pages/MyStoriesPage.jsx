import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import StoryCard from "../components/StoryCard";

const API_URL = "http://localhost:5005";

function MyStoriesPage() {
  const [stories, setStories] = useState([]);

  const getAllStories = () => {
    const storedToken = localStorage.getItem("authToken");

    axios
      .get(`${API_URL}/api/stories`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setStories(response.data))
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getAllStories();
  }, []);

  return (
    <div className="MyStoriesPage">
      {stories.map((story) => (
        <StoryCard key={story._id} {...story} />
      ))}
    </div>
  );
}

export default MyStoriesPage;
