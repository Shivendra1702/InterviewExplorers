import { Link } from "react-router-dom";

const Missing = () => {
  return (
    <div className="missing">
      <p>ERROR</p>
      <h1>404</h1>
      <p>Page Not Found</p>
      <Link to="/" className="h_link">
        Home
      </Link>
    </div>
  );
};

export default Missing;
