import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function MyStoriesPage() {
  const [stories, setStories] = useState([]);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const getAllStories = () => {
    const storedToken = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/stories/${user._id}/finished`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        console.log(response.data);
        setStories(response.data);
        console.log(setStories);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllStories();
  }, [location]);

  return (
    <div className="MyStoriesPage">
      {stories.map((story, index) => (
        <div key={index}>
          <h2>{story.title}</h2>
          <Link to={`/stories/${story._id}`}>Listen</Link>
        </div>
      ))}
    </div>
  );
}

export default MyStoriesPage;
