import { useContext, useEffect, useState } from "react";
import Post from "../components/Post";
import { PropagateLoader } from "react-spinners";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const Profile = () => {
  const token = localStorage.getItem("token");
  const [userDetail, setUserDetail] = useState({});
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    setLoader(true);
    fetch(`${import.meta.env.VITE_NODE_API}/profile`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUserDetail(data.user);
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [token]);

  const GetMyPosts = async () => {
    setLoader(true);
    fetch(`${import.meta.env.VITE_NODE_API}/getmyposts/${userDetail._id}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setPosts(data.posts);
      })
      .catch((err) => {
        throw new Error(`Error in getting posts ${err}`);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  if (!user.username) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="profile_wrapper">
      <h1>Profile</h1>

      <div className="profile_image">
        <img src={userDetail.photo?.url} alt="Profile Photo" />
      </div>

      <div className="user_name">
        <span className="label">User Name :</span>
        <span> {userDetail.username}</span>
      </div>

      <div className="user_email">
        <span className="label">User Email :</span>
        <span> {userDetail.email}</span>
      </div>

      <div className="my_posts">
        {loader ? (
          <PropagateLoader color="#000000" />
        ) : (
          <button onClick={GetMyPosts} className="f_button">
            Get My Posts
          </button>
        )}
        <span>
          {posts.length > 0 &&
            posts.map((post) => {
              return <Post key={post._id} post={post} />;
            })}
        </span>
      </div>
    </div>
  );
};

export default Profile;
