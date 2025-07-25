import "../Home/css/SignUp.css";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import LoadingState from "../LoadingState";

function SignUp({ setUserName, setUserInfo }) {
  const [signUpMessage, setSignUpMessage] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const clearState = () => {
    setSignUpMessage("");
  };

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const userName = event.target.name.value;
    const userPwd = event.target.pwd.value;
    const userPwdConfirm = event.target.pwdConfirm.value;
    const newUser = { userName, userPwd };

    if (userPwd !== userPwdConfirm) {
      setSignUpMessage("⚠️ Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
        credentials: "include",
      });

      const data = await response.json();
      setSignUpMessage(data.message);

      if (response.ok) {
        setUserName(data.user.userName);
        setUserInfo(data.user);
        setSignUpMessage("");
        navigate("/home");
      }
    } catch (error) {
      console.error("ERROR: Creating a user on front-end -> ", error);
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
        <p className="smallWelcome">Create An Account</p>
      </div>
      <div className="SignUp">
        <form onSubmit={handleSubmit}>
          <div className="signUpContainer">
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

            <label>
              <b>Repeat Password</b>
            </label>
            <input
              type="password"
              placeholder="Repeat Password"
              name="pwdConfirm"
              required
            />

            <div className="returnToLogin">
              <Link to="/" onClick={clearState}>
                <button type="button" class="cancelbtn">
                  Cancel
                </button>
              </Link>
              <button type="submit" class="signupbtn">
                Sign Up
              </button>
            </div>
            <div className="notifyUser">
              <p>
                <b>{signUpMessage}</b>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignUp;
