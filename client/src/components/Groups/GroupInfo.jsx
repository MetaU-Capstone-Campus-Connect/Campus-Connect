import "../Groups/css/GroupInfo.css";
import { useState } from "react";

function GroupInfo({ group, userName, refreshGroups }) {
  const [modalStatus, setModalStatus] = useState(false);

  const handleOpen = () => {
    setModalStatus(true);
  };

  const handleClose = () => {
    setModalStatus(false);
  };

  const handleJoin = async (event) => {
    try {
      const response = await fetch(
        `http://localhost:3000/group/${group.groupId}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName,
          }),
        },
      );
      const dataNew = await response.json();
      console.log(dataNew);
      await refreshGroups();
    } catch (error) {
      console.error("ERROR: Creating a new study group ", error);
    }
  };

  return (
    <div className="GroupInfo">
      <button onClick={handleOpen} className="infoButton">
        More Info
      </button>
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
                <button onClick={handleJoin}>Join Group</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupInfo;
