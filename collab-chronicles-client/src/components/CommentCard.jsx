function CommentCard({ comment }) {
  return (
    <div className="CommentCard card">
      <h3>Comment from {userId.username}</h3>
      <p>{comment}</p>
    </div>
  );
}

export default CommentCard;
