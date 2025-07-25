import { useEffect, useState } from "react";
import "../User/css/UserHover.css";
import formatDatetime from "../../utils";

function UserHover({ userName, children }) {
  const [hovering, setHovering] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (hovering && userName && userData == null) {
      fetch(`http://localhost:3000/users/${userName}`)
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((err) => console.error("Error: Fetching user data", err));
    }
  }, [hovering, userName]);

  return (
    <div
      className="userHoverContainer"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {children}

      {hovering && userData && (
        <div className="userHoverPreview">
          <div className="userHoverTopDiv">
            <div className="userPics">
              <div className="bannerImg">
                <img
                  src={
                    userData.userProfileBanner ||
                    "/src/assets/default-banner.png"
                  }
                  className="userBanner"
                  alt="userBanner"
                  width="275"
                  height="150"
                />
              </div>
              <div className="profileImg">
                <img
                  src={
                    userData.userProfileImg ||
                    "/src/assets/default-profile.avif"
                  }
                  className="userImg"
                  alt="userImg"
                  width="100"
                  height="100"
                />
              </div>
            </div>
          </div>
          <div className="userHoverBottomDiv">
            <h2>{userData.userName}</h2>
            <h4>Status: {userData.userStatus}</h4>
            <p>{userData.userBio}</p>
            <p>
              Join Date: {formatDatetime.formattedDate(userData.accountDate)}
            </p>
            <div className="userHoverBottomParent">
              <div className="userHoverBottomEvents">
                <h4>Events</h4>
                {userData.Events?.length > 0 ? (
                  userData.Events.map((event) => (
                    <p key={event.eventId}>{event.eventName}</p>
                  ))
                ) : (
                  <p>No Events</p>
                )}
              </div>
              <div className="userHoverBottomGroups">
                <h4>Groups</h4>
                {userData.members?.length > 0 ? (
                  userData.members.map((m) => (
                    <p key={m.group.groupId}>{m.group.groupName}</p>
                  ))
                ) : (
                  <p>No Groups</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserHover;
