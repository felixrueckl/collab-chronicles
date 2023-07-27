import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import io from "socket.io-client";
import axios from "axios";

const API_URL = "http://localhost:5005";
const SOCKET_URL = "http://localhost:5005";

function GameRoom() {
  const socketRef = useRef();
  const storedToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const { storyId } = useParams();
  const { user } = useContext(AuthContext);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyText, setStoryText] = useState("");
  const [sentence1, setSentence1] = useState("");
  const [sentence2, setSentence2] = useState("");
  const [lastSentence, setLastSentence] = useState("");
  const [currentTurn, setCurrentTurn] = useState(null);
  const [allAuthorsJoined, setAllAuthorsJoined] = useState(false);
  const [currentAuthorTurn, setCurrentAuthorTurn] = useState(null);
  const [isUserTurn, setIsUserTurn] = useState(false);

  const fetchStory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stories/${storyId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const story = response.data;
      console.log("Story Data:", story);
      setStoryTitle(story.title);
      setCurrentTurn(story.currentTurn);
      setAllAuthorsJoined(story.authors.length === story.maxAuthors);
      setCurrentAuthorTurn(story.currentAuthorTurn);

      /* if (isUserTurn) {
        setLastSentence("Not your turn.");
      } else if (!isUserTurn) {
        setLastSentence("It is your turn.");
      } */
      /*       if (
        story.authors.length === story.maxAuthors &&
        user._id === currentAuthorTurn
      ) {
        setLastSentence("It is.");
      }
      if (story.text.length > 0 && story.currentAuthorTurn === user._id) {
        setLastSentence(story.text[story.text.length - 1].text);
      } */
    } catch (error) {
      console.error("An error occurred while fetching the story: ", error);
    }
  };

  useEffect(() => {
    // Just call fetchStory inside useEffect
    fetchStory();

    socketRef.current = io(SOCKET_URL);
    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinRoom", { storyId });
    });

    socketRef.current.on("connect_error", (error) => {
      console.log("Connection Error: ", error);
      // handle error here
    });

    socketRef.current.on("connect_timeout", (timeout) => {
      console.log("Connection Timeout: ", timeout);
      // handle timeout here
    });

    socketRef.current.on("updateStory", (data) => {
      console.log("UpdateStory Event Data:", data);
      console.log("Current Author Turn:", data.currentAuthorTurn);
      console.log("User ID:", user._id);
      fetchStory();
    });

    socketRef.current.on("lastAuthorJoined", () => {
      console.log("LastAuthorJoined Event Triggered");
      fetchStory();
    });

    socketRef.current.on("refreshPage", () => {
      console.log("RefreshPage Event Triggered");
      fetchStory();
    });

    socketRef.current.on("storyUpdated", () => {
      console.log("StoryUpdated Event Triggered");
      fetchStory();
    });

    socketRef.current.on("endGame", (data) => {
      navigate(`/stories/${storyId}/read`);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (currentAuthorTurn && currentAuthorTurn.includes(user._id)) {
      setIsUserTurn(true);
    } else {
      setIsUserTurn(false);
    }
  }, [currentAuthorTurn, user]);

  const submitSentence = async (event) => {
    event.preventDefault();
    try {
      const submittedData1 = {
        userId: user._id,
        storyId: storyId,
        sentence1,
      };
      const submittedData2 = {
        userId: user._id,
        storyId: storyId,
        sentence2,
      };
      const submittedDataTurn = {
        userId: user._id,
        turn: currentTurn + 1,
        storyId: storyId,
      };
      // Making the POST request for the first sentence

      const response1 = await axios.post(
        `${API_URL}/api/sentences`,
        submittedData1,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      console.log("First sentence:", sentence1);

      // Making the POST request for the second sentence
      const response2 = await axios.post(
        `${API_URL}/api/sentences`,
        submittedData2,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      console.log("Second sentence:", sentence2);

      // PUT request to update the turn
      const response3 = await axios.put(
        `${API_URL}/api/gameroom/${storyId}/turn/`,
        submittedDataTurn,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      console.log("Turn update response:", response3.data);
      // Clearing the input fields after submission
      setSentence1("");
      setSentence2("");
      fetchStory();

      socketRef.current.emit("sentencesSubmitted", { storyId });
    } catch (error) {
      console.error(
        "An error occurred while submitting the sentences or updating the turn:",
        error
      );
    }
  };

  return (
    <div className="GameRoom">
      <h3>Title of your story:</h3>
      <h4> {storyTitle}</h4>
      <p>{lastSentence}</p>
      <p>user._id of the currentAuthor:{currentAuthorTurn}</p>
      {allAuthorsJoined &&
        currentAuthorTurn &&
        user._id &&
        currentAuthorTurn.toString() === user._id.toString() && (
          <form onSubmit={submitSentence}>
            <label>
              Sentence 1:
              <input
                type="text"
                value={sentence1}
                onChange={(e) => setSentence1(e.target.value)}
              />
            </label>
            <label>
              Sentence 2:
              <input
                type="text"
                value={sentence2}
                onChange={(e) => setSentence2(e.target.value)}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
        )}
      {currentAuthorTurn &&
        user._id &&
        currentAuthorTurn.toString() !== user._id.toString() && (
          <p>
            The story has started. Soon it will be your turn (again). Here are
            some tips:
          </p>
        )}
    </div>
  );
}

export default GameRoom;
