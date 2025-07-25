import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router";
import { useState, useEffect } from "react";
import HomePage from "./components/Home/HomePage";
import SignUp from "./components/Home/SignUp";
import Login from "./components/Home/Login";
import UserProfile from "./components/User/UserProfile";
import Groups from "./components/Groups/Groups";
import Events from "./components/Events/Events";
import WithAuth from "./WithAuth";

function App() {
  const [userName, setUserName] = useState();
  const [userInfo, setUserInfo] = useState();

  const ProtectedHomePage = WithAuth((props) => (
    <HomePage {...props} userInfo={userInfo} userName={userName} />
  ));

  const ProtectedUserProfile = WithAuth((props) => (
    <UserProfile {...props} userInfo={userInfo} userName={userName} />
  ));

  const ProtectedGroups = WithAuth((props) => (
    <Groups {...props} userInfo={userInfo} userName={userName} />
  ));

  const ProtectedEvents = WithAuth((props) => (
    <Events {...props} userInfo={userInfo} userName={userName} />
  ));

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
        } else {
          setUserName(null);
          setUserInfo(null);
        }
      } catch (error) {
        console.error("Error: Checking user session:");
        setUserInfo(null);
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
                <ProtectedHomePage userInfo={userInfo} userName={userName} />
              </>
            }
          />
          <Route
            path="/users/:name"
            element={
              <>
                <ProtectedUserProfile userInfo={userInfo} userName={userName} />
              </>
            }
          />
          <Route
            path="/study-groups"
            element={
              <>
                <ProtectedGroups userInfo={userInfo} userName={userName} />
              </>
            }
          />
          <Route
            path="/events"
            element={
              <>
                <ProtectedEvents userInfo={userInfo} userName={userName} />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
