import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
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

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [files, setFiles] = useState("");
  const [content, setContent] = useState("");

  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    try {
      setLoader(true);

      const data = new FormData();
      data.set("title", title);
      data.set("summary", summary);
      data.set("file", files[0]);
      data.set("content", content);
      data.set("token", localStorage.getItem("token"));

      e.preventDefault();

      fetch(`${import.meta.env.VITE_NODE_API}/post`, {
        method: "POST",
        body: data,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.ok) {
            console.log(data);
            setTitle("");
            setSummary("");
            setFiles("");
            setContent("");
            navigate("/");
          }
        })
        .catch((err) => {
          throw new Error(`Error Creating Post: ${err}`);
        })
        .finally(() => {
          setLoader(false);
        });
    } catch (error) {
      throw new Error(`Error Creating Post: ${error}`);
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
          Create Post
        </button>
      )}
    </form>
  );
};

export default CreatePost;
