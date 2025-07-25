import "../User/css/ManageUserStatus.css";
import { useState } from "react";
import LoadingState from "../LoadingState";

function ManageUserStatus({ userInfo, setStatus }) {
  const [modalStatus, setModalStatus] = useState(false);
  const userName = userInfo.userName;
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => {
    setModalStatus(true);
  };

  const handleClose = () => {
    setModalStatus(false);
  };

  const handleUpdate = async (status) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/users/${userName}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userStatus: status }),
        },
      );
      if (response.ok) {
        handleClose();
        setStatus(status);
      }
    } catch (error) {
      console.error("ERROR: Updating user profile img-> ", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

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
                <button
                  className="onlineButton"
                  onClick={() => handleUpdate("ONLINE")}
                >
                  Online
                </button>
              </div>
              <div>
                <button
                  className="busyButton"
                  onClick={() => handleUpdate("BUSY")}
                >
                  Busy
                </button>
              </div>
              <div>
                <button
                  className="dndButton"
                  onClick={() => handleUpdate("DND")}
                >
                  Do Not Disturb
                </button>
              </div>
              <div>
                <button
                  className="offlineButton"
                  onClick={() => handleUpdate("OFFLINE")}
                >
                  Offline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUserStatus;
