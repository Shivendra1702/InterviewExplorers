import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { TbLogout } from "react-icons/tb";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({});
    navigate("/");
  };

  const [activeHam, setActiveHam] = useState(false);

  const handleHam = () => {
    const nav = document.querySelector("nav");
    nav.classList.toggle("active");
    if (nav.getAttribute("class") == "active") {
      setActiveHam(true);
    } else {
      setActiveHam(false);
    }
  };

  return (
    <header className="active">
      <div className="logo_container">
        <Link to="/" className="logo">
          <span style={{ fontWeight: "1" }}>Interview</span>Explorers
        </Link>
        <span className="ham_span">
          {activeHam ? (
            <RxCross1 className="ham" onClick={handleHam} />
          ) : (
            <GiHamburgerMenu className="ham" onClick={handleHam} />
          )}
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
              <span
                onClick={handleHam}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                Logout <TbLogout />
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
