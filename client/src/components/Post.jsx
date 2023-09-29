import { Link } from "react-router-dom";
import { format } from "date-fns";
/* eslint-disable react/prop-types */
const Post = ({ post }) => {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${post._id}`}>
          <img src={post.cover.url} alt="" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${post._id}`}>
          <h2>{post.title}</h2>
        </Link>
        <p className="info">
          <a href="" className="author">
            {post.author}
          </a>
          <time>{format(new Date(post.createdAt), "MMM dd , yyyy hh:mm")}</time>
        </p>

        <p className="summary">{post.summary}</p>
      </div>
    </div>
  );
};

export default Post;
