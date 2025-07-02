import { useEffect } from "react";
import "../Groups/css/GroupInfo.css";
import { useState } from "react";

function GroupInfo( {group}) {
  const [modalStatus, setModalStatus] = useState(false);

  const handleOpen = () => {
    setModalStatus(true);
  };

  const handleClose = () => {
    setModalStatus(false);
  };

  return (
    <div className="GroupInfo">
      <button onClick={handleOpen}>More Info</button>
      {modalStatus && (
        <div className="modalOverlayGroup">
          <div className="modalContentGroup">
            <button className="exitButton" onClick={handleClose}>
              <i className="fa fa-close"></i>
            </button>
            <h1>{group.groupName}</h1>
            <div className="groupInfoImg">
              <img
                src={group.groupImg || "/src/assets/default-group.jpeg"}
                width="300"
                height="300"
                className="groupInfoImg"
              />
            </div>
            <div className="groupSpecificContainer">
              <div className="groupDesc">{group.groupInfo}</div>
              <div className="groupInfoList">
                <div className="groupEvents">
                  <h3>Group Events</h3>
                </div>
                <div className="groupMembers">
                  <h3>Group Members</h3>
                  {group.groupMembers.map((member) => (
                    <p>{member.userName}</p>
                  ))}
                </div>
              </div>
              <div className="joinButton">
                {/* Only show if not member */}
                <button>Join Group</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupInfo;
