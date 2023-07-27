import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MyStoriesPage from "./pages/MyStoriesPage";
import StoryDetailsPage from "./pages/StroyDetailsPage";
import NewStoryPage from "./pages/NewStoryPage";
import EditStoryPage from "./pages/EditStoryPage";
import SignupPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";
import OpenStoriesPage from "./pages/OpenStoriesPage";
import JoinGameRoom from "./components/JoinGameRoom";
import GameRoom from "./components/GameRoom";
import ReadStoryPage from "./pages/ReadStoryPage";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/new"
          element={
            <IsPrivate>
              <NewStoryPage />
            </IsPrivate>
          }
        />
        <Route
          path="/users/:userId/stories/"
          element={
            <IsPrivate>
              <MyStoriesPage />
            </IsPrivate>
          }
        />
        <Route
          path="/stories/:storyId"
          element={
            <IsPrivate>
              <StoryDetailsPage />
            </IsPrivate>
          }
        />
        <Route
          path="/stories/:storyId/read"
          element={
            <IsPrivate>
              <ReadStoryPage />
            </IsPrivate>
          }
        />
        <Route
          path="/stories/edit/:storiesId"
          element={
            <IsPrivate>
              <EditStoryPage />
            </IsPrivate>
          }
        />
        <Route
          path="/gameroom/user/:userId/stories/open"
          element={
            <IsPrivate>
              <OpenStoriesPage />
            </IsPrivate>
          }
        />
        <Route
          path="/gameroom/:storyId/join"
          element={
            <IsPrivate>
              <JoinGameRoom />
            </IsPrivate>
          }
        />
        <Route
          path="/gameroom/:storyId/"
          element={
            <IsPrivate>
              <GameRoom />
            </IsPrivate>
          }
        />

        <Route
          path="/users/:userId"
          element={
            <IsPrivate>
              <UserPage />
            </IsPrivate>
          }
        />

        <Route
          path="/signup"
          element={
            <IsAnon>
              <SignupPage />
            </IsAnon>
          }
        />
        <Route
          path="/login"
          element={
            <IsAnon>
              <LoginPage />
            </IsAnon>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
