import "../User/css/ManageProfileBanner.css";
import { useState } from "react";

function ManageProfileBanner({ userInfo, setBannerUrl }) {
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
    const bannerURL = event.target.bannerURL.value;

    try {
      const response = await fetch(
        `http://localhost:3000/users/${userName}/banner`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userProfileBanner: bannerURL }),
        },
      );
      if (response.ok) {
        handleClose();
        setBannerUrl(bannerURL);
      }
    } catch (error) {
      console.error("ERROR: Updating user profile banner-> ", error);
    }
  };

  return (
    <div className="ManageProfileBanner">
      <button onClick={handleOpen}>Change Profile Banner</button>
      {modalStatus && (
        <div className="modalOverlay">
          <div className="modalContent">
            <form onSubmit={handleUpdate}>
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
