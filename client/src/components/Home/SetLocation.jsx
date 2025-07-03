import "../Home/css/SetLocation.css";
import { useState } from "react";

function SetLocation({ userName, getLocations }) {
  const [modalStatus, setModalStatus] = useState(false);

  const handleOpen = () => {
    setModalStatus(true);
  };

  const handleClose = () => {
    setModalStatus(false);
  };

  const addLocation = async (event) => {
    event.preventDefault();
    const statusMesage = event.target.status.value;
    navigator.geolocation.getCurrentPosition(async (position) => {
      const locationData = {
        mapUserName: userName,
        mapLong: position.coords.longitude,
        mapLat: position.coords.latitude,
        message: statusMesage || "No Location Status Set",
      };

      try {
        const response = await fetch("http://localhost:3000/setLocation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(locationData),
          credentials: "include",
        });

        if (response) {
          getLocations();
          handleClose();
        }
      } catch (error) {
        console.error("Error: Adding location on the front end", error);
      }
    });
  };

  const deleteLocation = async (user) => {
    try {
      const response = await fetch("http://localhost:3000/deleteLocation", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( {mapUserName: user}),
        credentials: "include",
      });

      if (response){
        getLocations();
        handleClose();
      }
    } catch (error) {
      console.error("Error: Deleting location on the front end", error);
    }
  }

  return (
    <div className="SetLocation">
      <button onClick={handleOpen}>Manage Location</button>
      {modalStatus && (
        <div className="modalOverlay">
          <div className="modalContent">
            <form onSubmit={addLocation}>
              <button className="exitButton" onClick={handleClose}>
                <i className="fa fa-close"></i>
              </button>
              <h2>Manage Location</h2>
              <input
                type="status"
                name="status"
                placeholder="Enter Status Location Message"
              />
              <div>
                <button className="createButton" type="submit">
                  Set Location
                </button>
                <button className="deleteButton" type="button" onClick={() => deleteLocation(userName)}>Delete Location</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SetLocation;
