import "../Home/css/Login.css";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import LoadingState from "../LoadingState";

function Login({ setUserName, setUserInfo }) {
  const [loginMessage, setLoginMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const clearState = () => {
    setLoginMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
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
      setLoginMessage(data.message);
      if (response.ok) {
        setUserName(data.user.userName);
        setUserInfo(data.user);
        setLoginMessage("");
        navigate("/home");
      }
    } catch (error) {
      console.error("ERROR: Logging in a user on front-end -> ", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <div className="welcomeMessage">
        Welcome to Campus Connect!
        <p className="smallWelcome">Sign In</p>
      </div>
      <div className="Login">
        <form onSubmit={handleSubmit}>
          <div className="loginContainer">
            <label>
              <b>Username</b>
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              name="name"
              required
            />

            <label>
              <b>Password</b>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="pwd"
              required
            />

            <button type="submit">Login</button>
            <div className="userNotify">
              <p>
                <b>{loginMessage}</b>
              </p>
            </div>
            <div className="registerContainer">
              <h3>Create An Account</h3>
              <Link to="/signup" onClick={clearState}>
                <button className="loginSignUpButton">Sign Up</button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
