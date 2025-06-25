import "../Home/css/SignUp.css";
import Header from "../Header";
import Footer from "../Footer";
import { Link, useNavigate } from "react-router";

function SignUp( { welcomeMessage, setWelcomeMessage } ) {
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const userName = event.target.name.value;
    const userPwd = event.target.pwd.value;
    const userPwdConfirm = event.target.pwdConfirm.value;
    const newUser = { userName, userPwd };

    if (userPwd !== userPwdConfirm) {
      setWelcomeMessage("Passwords do not match!");
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
      setWelcomeMessage(data.message);

      if (response.ok) {
        navigate('/home');
      }
    } catch (error) {
      console.error("ERROR: Creating a user on front-end -> ", error);
    }
  };

  return (
    <div className="SignUp">
      <Header />
      <h1>{welcomeMessage}</h1>
      <form onSubmit={handleSubmit}>
        <div className="signUpContainer">
          <h1>Sign Up</h1>

          <label>
            <b>User Name</b>
          </label>
          <input
            type="text"
            placeholder="Enter UserName"
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

          <div class="clearfix">
            <Link to="/">
              <button type="button" class="cancelbtn">
                Cancel
              </button>
            </Link>
            <button type="submit" class="signupbtn">
              Sign Up
            </button>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
}

export default SignUp;
