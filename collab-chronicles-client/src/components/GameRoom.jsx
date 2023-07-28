import { useState, useEffect, useContext, useRef } from "react";
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
  const [gameStatus, setGameStatus] = useState("");

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
      setGameStatus(story.gameStatus);
      setLastSentence(story.lastSentence);

      if (story.currentTurn === 1) {
        setLastSentence(
          "Write two sentences to start your story and click submit."
        );
      }
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
      console.log("refreshing");
      console.log("RefreshPage Event Triggered");
      window.location.reload();
    });

    socketRef.current.on("storyUpdated", () => {
      console.log("StoryUpdated Event Triggered");
      fetchStory();
    });

    socketRef.current.on("gameFinished", () => {
      navigate(`/stories/${user._id}/finished`);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [storyId, navigate, user]);

  useEffect(() => {
    if (currentAuthorTurn && currentAuthorTurn.includes(user._id)) {
      setIsUserTurn(true);
    } else {
      setIsUserTurn(false);
    }
  }, [currentAuthorTurn, user]);

  useEffect(() => {
    if (gameStatus === "finished") {
      navigate(`/users/${user._id}/stories`);
    }
  }, [gameStatus, navigate, user._id]);

  const submitSentence = async (event) => {
    event.preventDefault();
    try {
      const submittedData1 = {
        userId: user._id,
        storyId: storyId,
        text: sentence1,
      };
      const submittedData2 = {
        userId: user._id,
        storyId: storyId,
        text: sentence2,
      };
      const submittedDataTurn = {
        userId: user._id,
        turn: currentTurn + 1,
        storyId: storyId,
        lastSentence: sentence2,
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
      setLastSentence(sentence2);

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
      <h3>Story Title: {storyTitle}</h3>
      <h6>*{gameStatus}*</h6>
      {allAuthorsJoined &&
        currentAuthorTurn &&
        user._id &&
        currentAuthorTurn.toString() === user._id.toString() && (
          <form onSubmit={submitSentence}>
            <label>
              <br></br>
              <p>{lastSentence}</p>
              <br></br>
            </label>
            <label>
              Your first sentence:
              <input
                type="text"
                value={sentence1}
                onChange={(e) => setSentence1(e.target.value)}
              />
            </label>
            <label>
              Your second sentence: <br></br>(this will be shown to the next
              one):
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
          <div>
            <p>
              While you are waiting, here are some tips on how to write better
              stories:
            </p>
            <ul>
              <li>
                Begin with a captivating hook that grabs the reader's attention
                from the very first sentence.
              </li>
              <br></br>
              <li>
                Develop well-rounded and relatable characters that drive the
                plot forward and elicit emotional connections from the readers.
              </li>
              <br></br>
              <li>Have fun :)</li>
            </ul>
            <br></br>
            <p>
              FUN FACT: Did you know that this method is called Cadavre Exquis.
              <br></br>
              <br></br>
              Cadavre Exquis refers to a playful method developed in Surrealism
              to give room to chance in the creation of texts and images.
            </p>
          </div>
        )}
    </div>
  );
}

export default GameRoom;
