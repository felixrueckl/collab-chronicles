function CommentCard({ text, userId }) {
  return (
    <div className="CommentCard card">
      <h3>Comment from {userId.username}</h3>
      <p>{text}</p>
    </div>
  );
}

export default CommentCard;
