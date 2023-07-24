import { Link } from "react-router-dom";

function StoryCard({ title, text, _id }) {
  return (
    <div className="StoryCard card">
      <Link to={`/stories/${_id}`}>
        <h3>{title}</h3>
      </Link>
      <p style={{ maxWidth: "400px" }}>{text} </p>
    </div>
  );
}

export default StoryCard;
