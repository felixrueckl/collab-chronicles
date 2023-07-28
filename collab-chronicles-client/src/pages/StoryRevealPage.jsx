import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5005";
const VOICE_RSS_KEY = "8102f673f37f408688ac8f1209fda9f2";
//const VOICE_RSS_KEY = process.env.REACT_APP_VOICE_RSS_KEY;

function StoryRevealPage() {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [music, setMusic] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const musicPlayerRef = useRef();

  useEffect(() => {
    if (isRevealed && music) {
      setIsMusicPlaying(true);
      if (musicPlayerRef.current) {
        musicPlayerRef.current.volume = 0.2;
      }
    }
  }, [isRevealed, music]);

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
    setMusic(story.musicUrl);
  };

  useEffect(() => {
    fetchStory();
  }, []);

  return (
    <div className="RevealStoryPage">
      {story && (
        <>
          <h2>{story.title}</h2>
          {!isRevealed && <button onClick={handleReveal}>Reveal</button>}
          {isRevealed && (
            <>
              <p>
                {story.text.map((sentence, index) => (
                  <p style={{ margin: "10px 0" }} key={index}>
                    {sentence.text}
                  </p>
                ))}

                <p>Voice</p>
                <audio src={audioUrl} autoPlay controls></audio>

                <p>Music</p>

                <audio
                  src={story.musicUrl}
                  ref={musicPlayerRef}
                  autoPlay
                  loop
                  controls
                ></audio>
              </p>
              <Link to="/users/:userId/stories/">Back</Link>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default StoryRevealPage;
