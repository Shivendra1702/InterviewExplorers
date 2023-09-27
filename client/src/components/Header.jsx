import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const handleLogout = () => {
    fetch("http://localhost:4000/logout", {
      method: "POST",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        setUser({});
      }
    });
  };

  return (
    <header>
      <Link to="/" className="logo">
        My Blog
      </Link>
      <nav>
        {user.username ? (
          <>
            <Link to="/new">New Post</Link>
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
