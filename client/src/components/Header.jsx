import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  // const token = localStorage.getItem("token");
  // console.log(token);
  const handleLogout = () => {
    // fetch("http://localhost:4000/logout", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   credentials: "include",
    //   body: JSON.stringify({ token }),
    // }).then((response) => {
    //   if (response.ok) {
    //     setUser({});
    //   }
    // });

    localStorage.removeItem("token");
    setUser({});
  };

  return (
    <header>
      <Link to="/" className="logo">
        InterviewExplorers
      </Link>
      <nav>
        {user.username ? (
          <>
            <Link to="/create">NewPost</Link>
            <Link to="/profile">Profile</Link>
            <button className="logout_btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
