import "../Groups/css/GroupInfo.css";
import { useState } from "react";
import UserHover from "../User/UserHover";
import LoadingState from "../LoadingState";

function GroupInfo({ group, userName }) {
  const [modalStatus, setModalStatus] = useState(false);
  const [groupState, setGroupState] = useState(group);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => {
    setModalStatus(true);
  };

  const handleClose = () => {
    setModalStatus(false);
  };

  const handleJoin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/group/${groupState.groupId}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userName }),
        },
      );

      if (response.ok) {
        const updatedMembers = [
          ...groupState.members,
          {
            user: { userName },
            rank: "MEMBER",
          },
        ];
        setGroupState({ ...groupState, members: updatedMembers });
      }
    } catch (error) {
      console.error("Error: Joining group", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

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
                  {group.groupEvents?.length > 0 ? (
                    group.groupEvents.map((event) => (
                      <div key={event.eventId} className="groupEventItem">
                        <p>
                          <b>{event.eventName}</b>
                        </p>
                        <p>{event.eventInfo}</p>
                        <p>{new Date(event.eventDate).toLocaleString()}</p>
                      </div>
                    ))
                  ) : (
                    <p>No events currently scheduled!</p>
                  )}
                </div>
                <div className="groupMembers">
                  <h3>Group Members</h3>
                  {[...group.members]
                    .sort((a, b) => (a.rank === "ADMIN" ? -1 : 1))
                    .map((member) => (
                      <UserHover userName={member.user.userName}>
                        <p className="groupMemberList">
                          {member.user.userName}
                          {member.rank === "ADMIN" && " (Group Leader)"}
                        </p>
                      </UserHover>
                    ))}
                </div>
              </div>
              <div className="joinButton">
                {groupState.members.some(
                  (member) => member.user.userName === userName,
                ) ? (
                  <button disabled className="joinedButton">
                    Joined
                  </button>
                ) : (
                  <button onClick={handleJoin}>Join Group</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupInfo;
