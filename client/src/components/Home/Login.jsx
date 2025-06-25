import "../Home/css/Login.css";
import Header from "../Header";
import Footer from "../Footer";
// import { useState } from "react";
import { Link, useNavigate } from "react-router";

function Login({ welcomeMessage, setWelcomeMessage }) {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userName = event.target.name.value;
    const userPwd = event.target.pwd.value;
    const newUser = { userName, userPwd };

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
        credentials: "include",
      });

      const data = await response.json();
      setWelcomeMessage(data.message);
      if (response.ok) {
        navigate("/home");
      }
    } catch (error) {
      console.error("ERROR: Logging in a user on front-end -> ", error);
    }
  };

  return (
    <div className="Login">
      <Header />
      <h1>{welcomeMessage}</h1>
      <form onSubmit={handleSubmit}>
        <div className="loginContainer">
          <label for="uname">
            <b>Username</b>
          </label>
          <input
            type="text"
            placeholder="Enter Username"
            name="name"
            required
          />

          <label for="psw">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="pwd"
            required
          />

          <button type="submit">Login</button>
        </div>
      </form>

      <div className="registerContainer">
        <h3>Or Sign Up Using</h3>
        <Link to="/signup">
          <button className="createButton">Sign Up</button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
