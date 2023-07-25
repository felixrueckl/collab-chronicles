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
          path="/stories/:userId"
          element={
            <IsPrivate>
              <MyStoriesPage />
            </IsPrivate>
          }
        />
        <Route
          path="/stories/:storiesId"
          element={
            <IsPrivate>
              <StoryDetailsPage />
            </IsPrivate>
          }
        />
        <Route
          path="/stories/edit/:storiesId"
          element={
            <IsPrivate>
              {" "}
              <EditStoryPage />{" "}
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
