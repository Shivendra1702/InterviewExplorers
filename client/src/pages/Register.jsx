import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const register = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      setUsername("");
      setPassword("");
      setEmail("");
      if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <>
      <form onSubmit={register} className="register">
        <h1>Register</h1>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="f_button">Register</button>
      </form>
    </>
  );
};

export default Register;
