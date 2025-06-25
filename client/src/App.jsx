import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router";
import { useState } from "react";
import HomePage from "./components/Home/HomePage";
import SignUp from "./components/Home/SignUp";
import Login from "./components/Home/Login";

function App() {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Login
                  welcomeMessage={welcomeMessage}
                  setWelcomeMessage={setWelcomeMessage}
                />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <SignUp
                  welcomeMessage={welcomeMessage}
                  setWelcomeMessage={setWelcomeMessage}
                />
              </>
            }
          />
          <Route
            path="/home"
            element={
              <>
                <HomePage welcomeMessage={welcomeMessage} />
              </>
            }
          />
          <Route path="/users/:ids" element={<></>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
