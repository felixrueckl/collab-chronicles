import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5005";
const VOICE_RSS_KEY = "8102f673f37f408688ac8f1209fda9f2";
//const VOICE_RSS_KEY = process.env.REACT_APP_VOICE_RSS_KEY;

function StoryRevealPage() {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);

  const fetchStory = () => {
    const storedToken = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/stories/${storyId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        setStory(response.data);
        console.log(response.data.text);
      })
      .catch((error) => console.log(error));
  };

  const handleReveal = () => {
    setIsRevealed(true);
    story.text.forEach((item, index) => {
      console.log(`Item at index ${index}:`, item);
    });

    const textToSpeech = encodeURIComponent(
      story.text.map((sentence) => sentence.text).join(". ")
    );
    console.log(textToSpeech);
    console.log(story.text);
    console.log(story.text.map((sentence) => sentence.text));
    const language = story.language;
    const voice = story.voice;
    const key = VOICE_RSS_KEY;
    setAudioUrl(
      `https://api.voicerss.org/?key=${key}&hl=${language}&v=${voice}&src=${textToSpeech}`
    );
  };

  useEffect(() => {
    fetchStory();
  }, []);

  return (
    <div className="RevealStoryPage">
      {story && (
        <>
          <h2>{story.title}</h2>
          <button onClick={handleReveal}>Reveal</button>
          {isRevealed && (
            <>
              <audio controls autoPlay>
                <source src={audioUrl} type="audio/x-wav" />
              </audio>
              <p>
                {story.text.map((sentence, index) => (
                  <span key={index}>{sentence.text} </span>
                ))}
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default StoryRevealPage;
