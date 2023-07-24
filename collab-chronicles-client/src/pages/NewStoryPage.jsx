import React, { useContext } from "react";
import NewStory from "../components/NewStory";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function NewStoryPage() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Once upon a time...</h1>
      <NewStory user={user} />
    </div>
  );
}

export default NewStoryPage;
