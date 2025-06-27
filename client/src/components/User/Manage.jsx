import "../User/css/Manage.css";
import { useState } from "react";
import ManageProfileBanner from "./ManageProfileBanner";
import ManageProfileImg from "./ManageProfileImg";
import ManageUserStatus from "./ManageUserStatus";
import ManageUserBio from "./ManageUserBio";

function Manage() {
  const [modalStatus, setModalStatus] = useState(false);

  const handleOpen = () => {
    setModalStatus(true);
  };

  const handleClose = () => {
    setModalStatus(false);
  };

  return (
    <div className="Manage">
      <button onClick={handleOpen}>Manage Profile</button>
      {modalStatus && (
        <div className="modalOverlay">
          <div className="modalContent">
            <button className="exitButton" onClick={handleClose}>
              <i className="fa fa-close"></i>
            </button>
            <h2>Manage Profile</h2>
            <div className="manageStatus">
              <ManageProfileBanner onClick={console.log("TEST")} />
              <ManageProfileImg onClick={handleClose} />
              <ManageUserStatus onClick={handleClose} />
              <ManageUserBio onClick={handleClose} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Manage;
