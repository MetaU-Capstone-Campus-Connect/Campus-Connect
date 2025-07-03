import "../Groups/css/AllGroups.css";
import GroupInfo from "./GroupInfo";

function AllGroups({ showGroups, userName, refreshGroups }) {
  return (
    <div className="AllGroups">
      {showGroups.map((group) => (
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
            </div>
            <div className="groupMoreInfo">
              <GroupInfo
                group={group}
                userName={userName}
                refreshGroups={refreshGroups}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AllGroups;
