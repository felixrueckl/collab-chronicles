import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import io from "socket.io-client";

const API_URL = "http://localhost:5005";
const SOCKET_URL = "http://localhost:5005";

const socket = io(API_URL);

const JoinGameRoom = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const joinStory = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");

        const storyResponse = await axios.get(
          `${API_URL}/api/gameroom/story/${storyId}`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        console.log("Story Response:", storyResponse.data);
        console.log(user);
        const response = await axios.put(
          `${API_URL}/api/gameroom/${storyId}/join`,
          { userId: user._id },
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        console.log("Join Story Response:", response.data);

        if (response.status === 200) {
          navigate(`/gameroom/${storyId}`);

          // Emit joinRoom event
          socket.emit("joinRoom", { storyId, userId: user._id });
        }
      } catch (error) {
        console.error("Error joining story:", error);
      }
    };

    joinStory();

    // Handle socket events
    socket.on("userJoined", (data) => {
      console.log("A user has joined the room:", data);
    });

    // Disconnect socket when component unmounts
    return () => socket.disconnect();
  }, [storyId, navigate, user]);

  return <p>Joining story...</p>;
};

export default JoinGameRoom;
