import "../User/css/ManageUserBio.css";
import { useState } from "react";

function ManageUserBio({ userInfo, setAboutMe }) {
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
    const newBio = event.target.aboutMe.value;
    try {
      const response = await fetch(
        `http://localhost:3000/users/${userName}/bio`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userBio: newBio }),
        },
      );
      if (response.ok) {
        handleClose();
        setAboutMe(newBio);
      }
    } catch (error) {
      console.error("ERROR: Updating user profile img-> ", error);
    }
  };

  return (
    <div className="ManageUserBio">
      <button onClick={handleOpen}>Change Profile About Me</button>
      {modalStatus && (
        <div className="modalOverlay">
          <div className="modalContent">
            <form onSubmit={handleUpdate}>
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
