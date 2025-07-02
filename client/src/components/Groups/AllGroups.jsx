import "../Groups/css/AllGroups.css";

function AllGroups({ groups }) {
  
  return (
    <div className="AllGroups">
      {groups.map((group) => (
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
              <button>More Info</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AllGroups;
