import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { GiHamburgerMenu } from "react-icons/gi";
// import { AiOutlineRollback } from "react-icons/ai";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({});
    navigate("/");
  };

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
            <NavLink
              to="/create"
              onClick={handleHam}
              style={({ isActive, isPending }) => {
                return {
                  fontWeight: isActive ? "bold" : "",
                  color: isPending ? "red" : "black",
                };
              }}
            >
              NewPost
            </NavLink>
            <NavLink
              to="/profile"
              onClick={handleHam}
              style={({ isActive, isPending }) => {
                return {
                  fontWeight: isActive ? "bold" : "",
                  color: isPending ? "red" : "black",
                };
              }}
            >
              Profile
            </NavLink>
            <button className="logout_btn" onClick={handleLogout}>
              <span onClick={handleHam} style={{ color: "white" }}>
                Logout
              </span>
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              onClick={handleHam}
              style={({ isActive, isPending }) => {
                return {
                  fontWeight: isActive ? "bold" : "",
                  color: isPending ? "red" : "black",
                };
              }}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              onClick={handleHam}
              style={({ isActive, isPending }) => {
                return {
                  fontWeight: isActive ? "bold" : "",
                  color: isPending ? "red" : "black",
                };
              }}
            >
              Register
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
