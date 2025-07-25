import "../User/css/UserProfile.css";
import Header from "../Header";
import Manage from "./Manage";
import UserGroups from "./UserGroups";
import UserEvents from "./UserEvents";
import { useState } from "react";
import formatDatetime from "../../utils";

function UserProfile({ userInfo, userName }) {
  const [bannerUrl, setBannerUrl] = useState(userInfo.userProfileBanner);
  const [profileUrl, setProfileUrl] = useState(userInfo.userProfileImg);
  const [status, setStatus] = useState(userInfo.userStatus);
  const [aboutMe, setAboutMe] = useState(userInfo.userBio);

  return (
    <>
      <Header />
      <div className="UserProfile">
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
            {formatDatetime.formattedDate(userInfo.accountDate)}
          </div>
        </div>

        <div className="userInfoRow">
          <div className="userNameTitle">{userInfo.userName}</div>
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
      </div>
    </>
  );
}

export default UserProfile;
