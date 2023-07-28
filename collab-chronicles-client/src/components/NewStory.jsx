import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5005";
const socket = io(API_URL);

function NewStory(props) {
  const navigate = useNavigate();

  //Get the user
  const { user } = useContext(AuthContext);

  //Choosing the title
  const [title, setTitle] = useState("");
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  //Choosing how many authors
  const [type, setType] = useState("2");
  const handleStoryTypeChange = (e) => {
    setType(e.target.value);
  };
  const maxAuthorsMapping = {
    2: 2,
    3: 3,
    4: 4,
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
  const [selectedLanguage, setSelectedLanguage] = useState("French");
  const [selectedVoice, setSelectedVoice] = useState("Bob");

  const languageOptions = [
    "EnglishAUS",
    "EnglishUS",
    "French",
    "GermanCH",
    "Hindi",
    "Russian",
  ];
  const voiceOptions = {
    EnglishAUS: ["Isla"],
    EnglishUS: ["Amy", "Linda", "Mary", "John", "Mike"],
    French: ["Bob", "Ana"],
    GermanCH: ["Tim"],
    Hindi: ["Puja", "Kabir"],
    Russian: ["Olga", "Peter"],
  };
  const languageAbbreviations = {
    EnglishAUS: "en-au",
    EnglishUS: "en-us",
    French: "fr-fr",
    GermanCH: "de-ch",
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
      authors: [creator],
      maxAuthors: maxAuthorsMapping[type],
    };

    console.log("Prepared Story Data:", requestBody);

    try {
      const response = await axios.post(`${API_URL}/api/stories`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      // Story creation successful
      console.log("New story created successfully!");

      const newStory = response.data.newStory;

      socket.emit("createRoom", {
        storyId: newStory._id,
        maxAuthors: newStory.maxAuthors,
        authors: newStory.authors,
      });

      setTitle("");
      setType("2");
      setRounds(2);
      setMusicTitle("Celtic");
      setSelectedLanguage("French");
      setSelectedVoice("Bob");
      navigate(`/gameroom/${response.data.newStory._id}/join`);
      console.log("New Story Response:", response.data);
    } catch (error) {
      // Handle any errors that occur during the story creation process
      console.error("Error creating the story:", error);
    }
  };

  return (
    <div className="NewStory">
      <h3>Start telling a new Story {user && user.username}.</h3>

      <form onSubmit={handleSubmit}>
        <div className="TitleInput">
          <label> Give your story a title:</label>
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
            How many authors will collaborate:
            <select value={type} onChange={handleStoryTypeChange}>
              <option value="2">Two authors</option>
              <option value="3">Three authors</option>
              <option value="4">Four authors</option>
            </select>
          </label>
        </div>

        <div className="MusicTitleSelect">
          <label>Music Theme:</label>
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
            Select Language/Accent:
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
        <div className="RoundsCounter">
          <label>Rounds: 2 </label>
          {/*           <button onClick={handleDecrement}>-</button>
          <span>{rounds}</span>
          <button onClick={handleIncrement}>+</button> */}
        </div>
        <button type="submit">Start</button>
      </form>
    </div>
  );
}

export default NewStory;
