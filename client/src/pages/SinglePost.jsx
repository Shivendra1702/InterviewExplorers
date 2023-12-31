import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import Comment from "../components/Comment";
import { GrAdd } from "react-icons/gr";


const SinglePost = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [delLoader, setDelLoader] = useState(false);
  const [commentInputLoader, setCommentInputLoader] = useState(false);
  const [post, setPost] = useState({});

  useEffect(() => {
    setLoader(true);
    fetch(`${import.meta.env.VITE_NODE_API}/post/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setPost(data.post);
        }
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [id]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_NODE_API}/getcomments/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setComments(data.comments);
        }
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
    setCommentInputLoader(true);
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
          setComments((prevComments) => [data.newComment, ...prevComments]);
          setComment("");
        }
      })
      .catch((err) => {
        throw new Error(`Error in adding comment ${err}`);
      })
      .finally(() => {
        setCommentInputLoader(false);
      });
  };

  return (
    <>
      
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
              {user._id &&
                (commentInputLoader ? (
                  <div
                    className="loader"
                    style={{
                      height: "50px",
                    }}
                  >
                    <PropagateLoader color="#000000" />
                  </div>
                ) : (
                  <div className="comment_input">
                    <input
                      type="text"
                      placeholder="Write your comment here"
                      name="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      className="f_button"
                      onClick={handleAddComment}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      <GrAdd /> Add Comment
                    </button>
                  </div>
                ))}

              <div className="all_comments">
                {comments?.map((comment) => {
                  return (
                    <Comment
                      key={comment?._id}
                      comment={comment}
                      comments={comments}
                      setComments={setComments}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SinglePost;
