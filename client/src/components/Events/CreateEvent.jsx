import "../Events/css/CreateEvent.css";
import { useState } from "react";

function CreateEvent({ userName }) {
  const [modalStatus, setModalStatus] = useState(false);

  const handleOpen = () => {
    setModalStatus(true);
  };

  const handleClose = () => {
    setModalStatus(false);
  };

  const handleUSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.eventName.value;
    const info = event.target.eventInfo.value;
    const date = event.target.eventDate.value;
    const img = event.target.eventImg.value;
    const location = event.target.eventLoco.value;


    try {
      const response = await fetch(`http://localhost:3000/createEvent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: name,
          eventInfo: info,
          eventDate: date,
          eventImg: img, 
          eventLocation: location, 
          userName: userName,
        }),
      });
      if (response.ok) {
        handleClose();
        refreshGroups();
      }
    } catch (error) {
      console.error("ERROR: Creating a new study group ", error);
    }
  };


  return (
    <div className="CreateEvent">
      <button onClick={handleOpen}>Create Event</button>
      {modalStatus && (
        <div className="modalOverlayEvent">
          <div className="modalContentEvent">
            <form onSubmit={handleUSubmit}>
              <button className="exitButton" onClick={handleClose}>
                <i className="fa fa-close"></i>
              </button>
              <h2>Create Event</h2>
              <input
                type="eventName"
                name="eventName"
                required
                placeholder="Enter Event Name"
              />
              <input
                type="eventInfo"
                name="eventInfo"
                required
                placeholder="Enter Event Description"
              />
              <input
                type="eventImg"
                name="eventImg"
                placeholder="Enter Event Image"
              />
              <input
                type="eventLoco"
                name="eventLoco"
                required
                placeholder="Enter Event Location"
              />
              <input
                type="datetime-local"
                name="eventDate"
                required
                placeholder="Enter Event Date & Time"
              />
              <div>
                <button className="createButton" type="submit">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateEvent;
