import "../User/css/ManageUserStatus.css";
import { useState } from "react";

function ManageUserStatus() {
  const [modalStatus, setModalStatus] = useState(false);

  const handleOpen = () => {
    setModalStatus(true);
  };

  const handleClose = () => {
    setModalStatus(false);
  };

  return (
    <div className="ManageUserStatus">
      <button onClick={handleOpen}>Update Status</button>
      {modalStatus && (
        <div className="modalOverlay">
          <div className="modalContent">
            <button className="exitButton" onClick={handleClose}>
              <i className="fa fa-close"></i>
            </button>
            <h2>Update Profile Status</h2>
            <div className="manageStatus">
              <div>
                <button className="onlineButton">Online</button>
              </div>
              <div>
                <button className="busyButton">Busy</button>
              </div>
              <div>
                <button className="dndButton">Do Not Disturb</button>
              </div>
              <div>
                <button className="offlineButton">Offline</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUserStatus;
