import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { PropagateLoader } from "react-spinners";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  // <PropagateLoader color="#000000" />

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();
    try {
      setLoader(true);
      const response = await fetch(`http://localhost:4000/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      setPassword("");
      setEmail("");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user); //
        console.log("response worked");
        navigate("/");
      } else {
        alert("Invalid Credentials !!");
      }
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <form onSubmit={login} className="login">
        <h1>Login</h1>
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

        {loader ? (
          <PropagateLoader color="#000000" />
        ) : (
          <button className="f_button">Login</button>
        )}
      </form>
    </>
  );
};

export default Login;
