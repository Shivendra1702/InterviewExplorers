const Post = () => {
  return (
    <div className="post">
      <div className="image">
        <img
          src="https://techcrunch.com/wp-content/uploads/2022/04/GettyImages-1303427084.jpg?w=430&h=230&crop=1"
          alt=""
        />
      </div>
      <div className="texts">
        <h2>
          TrueMed’s payment integration platform unlocks HSA/FSA for health, not
          sickness
        </h2>
        <p className="info">
          <a href="" className="author">
            Shivendra Pratap
          </a>
          <time>2023-01-06 10:30</time>
        </p>
        <p className="summary">
          Medication might be easier than exercise or eating right, however
          TrueMed wants to change your thinking on that.
        </p>
      </div>
    </div>
  );
};

export default Post;
