import "../Groups/css/Groups.css";
import { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import CreateGroup from "./CreateGroup";
import AllGroups from "./AllGroups";

function Groups({ userName }) {
  const [groups, setGroups] = useState([]);

  const fetchGroups = () => {
    fetch("http://localhost:3000/groups")
      .then((response) => response.json())
      .then((data) => {
        setGroups(data);
      });
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="Groups">
      <Header />

      <div className="groupManager">
        <div className="createGroup">
          <CreateGroup userName={userName} refreshGroups={fetchGroups}/>
        </div>

        <div className="filterGroups">
          <div className="memberGroups">
            <button>My Groups</button>
          </div>
          <div className="allGroups">
            <button>All Groups</button>
          </div>
        </div>

        <div className="searchGroups">
          <form className="searchForm">
            <input
              className="searchInput"
              type="text"
              name="board"
              placeholder="Search for study groups..."
            />
            <button className="searchButton" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="groupsContainer">
        <AllGroups groups={groups} />
      </div>

      <Footer />
    </div>
  );
}

export default Groups;
