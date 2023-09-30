import { useEffect, useState } from "react";
import Post from "../components/Post";
import { PropagateLoader } from "react-spinners";

const Profile = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    fetch("http://localhost:4000/profile", {
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
        setUser(data.user);
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
    fetch(`http://localhost:4000/getmyposts/${user._id}`)
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
  // if (loader) {
  //   return (
  //     <div className="loader">
  //       <PropagateLoader color="black" />
  //     </div>
  //   );
  // }
  return (
    <div className="profile_wrapper">
      <h1>Profile</h1>

      <div className="profile_image">
        <img src={user.photo?.url} alt="Profile Photo" />
      </div>

      <div className="user_name">
        <span>User Name :</span>
        <span> {user.username}</span>
      </div>

      <div className="user_email">
        <span>User Email :</span>
        <span> {user.email}</span>
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
