import "../components/css/Header.css";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import LoadingState from "./LoadingState";

function Header({ userName }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)

  const deleteSession = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error: Deleting user session:");
    } finally {
      setIsLoading(false)
    }
  };

  const headers = [
    {
      name: "Campus Connect",
      path: "/home",
      icon: "fa fa-fw fa-home",
    },
    {
      name: "Study Groups",
      path: "/study-groups",
      icon: "fa fa-group",
    },
    { name: "Events", 
      path: "/events", 
      icon: "fa fa-calendar", 
    },
    {
      name: "My Profile",
      path: `/users/${userName}`,
      icon: "fa fa-user",
    },
    { name: "Log Out", path: "/", icon: "fa fa-sign-out", call: deleteSession },
  ];

  if (isLoading) {
    return <LoadingState/>
  }

  return (
    <div className="Header">
      <div className="navbar">
        {headers.map((site) => (
          <Link to={site.path} onClick={site.call ? (event) => {event.preventDefault(); site.call(); } : null}>
            <i className={site.icon}></i> {site.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Header;
