import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { PropagateLoader } from "react-spinners";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const EditPost = () => {
  const { id } = useParams();
  //   const [post, setPost] = useState({});

  const [title, setTitle] = useState();
  const [summary, setSummary] = useState();
  const [files, setFiles] = useState("");
  const [content, setContent] = useState();

  useEffect(() => {
    setLoader(true);
    fetch(`http://localhost:4000/post/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          //   setPost(data.post);
          setTitle(data.post.title);
          setSummary(data.post.summary);
          setContent(data.post.content);
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

  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    try {
      setLoader(true);

      const data = new FormData();
      data.set("title", title);
      data.set("summary", summary);
      if (files) {
        data.set("file", files[0]);
      }
      data.set("content", content);

      e.preventDefault();

      fetch(`http://localhost:4000/editpost/${id}`, {
        method: "PUT",
        body: data,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.ok) {
            console.log(data);
            navigate(`/post/${data.post._id}`);
          }
        })
        .catch((err) => {
          throw new Error(`Error Editing Post: ${err}`);
        })
        .finally(() => {
          setLoader(false);
        });
    } catch (error) {
      throw new Error(`Error Editing Post Catch: ${error}`);
    }
  };

  return (
    <form className="create_form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        name="summary"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input type="file" onChange={(e) => setFiles(e.target.files)} />
      <ReactQuill
        modules={modules}
        formats={formats}
        name="content"
        value={content}
        onChange={(newValue) => setContent(newValue)}
      />

      {loader ? (
        <div className="cp_loader">
          <PropagateLoader color="#000000" />
        </div>
      ) : (
        <button className="create_btn" type="submit">
          Edit Post
        </button>
      )}
    </form>
  );
};

export default EditPost;
