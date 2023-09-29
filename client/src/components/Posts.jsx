import { useEffect, useState } from "react";
import Post from "./Post";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/posts", {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.ok) {
          setPosts(data.posts);
          console.log(data.posts);
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, []);
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
