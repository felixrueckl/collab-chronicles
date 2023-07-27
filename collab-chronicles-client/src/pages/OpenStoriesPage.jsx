import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import io from "socket.io-client";
import axios from "axios";

const API_URL = "http://localhost:5005";
const SOCKET_URL = "http://localhost:5005";

const socket = io(SOCKET_URL);

function OpenStoriesPage() {
  const [stories, setStories] = useState([]);
  const storedToken = localStorage.getItem("authToken");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const joinStory = async (storyId) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/gameroom/${storyId}/join`,
        { userId: user._id },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      if (response.status === 200) {
        // Emit the joinRoom event after the REST API call has successfully completed
        socket.emit("joinRoom", { storyId, userId: user._id });

        // Navigate to the game room
        navigate(`/gameroom/${storyId}`);
      }
    } catch (error) {
      console.error("Error joining story:", error);
    }
  };

  useEffect(() => {
    // call the API to fetch open stories and set them in state
    fetchOpenStories();
  }, []);

  const fetchOpenStories = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/gameroom/user/${user._id}/stories/open`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const stories = await response.json();
      setStories(stories);
    } catch (error) {
      // Log the error to console (or handle it in some other way)
      console.error("Failed to fetch open stories:", error);
    }
  };

  return (
    <div>
      <h1>Open Stories</h1>
      {stories.map((story) => (
        <div key={story.id}>
          <h2>{story.title}</h2>
          {/* The Link component here should lead to a route that lets the user join the story */}
          <Link
            to={`/gameroom/${story.id}`}
            onClick={() => {
              joinStory(story.id);
            }}
          >
            Join this Story
          </Link>
        </div>
      ))}
    </div>
  );
}

export default OpenStoriesPage;
