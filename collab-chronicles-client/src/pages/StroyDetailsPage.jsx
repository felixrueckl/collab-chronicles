import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import AddComment from "../components/AddComment";
import CommentCard from "../components/CommentCard";

const API_URL = "http://localhost:5005";

function StoryDetailsPage(props) {
  const [story, setStory] = useState(null);
  const { storyId } = useParams();

  const getStory = () => {
    const storedToken = localStorage.getItem("authToken");

    axios
      .get(`${API_URL}/api/stories/${storyId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        const oneStory = response.data;
        setStory(oneStory);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getStory();
  }, []);

  return (
    <div className="StoryDetails">
      {story ? (
        <>
          <h1>{story.title}</h1>
          <p>{story.text}</p>

          {story.comments &&
            story.comments.map((comment) => (
              <CommentCard key={comment._id} {...comment} />
            ))}
        </>
      ) : (
        <p>Loading...</p>
      )}

      <AddComment refreshStories={getStory} projectId={storyId} />

      <Link to="/stories">
        <button>Back</button>
      </Link>

      <Link to={`/stories/edit/${storyId}`}>
        <button>Edit Story</button>
      </Link>
    </div>
  );
}

export default StoryDetailsPage;
