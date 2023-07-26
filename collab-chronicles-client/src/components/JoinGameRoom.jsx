import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5005";

const JoinGameRoom = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const joinStory = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");

        const response = await axios.put(
          `${API_URL}/api/gameroom/${storyId}/join`,
          {},
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );

        if (response.status === 200) {
          navigate(`/gameroom/${storyId}`);
        }
      } catch (error) {
        console.error("Error joining story:", error);
      }
    };

    joinStory();
  }, [storyId, navigate]);

  return <p>Joining story...</p>;
};

export default JoinGameRoom;
