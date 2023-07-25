import { useState, useContext } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function NewStory(props) {
  //Get the user
  const { user } = useContext(AuthContext);

  //Choosing the title
  const [title, setTitle] = useState("");
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  //Choosing Single- or Multiplayer
  const [type, setType] = useState("Single Player");
  const handleStoryTypeChange = (e) => {
    setType(e.target.value);
  };

  //Sets how many rounds will be played
  const [rounds, setRounds] = useState(2);
  const handleIncrement = () => {
    if (rounds < 5) {
      setRounds(rounds + 1);
    }
  };
  const handleDecrement = () => {
    if (rounds > 1) {
      setRounds(rounds - 1);
    }
  };

  //Choosing the backgorund music when read out loud at the end
  const [musicTitle, setMusicTitle] = useState("Celtic");
  const musicUrls = {
    Africa:
      "https://res.cloudinary.com/dse6ivx7u/video/upload/f_auto:video,q_auto/v1/Collab%20Chronicles/ajumsxjtz9thmmypujps",
    Celtic:
      "https://res.cloudinary.com/dse6ivx7u/video/upload/f_auto:video,q_auto/v1/Collab%20Chronicles/knc2znvazxbmrjvymdah",
    Caribbean:
      "https://res.cloudinary.com/dse6ivx7u/video/upload/f_auto:video,q_auto/v1/Collab%20Chronicles/eytbgffow0kmgjjguqif",
    Medieval:
      "https://res.cloudinary.com/dse6ivx7u/video/upload/f_auto:video,q_auto/v1/Collab%20Chronicles/yj9n3rhclaepdwdmrypf",
    Romantic:
      "https://res.cloudinary.com/dse6ivx7u/video/upload/f_auto:video,q_auto/v1/Collab%20Chronicles/hb7ps136ghx09xzrpydm",
    Pirate:
      "https://res.cloudinary.com/dse6ivx7u/video/upload/f_auto:video,q_auto/v1/Collab%20Chronicles/deu7pl5wvq8jxdoy29di",
  };
  const handleMusicChange = (e) => {
    setMusicTitle(e.target.value);
  };
  //Choosing a language (accent) and a male/female voice when read out loud at the end
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");

  const languageOptions = ["French", "Hindi", "Russian"];
  const voiceOptions = {
    French: ["Bob", "Ana"],
    Hindi: ["Puja", "Kabir"],
    Russian: ["Olga", "Peter"],
  };
  const languageAbbreviations = {
    French: "fr-fr",
    Hindi: "hi-in",
    Russian: "ru-ru",
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    setSelectedVoice("");
  };

  const handleVoiceChange = (event) => {
    setSelectedVoice(event.target.value);
  };

  // handle Submit button and POST to backend

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedToken = localStorage.getItem("authToken");
    const musicUrl = musicUrls[musicTitle];
    const language = languageAbbreviations[selectedLanguage];
    const voice = selectedVoice;
    const creator = user._id;
    const username = user.username;

    const requestBody = {
      creator,
      username,
      title,
      type,
      rounds,
      musicUrl,
      language,
      voice,
    };

    console.log(requestBody);

    try {
      await axios.post(`${API_URL}/api/stories`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      // Story creation successful
      console.log("New story created successfully!");
      setTitle("");
      setType("Single Player");
      setRounds(2);
      setMusicTitle("Celtic");
      setSelectedLanguage("");
      setSelectedVoice("");

      // Call a function to refresh the list of stories (if needed)
      //navigate("/game");
    } catch (error) {
      // Handle any errors that occur during the story creation process
      console.error("Error creating the story:", error);
    }
  };

  return (
    <div className="NewStory">
      <h3>Begin a new Story {user && user.username}</h3>

      <form onSubmit={handleSubmit}>
        <div className="TitleInput">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="StoryTypeSelect">
          <label>
            {" "}
            Choose Story mode:
            <select value={type} onChange={handleStoryTypeChange}>
              <option value="Single Player">Single Player</option>
              <option value="Multiplayer">Multiplayer</option>
            </select>
          </label>
        </div>

        <div className="RoundsCounter">
          <label>Rounds:</label>
          <button onClick={handleDecrement}>-</button>
          <span>{rounds}</span>
          <button onClick={handleIncrement}>+</button>
        </div>

        <div className="MusicTitleSelect">
          <label>Music:</label>
          <select value={musicTitle} onChange={handleMusicChange}>
            <option value="Africa">Africa</option>
            <option value="Celtic">Celtic</option>
            <option value="Caribbean">Caribbean</option>
            <option value="Medieval">Medieval</option>
            <option value="Romantic">Romantic</option>
            <option value="Pirate">Pirate</option>
          </select>
        </div>

        <div>
          <label>
            Select Language:
            <select value={selectedLanguage} onChange={handleLanguageChange}>
              <option value="">Select Language</option>
              {languageOptions.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>
        </div>
        {selectedLanguage && (
          <div>
            <label>
              Select Voice:
              <select value={selectedVoice} onChange={handleVoiceChange}>
                <option value="">Select Voice</option>
                {voiceOptions[selectedLanguage].map((voice) => (
                  <option key={voice} value={voice}>
                    {voice}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <button type="submit">Start</button>
      </form>
    </div>
  );
}

export default NewStory;
