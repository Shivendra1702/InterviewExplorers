import { format } from "date-fns";
import { AiFillDelete } from "react-icons/ai";
import { UserContext } from "../UserContext";
import { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
const Comment = ({ comment }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const DeleteComment = () => {
    fetch(`${import.meta.env.VITE_NODE_API}/deletecomment/${comment._id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          // window.location.reload();
          // navigate(`/post/${comment.postId}`);
          return Navigate(`/post/${comment.postId}`);
        }
      })
      .catch((err) => {
        throw new Error(`Error in deleting comment ${err}`);
      });
  };
  return (
    <div className="comment_wrapper">
      <div className="user_comment">
        <div className="user_name">
          <div className="user_photo">
            <img src={comment?.photo} alt="user" />
          </div>

          <h2>{comment?.username}</h2>
          {comment?.createdAt &&
            format(new Date(comment.createdAt), "MMM dd , yyyy hh:mm")}

          {user._id == comment?.userId && (
            <span
              onClick={DeleteComment}
              style={{
                cursor: "pointer",
                fontSize: "1.5rem",
              }}
            >
              <AiFillDelete />
            </span>
          )}
        </div>

        <div className="user_comment_text">
          <p>{comment?.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
