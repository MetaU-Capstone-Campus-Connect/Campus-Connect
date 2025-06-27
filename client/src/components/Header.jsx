import "../components/css/Header.css";
import { Link } from "react-router";

function Header({ setUserName }) {
  // const handleLogout = () => {
  //   setUserName("");
  // };

  const headers = [
    { name: "Campus Connect", path: "/home", icon: "fa fa-fw fa-home" },
    { name: "Study Groups", path: "/study-groups", icon: "fa fa-group" },
    { name: "Events", path: "/events", icon: "fa fa-calendar" },
    { name: "My Profile", path: "/users/:name", icon: "fa fa-user" },
    { name: "Log Out", path: "/", icon: "fa fa-sign-out"},
  ];

  return (
    <div className="Header">
      <div className="navbar">
        {headers.map((site) => (
          <Link to={site.path}>
            <i className={site.icon}></i> {site.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Header;
