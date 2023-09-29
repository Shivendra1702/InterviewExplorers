import { useEffect, useState } from "react";
import Post from "./Post";
import { PropagateLoader } from "react-spinners";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setLoader(true);
    fetch("http://localhost:4000/posts", {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.ok) {
          setPosts(data.posts);
        }
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(() => {
        setLoader(false);
      });
  }, []);
  if (loader) {
    return (
      <div className="loader">
        <PropagateLoader color="black" />
      </div>
    );
  }
  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => {
          return <Post key={post._id} post={post} />;
        })}
    </>
  );
};

export default Posts;
