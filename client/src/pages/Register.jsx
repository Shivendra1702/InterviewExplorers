import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PropagateLoader } from "react-spinners";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState("");
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const register = async (event) => {
    try {
      setLoader(true);
      const formData = new FormData();
      formData.set("username", username);
      formData.set("email", email);
      formData.set("password", password);
      formData.set("photo", files[0]);
      event.preventDefault();
      const response = await fetch(`${import.meta.env.VITE_NODE_API}/register`, {
        method: "POST",
        body: formData,
      });
      setUsername("");
      setPassword("");
      setEmail("");
      if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <form onSubmit={register} className="register">
        <h1>Register </h1>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          name="username"
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
        />

        <div
          style={{
            display: "flex",
            // flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            textAlign: "center",
          }}
        >
          Select Profile Image :
          <input type="file" onChange={(e) => setFiles(e.target.files)} />
        </div>

        {loader ? (
          <PropagateLoader color="#000000" />
        ) : (
          <button className="f_button">Register</button>
        )}
      </form>
    </>
  );
};

export default Register;
