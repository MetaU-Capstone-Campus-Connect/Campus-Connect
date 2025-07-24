import "../Groups/css/Groups.css";
import { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import CreateGroup from "./CreateGroup";
import AllGroups from "./AllGroups";
import LoadingState from "../LoadingState";

function Groups({ userName }) {
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [groupFilter, setGroupFitler] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllGroups = () => {
    fetch("http://localhost:3000/groups")
      .then((response) => response.json())
      .then((data) => {
        setGroups(data);
      });
  };

  const fetchJoinedGroups = () => {
    fetch(`http://localhost:3000/user/${userName}/groups`)
      .then((response) => response.json())
      .then((data) => {
        const groupData = data.map((group) => group.group);
        setMyGroups(groupData);
      });
  };

  useEffect(() => {
    fetchAllGroups();
    fetchJoinedGroups();
  }, []);

  const displayGroups = groupFilter ? myGroups : groups;
  const showGroups = displayGroups.filter((group) =>
    group.groupName.includes(searchQuery),
  );

  const checkJoined = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/user/${userName}/groups`,
      );
      const data = await response.json();
      const groupData = data.map((group) => group.group);
      setMyGroups(groupData);

      if (data.length === 0) {
        setShowMessage(true);
        setGroupFitler(false);
        setTimeout(() => setShowMessage(false), 3000);
      } else {
        setGroupFitler(true);
      }
    } catch (error) {
      console.error("Error : Fetching user joined groups", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState/>
  }

  return (
    <div className="Groups">
      <Header />

      <div className="groupManager">
        <div className="createGroup">
          <CreateGroup
            userName={userName}
            refreshGroups={() => {
              fetchAllGroups(), fetchJoinedGroups();
            }}
          />
        </div>

        <div className="filterGroups">
          <div className="memberGroups">
            <button
              onClick={() => {
                checkJoined();
                setSearchQuery("");
              }}
            >
              My Groups
            </button>
          </div>
          <div className="allGroups">
            <button
              onClick={() => {
                setGroupFitler(false);
                setSearchQuery("");
              }}
            >
              All Groups
            </button>
          </div>
        </div>

        <div className="searchGroups">
          <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
            <input
              className="searchInput"
              type="text"
              name="board"
              placeholder="Search for study groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>

      {showMessage && (
        <div className="errorMessage">
          <h2>Sorry, you haven't joined any groups yet!</h2>
        </div>
      )}

      <div className="groupsContainer">
        <AllGroups
          showGroups={showGroups}
          userName={userName}
          refreshGroups={fetchAllGroups}
        />
      </div>

      <Footer />
    </div>
  );
}

export default Groups;
