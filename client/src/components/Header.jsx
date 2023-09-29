import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { GiHamburgerMenu } from "react-icons/gi";
// import { AiOutlineRollback } from "react-icons/ai";

const Header = () => {
  const navigate = useNavigate();
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
    navigate("/");
  };
  // AiOutlineRollback

  const handleHam = () => {
    const nav = document.querySelector("nav");
    nav.classList.toggle("active");
  };

  return (
    <header className="active">
      <div className="logo_container">
        <Link to="/" className="logo">
          <span style={{ fontWeight: "1" }}>Interview</span>Explorers
        </Link>
        <span className="ham_span">
          <GiHamburgerMenu className="ham" onClick={handleHam} />
        </span>
      </div>
      <nav className="">
        {user.username ? (
          <>
            <Link to="/create" onClick={handleHam}>
              NewPost
            </Link>
            <Link to="/profile" onClick={handleHam}>
              Profile
            </Link>
            <button className="logout_btn" onClick={handleLogout}>
              <span onClick={handleHam}>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={handleHam}>
              Login
            </Link>
            <Link to="/register" onClick={handleHam}>
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
