import "../User/css/UserProfile.css";
import Header from "../Header";
import Footer from "../Footer";
import Manage from "./Manage";

function UserProfile({ userInfo }) {
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
            <Manage />
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
                  src={userInfo.userProfileBanner}
                  className="userBanner"
                  alt="userBanner"
                  width="1500"
                  height="350"
                />
              </div>
              <div className="profileImg">
                <img
                  src={userInfo.userProfileImg}
                  className="userImg"
                  alt="userImg"
                  width="200"
                  height="200"
                />
              </div>
              <div className="userDirectInfo">
                <div className="userStatus">{userInfo.userStatus}</div>
                <div className="userBio">{userInfo.userBio}</div>
              </div>
            </div>
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
