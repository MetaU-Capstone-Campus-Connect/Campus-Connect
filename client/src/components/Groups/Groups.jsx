import "../Groups/css/Groups.css";
import Header from "../Header";
import Footer from "../Footer";
import CreateGroup from "./CreateGroup";

function Groups({ userName }) {
  return (
    <div className="Groups">
      <Header />

      <div className="groupManager">
        <div className="createGroup">
          <CreateGroup userName={userName} />
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
              placeholder="Search for groups..."
            />
            <button className="searchButton" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Groups;
