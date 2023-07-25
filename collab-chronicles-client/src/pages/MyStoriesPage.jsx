import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function MyStoriesPage() {
  console.log("MyStoriesPage rendered");
  const [stories, setStories] = useState([]);
  const { user } = useContext(AuthContext);

  const getAllStories = () => {
    const storedToken = localStorage.getItem("authToken");

    axios
      .get(`${API_URL}/api/stories/${user._id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        console.log(response.data);
        setStories(response.data);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    console.log(user);
    getAllStories();
  }, []);

  return (
    <div className="MyStoriesPage">
      {stories.map((story) => (
        <div key={story._id}>
          <Link to={`/stories/${story._id}`}>
            <h3>{story.title}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default MyStoriesPage;
