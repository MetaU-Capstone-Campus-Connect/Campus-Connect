import "../User/css/UserProfile.css";
import Header from "../Header";
import Footer from "../Footer";
import Manage from "./Manage";
import UserGroups from "./UserGroups";
import UserEvents from "./UserEvents";
import { useState } from "react";

function UserProfile({ userInfo, userName }) {
  if (!userInfo) {
    return <div>LOADING...</div>;
    // Add error page component
  }

  const [bannerUrl, setBannerUrl] = useState(userInfo.userProfileBanner);
  const [profileUrl, setProfileUrl] = useState(userInfo.userProfileImg);
  const [status, setStatus] = useState(userInfo.userStatus);
  const [aboutMe, setAboutMe] = useState(userInfo.userBio);

  const formattedDate = (release_date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(release_date).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Header />
      <div className="UserProfile">
        {/* LEFT SIDE OF SITE*/}
        <div className="userInfoColumn">
          <div className="manageProfile">
            <Manage
              userInfo={userInfo}
              setBannerUrl={setBannerUrl}
              setProfileUrl={setProfileUrl}
              setStatus={setStatus}
              setAboutMe={setAboutMe}
            />
          </div>
          <div className="accountDate">
            <b>Join Date: </b>
            {formattedDate(userInfo.accountDate)}
          </div>
        </div>

        {/* RIGHT SIDE OF SITE */}
        <div className="userInfoRow">
          <div className="userNameTitle">{userInfo.userName}</div>
          {/* IMGS, BIO, STATUS OF SITE */}
          <div className="userInfoUpper">
            <div className="userPics">
              <div className="bannerImg">
                <img
                  src={bannerUrl || "/src/assets/default-banner.png"}
                  className="userBanner"
                  alt="userBanner"
                  width="1500"
                  height="350"
                />
              </div>
              <div className="profileImg">
                <img
                  src={profileUrl || "/src/assets/default-profile.avif"}
                  className="userImg"
                  alt="userImg"
                  width="200"
                  height="200"
                />
              </div>
              <div className="userDirectInfo">
                <div className="userStatus">{status}</div>
                <div className="userBio">{aboutMe}</div>
              </div>
            </div>
            <div className="userName"></div>
          </div>

          {/* GROUPS & ACTIVITY OF USER */}
          <div className="userInfoLower">
            <div className="userGroups">
              <h2>Groups</h2>
              <UserGroups userName={userName} />
            </div>
            <div className="userActivity">
              <h2>Events</h2>
              <UserEvents userName={userName} />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default UserProfile;
