import "../User/css/UserProfile.css";
import Header from "../Header";
import Footer from "../Footer";

function UserProfile() {
  return (
    <div className="UserProfile">
      <Header />
      <div className="userProfilePicture"></div>
      <Footer />
    </div>
  );
}

export default UserProfile;
