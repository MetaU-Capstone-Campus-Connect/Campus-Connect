import "../User/css/ManageProfileImg.css";
import { useState } from "react";

function ManageProfileImg({ userInfo, setProfileUrl }) {
  const [modalStatus, setModalStatus] = useState(false);
  const userName = userInfo.userName;

  const handleOpen = () => {
    setModalStatus(true);
  };

  const handleClose = () => {
    setModalStatus(false);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const imgURL = event.target.imgURL.value;
    try {
      const response = await fetch(
        `http://localhost:3000/users/${userName}/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userProfileImg: imgURL }),
        },
      );
      if (response.ok) {
        handleClose();
        setProfileUrl(imgURL);
      }
    } catch (error) {
      console.error("ERROR: Updating user profile img-> ", error);
    }
  };

  return (
    <div className="ManageProfileImg">
      <button onClick={handleOpen}>Change Profile Picture</button>
      {modalStatus && (
        <div className="modalOverlay">
          <div className="modalContent">
            <form onSubmit={handleUpdate}>
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
