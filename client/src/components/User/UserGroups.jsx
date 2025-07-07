import "../User/css/UserGroups.css";
import { useState, useEffect } from "react";

function UserGroups({ userName }) {
  const [userGroups, setUserGroups] = useState([]);

  const fetchJoinedGroups = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/${userName}/groups`,
      );
      const data = await response.json();
      setUserGroups(data);
    } catch (error) {
      console.error("Error fetching user groups:", error);
    }
  };

  useEffect(() => {
    fetchJoinedGroups();
  }, []);

  return (
    <div className="UserGroups">
      {userGroups.length === 0 ? (
        <p>Sorry, you haven't joined any groups!</p>
      ) : (
        <div className="groupList">
          {userGroups.map((group) => (
            <div className="groupCard" key={group.groupId}>
              <div className="groupImg">
                <img
                  src={group.groupImg || "/src/assets/default-group.jpeg"}
                  width="200"
                  height="200"
                  className="groupImg"
                />
              </div>
              <div className="groupLower">
                <div className="groupTitle">
                  <h2>{group.groupName}</h2>
                  <p>{group.groupInfo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserGroups;
