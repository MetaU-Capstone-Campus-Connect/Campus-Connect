import "../User/css/ManageUserBio.css";
import { useState } from "react";

function ManageUserBio() {
  const [modalStatus, setModalStatus] = useState(false);

  const handleOpen = () => {
    setModalStatus(true);
  };

  const handleClose = () => {
    setModalStatus(false);
  };

  return (
    <div className="ManageUserBio">
      <button onClick={handleOpen}>Change Profile About Me</button>
      {modalStatus && (
        <div className="modalOverlay">
          <div className="modalContent">
            <form>
              <button className="exitButton" onClick={handleClose}>
                <i className="fa fa-close"></i>
              </button>
              <h2>Update Profile About Me</h2>
              <input
                type="aboutMe"
                name="aboutMe"
                required
                placeholder="Enter About Me"
              />
              <div>
                <button className="createButton">Update About Me</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUserBio;
