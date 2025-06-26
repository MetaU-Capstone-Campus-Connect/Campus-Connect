import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router";
import { useState } from "react";
import HomePage from "./components/Home/HomePage";
import SignUp from "./components/Home/SignUp";
import Login from "./components/Home/Login";
import UserProfile from "./components/User/UserProfile";

function App() {
  const [loginMessage, setLoginMessage] = useState("");
  const [signUpMessage, setSignUpMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [userInfo, setUserInfo] = useState("");

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Login
                  loginMessage={loginMessage}
                  setLoginMessage={setLoginMessage}
                  setUserName={setUserName}
                  setUserInfo={setUserInfo}
                />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <SignUp
                  signUpMessage={signUpMessage}
                  setSignUpMessage={setSignUpMessage}
                  setUserName={setUserName}
                  setUserInfo={setUserInfo}
                />
              </>
            }
          />
          <Route
            path="/home"
            element={
              <>
                <HomePage
                  userName={userName}
                  setUserName={setUserName}
                />
              </>
            }
          />
          <Route
            path="/users/:name"
            element={
              <>
                <UserProfile userInfo={userInfo}/>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
