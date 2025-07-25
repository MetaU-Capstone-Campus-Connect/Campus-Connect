import "../User/css/UserGroups.css";
import { useState, useEffect } from "react";
import LoadingState from "../LoadingState";

function UserGroups({ userName }) {
  const [userGroups, setUserGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchJoinedGroups = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/user/${userName}/groups`,
      );
      const data = await response.json();
      setUserGroups(data);
    } catch (error) {
      console.error("Error fetching user groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJoinedGroups();
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="UserGroups">
      {userGroups.length === 0 ? (
        <p>Sorry, you haven't joined any groups!</p>
      ) : (
        <div className="groupList">
          {userGroups.map((group) => (
            <div className="groupCard" key={group.group.groupId}>
              <div className="groupImg">
                <img
                  src={group.group.groupImg || "/src/assets/default-group.jpeg"}
                  width="200"
                  height="200"
                  className="groupImg"
                />
              </div>
              <div className="groupLower">
                <div className="groupTitle">
                  <h2>{group.group.groupName}</h2>
                  <p>{group.group.groupInfo}</p>
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
