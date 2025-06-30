import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router";
import { useState, useEffect } from "react";
import HomePage from "./components/Home/HomePage";
import SignUp from "./components/Home/SignUp";
import Login from "./components/Home/Login";
import UserProfile from "./components/User/UserProfile";

function App() {
  const [userName, setUserName] = useState();
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:3000/verify", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.user.userName);
          setUserInfo(data.user);
        }
      } catch (error) {
        console.error("Error: Checking user session:");
      }
    };
    checkSession();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Login setUserName={setUserName} setUserInfo={setUserInfo} />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <SignUp setUserName={setUserName} setUserInfo={setUserInfo} />
              </>
            }
          />
          <Route
            path="/home"
            element={
              <>
                <HomePage userName={userName} />
              </>
            }
          />
          <Route
            path="/users/:name"
            element={
              <>
                <UserProfile userInfo={userInfo} />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
