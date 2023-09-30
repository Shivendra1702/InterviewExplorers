import { format } from "date-fns";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
const Comment = ({ comment }) => {
  return (
    <div className="comment_wrapper">
      <div className="user_comment">
        <div className="user_name">
          <div className="user_photo">
            <img src={comment.userId.photo.url} alt="user" />
          </div>

          <h2>{comment.userId.username}</h2>
          <time>
            {format(new Date(comment.createdAt), "MMM dd , yyyy hh:mm")}
          </time>
        </div>

        <div className="user_comment_text">
          <p>{comment.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
