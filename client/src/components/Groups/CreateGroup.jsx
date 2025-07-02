import "../Groups/css/CreateGroup.css";
import { useState } from "react";

function CreateGroup({ userName }) {
  const [modalStatus, setModalStatus] = useState(false);

  const handleOpen = () => {
    setModalStatus(true);
  };

  const handleClose = () => {
    setModalStatus(false);
  };

  const handleUSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.groupName.value;
    const desc = event.target.groupDesc.value;
    const img = event.target.groupImg.value;
    console.log({ name, desc, img, userName });
    try {
      const response = await fetch(`http://localhost:3000/createGroup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupName: name,
          groupInfo: desc,
          groupImg: img,
          userName: userName,
        }),
      });
      if (response.ok) {
        handleClose();
        console.log("YES");
      }
    } catch (error) {
      console.error("ERROR: Creating a new study group ", error);
    }
  };

  return (
    <div className="CreateGroup">
      <button onClick={handleOpen}>Create Study Group</button>
      {modalStatus && (
        <div className="modalOverlay">
          <div className="modalContent">
            <form onSubmit={handleUSubmit}>
              <button className="exitButton" onClick={handleClose}>
                <i className="fa fa-close"></i>
              </button>
              <h2>Create Study Group</h2>
              <input
                type="groupName"
                name="groupName"
                required
                placeholder="Enter Study Group Name"
              />
              <input
                type="groupDesc"
                name="groupDesc"
                required
                placeholder="Enter Study Group Description"
              />
              <input
                type="groupImg"
                name="groupImg"
                required
                placeholder="Enter Study Group Image"
              />
              <div>
                <button className="createButton" type="submit">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateGroup;
