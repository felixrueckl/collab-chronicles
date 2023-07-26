import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import io from "socket.io-client";
import axios from "axios";

const API_URL = "http://localhost:5005";
const SOCKET_URL = "http://localhost:5005";

function GameRoom() {
  let socket;
  const storedToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const { storyId } = useParams();
  const { user } = useContext(AuthContext);
  console.log("User:", user);

  const [storyText, setStoryText] = useState("");
  const [sentence1, setSentence1] = useState("");
  const [sentence2, setSentence2] = useState("");
  const [lastSentence, setLastSentence] = useState("");
  const [currentTurn, setCurrentTurn] = useState(null);
  const [allAuthorsJoined, setAllAuthorsJoined] = useState(false);
  const [currentAuthorTurn, setCurrentAuthorTurn] = useState(null);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const currentAuthorTurnRef = useRef(currentAuthorTurn);
  const userRef = useRef(user);

  useEffect(() => {
    // Update the refs whenever the state variables change
    currentAuthorTurnRef.current = currentAuthorTurn;
    userRef.current = user;
  }, [currentAuthorTurn, user]);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/stories/${storyId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        const story = response.data;
        console.log("Story Data:", story);
        setCurrentTurn(story.currentTurn);
        setAllAuthorsJoined(story.authors.length === story.maxAuthors);
        setCurrentAuthorTurn(story.currentAuthorTurn);
        console.log("currentAuthorTurn:", currentAuthorTurn);
        console.log("user._id:", user._id);
        if (story.text.length > 0) {
          setLastSentence(story.text[story.text.length - 1].text);
        } else {
          setLastSentence(
            "You are going first. Start the story by adding the first two sentences."
          );
        }
      } catch (error) {
        console.error("An error occurred while fetching the story: ", error);
      }
    };

    fetchStory();

    socket = io(SOCKET_URL);
    socket.on("connect", () => {
      socket.emit("joinRoom", { storyId });
    });

    socket.on("connect_error", (error) => {
      console.log("Connection Error: ", error);
      // handle error here
    });

    socket.on("connect_timeout", (timeout) => {
      console.log("Connection Timeout: ", timeout);
      // handle timeout here
    });

    socket.on("updateStory", (data) => {
      console.log("UpdateStory Event Data:", data);
      console.log("Current Author Turn:", data.currentAuthorTurn);
      console.log("User ID:", user._id);

      setStoryText(data.text);
      setCurrentTurn(data.currentTurn);
      setAllAuthorsJoined(data.authors.length === data.maxAuthors);
      setCurrentAuthorTurn(data.currentAuthorTurn);
      console.log("currentAuthorTurn:", currentAuthorTurn);
      console.log("user._id:", user._id);
      if (data.text.length > 0) {
        setLastSentence(data.text[data.text.length - 1].text);
      } else {
        setLastSentence(
          "You are going first. Start the story by adding the first two sentences."
        );
      }
    });

    socket.on("lastAuthorJoined", () => {
      console.log("LastAuthorJoined Event Triggered");
      fetchStory();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Inside socket event listeners, use the refs instead of state variables
    if (
      currentAuthorTurnRef.current &&
      currentAuthorTurnRef.current.includes(userRef.current._id)
    ) {
      setIsUserTurn(true);
    } else {
      setIsUserTurn(false);
    }
  }, [currentAuthorTurnRef, userRef]);

  const submitSentence = async (event) => {
    event.preventDefault();
    try {
      // Making the POST request for the first sentence
      const response1 = await axios.post(`${API_URL}/api/sentences`, {
        userId: user.id,
        storyId,
        text: sentence1,
      });
      console.log("First sentence:", sentence1);

      // Making the POST request for the second sentence
      const response2 = await axios.post(`${API_URL}/api/sentences`, {
        userId: user.id,
        storyId,
        text: sentence2,
      });
      console.log("Second sentence:", sentence2);

      // Here you can handle the response from the server, if needed
      console.log("First sentence response:", response1.data);
      console.log("Second sentence response:", response2.data);

      // Clearing the input fields after submission
      setSentence1("");
      setSentence2("");
    } catch (error) {
      console.error("An error occurred while submitting the sentences:", error);
    }
  };

  return (
    <div className="GameRoom">
      <h3>The Game Room</h3>
      <p>{lastSentence}</p>
      <p>{storyText}</p>
      {allAuthorsJoined &&
        currentAuthorTurn &&
        currentAuthorTurn === user._id && (
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
      {currentAuthorTurn !== user._id && (
        <p>
          The story has started. Soon it will be your turn. Here are some tips:
        </p>
      )}
    </div>
  );
}

export default GameRoom;
