import "../User/css/ManageProfileImg.css";
import { useState } from "react";

function ManageProfileImg() {
  const [modalStatus, setModalStatus] = useState(false);

  const handleOpen = () => {
    setModalStatus(true);
  };

  const handleClose = () => {
    setModalStatus(false);
  };

  return (
    <div className="ManageProfileImg">
      <button onClick={handleOpen}>
        Change Profile Picture
      </button>
      {modalStatus && (
        <div className="modalOverlay">
          <div className="modalContent">
            <form>
              <button className="exitButton" onClick={handleClose}>
                <i className="fa fa-close"></i>
              </button>
              <h2>Update Profile Banner</h2>
              <input
                type="imgURL"
                name="imgURL"
                required
                placeholder="Enter Profile URL"
              />
              <div>
                <button className="createButton">Update Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProfileImg;
