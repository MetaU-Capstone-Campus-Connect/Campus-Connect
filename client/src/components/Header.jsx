import "../components/css/Header.css";
import { Link } from "react-router";

function Header({ setUserName }) {
  const handleLogout = () => {
    setUserName("");
  };

  return (
    <div className="Header">
      <div className="navbar">
        <Link to="/home">
          <i className="fa fa-fw fa-home"></i> Campus Connect
        </Link>

        <Link to="/study-groups">
          <i className="fa fa-group"></i> Study Groups
        </Link>

        <Link to="/events">
          <i className="fa fa-calendar"></i> Events
        </Link>

        <Link to="/users/:name">
          <i className="fa fa-user"></i> My Profile
        </Link>

        <Link to="/" onClick={handleLogout}>
          <i className="fa fa-sign-out"></i> Log Out
        </Link>
      </div>
    </div>
  );
}

export default Header;
