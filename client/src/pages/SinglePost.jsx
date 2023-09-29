import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { useContext } from "react";
import { UserContext } from "../UserContext";

const SinglePost = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [delLoader, setDelLoader] = useState(false);
  const [post, setPost] = useState({});
  useEffect(() => {
    setLoader(true);
    fetch(`http://localhost:4000/post/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setPost(data.post);
          console.log(data.post);
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
    fetch(`http://localhost:4000/deletepost/${post._id}`, {
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

          <div className="last_updated">
            <span>Last Updated</span>
            <time>
              {post.createdAt
                ? format(new Date(post.updatedAt), "MMM dd , yyyy hh:mm")
                : "N/A"}
            </time>
          </div>
        </>
      )}
    </div>
  );
};

export default SinglePost;
