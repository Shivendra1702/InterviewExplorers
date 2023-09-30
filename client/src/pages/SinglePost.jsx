import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import Comment from "../components/Comment";

const SinglePost = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [delLoader, setDelLoader] = useState(false);
  const [post, setPost] = useState({});

  useEffect(() => {
    setLoader(true);
    fetch(`${import.meta.env.VITE_NODE_API}/post/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setPost(data.post);
          setComments(data.post.comments);
        }
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [id]);

  const handleDelete = () => {
    setDelLoader(true);
    fetch(`${import.meta.env.VITE_NODE_API}/deletepost/${post._id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          navigate(`/`);
        }
      })
      .catch((err) => {
        throw new Error(`Error in deleting post ${err}`);
      })
      .finally(() => {
        setDelLoader(false);
      });
  };

  const handleEdit = () => {
    navigate(`/editpost/${post._id}`);
  };

  const handleAddComment = () => {
    let commentData = new FormData();
    commentData.set("comment", comment);
    commentData.set("userId", user._id);
    commentData.set("postId", post._id);

    fetch(`${import.meta.env.VITE_NODE_API}/addcomment`, {
      method: "POST",
      body: commentData,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.ok) {
          console.log(data.post);
          setComment("");
        }
      })
      .catch((err) => {
        throw new Error(`Error in adding comment ${err}`);
      });
  };

  return (
    <div className="single_post">
      {loader || delLoader ? (
        <div className="loader">
          <PropagateLoader color="#000000" />
        </div>
      ) : (
        <>
          <div className="heading">
            <h1>{post.title}</h1>
          </div>

          <div className="meta_data">
            <span>{post.author}</span>
            <time>
              {post.createdAt
                ? format(new Date(post.createdAt), "MMM dd , yyyy hh:mm")
                : "N/A"}
            </time>
          </div>

          <div className="cover_image">
            <img src={post.cover?.url} alt="" />
          </div>

          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="content"
          />

          {post.user == user._id ? (
            <div className="del_edit_btns ">
              <button className="f_button edit" onClick={handleEdit}>
                Edit
              </button>
              <button className="f_button del" onClick={handleDelete}>
                Delete
              </button>
            </div>
          ) : (
            ""
          )}

          <div className="comment_section">
            <div className="comment_heading">
              <h1>{comments.length} Comments ~</h1>
            </div>
            {user._id && (
              <div className="comment_input">
                <input
                  type="text"
                  placeholder="Write your comment here"
                  name="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className="f_button" onClick={handleAddComment}>
                  Add Comment
                </button>
              </div>
            )}

            <div className="all_comments">
              {comments?.map((comment) => {
                return <Comment key={comment._id} comment={comment} />;
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SinglePost;
