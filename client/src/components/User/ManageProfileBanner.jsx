import "../User/css/ManageProfileBanner.css";
import { useState } from "react";

function ManageProfileBanner() {
  const [modalStatus, setModalStatus] = useState(false);

  const handleOpen = () => {
    setModalStatus(true);
  };

  const handleClose = () => {
    setModalStatus(false);
  };

  return (
    <div className="ManageProfileBanner">
      <button onClick={handleOpen}>
        Change Profile Banner
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
                type="bannerURL"
                name="bannerURL"
                required
                placeholder="Enter Banner URL"
              />
              <div>
                <button className="createButton">Update Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProfileBanner;
