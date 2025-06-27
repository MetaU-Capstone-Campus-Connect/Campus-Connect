import "../User/css/UserProfile.css";
import Header from "../Header";
import Footer from "../Footer";
import Manage from "./Manage";

function UserProfile({ userInfo }) {
  return (
    <>
      <Header />
      {/* <h1>{userInfo}</h1> */}
      <div className="UserProfile">
        {/* LEFT SIDE OF SITE*/}
        <div className="userInfoColumn">
          <div className="manageProfile">
            <Manage />
          </div>
        </div>

        {/* RIGHT SIDE OF SITE */}
        <div className="userInfoRow">
          {/* IMGS, BIO, STATUS OF SITE */}
          <div className="userInfoUpper">
            <div className="userPics">
              <div className="bannerImg">
                <img
                  src="https://www.altavia.hu/wp-content/uploads/2020/11/Hero-Banner-Placeholder-Light-1024x480-1.png"
                  className="userBanner"
                  alt="userBanner"
                  width="1500"
                  height="350"
                />
              </div>
              <div className="profileImg">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                  className="userImg"
                  alt="userImg"
                  width="200"
                  height="200"
                />
              </div>
            </div>
            <div className="userBio"></div>
            <div className="userStatus"></div>
            <div className="userName"></div>
          </div>

          {/* GROUPS & ACTIVITY OF USER */}
          <div className="userInfoLower">
            <div className="userGroups">
              <h2>User Groups</h2>
            </div>
            <div className="userActivity">
              <h2>User Activity</h2>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default UserProfile;


{/* <img
src="https://www.altavia.hu/wp-content/uploads/2020/11/Hero-Banner-Placeholder-Light-1024x480-1.png"
className="userBanner"
alt="userBanner"
/>
<img
src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
className="userImg"
alt="userImg"
/> */}