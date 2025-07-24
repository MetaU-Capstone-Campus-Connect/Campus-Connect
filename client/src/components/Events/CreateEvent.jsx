import "../Events/css/CreateEvent.css";
import { useState } from "react";
import LoadingState from "../LoadingState";

function CreateEvent({ userName }) {
  const [modalStatus, setModalStatus] = useState(false);
  const [adminGroups, setAdminGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = async () => {
    setIsLoading(true);
    setModalStatus(true);
    try {
      const res = await fetch(`http://localhost:3000/user/${userName}/admin`);
      const groups = await res.json();
      setAdminGroups(groups);
    } catch (err) {
      console.error("Error: Fetching admin groups", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setModalStatus(false);
    setSelectedGroupId();
  };

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const name = event.target.eventName.value;
    const info = event.target.eventInfo.value;
    const date = event.target.eventDate.value;
    const img = event.target.eventImg.value;
    const location = event.target.eventLoco.value;
    const length = event.target.eventLength.value;

    try {
      const response = await fetch(`http://localhost:3000/createEvent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventHost: userName,
          eventName: name,
          eventInfo: info,
          eventDate: date,
          eventImg: img,
          eventLocation: location,
          eventLength: parseInt(length),
          userName: userName,
          groupId: selectedGroupId,
        }),
      });
      if (response.ok) {
        handleClose();
      }
    } catch (error) {
      console.error("ERROR: Creating a new event ", error);
    } finally {
      setIsLoading(false)
    }
  };

  if (isLoading) {
    return <LoadingState/>
  }

  return (
    <div className="CreateEvent">
      <button onClick={handleOpen}>Create Event</button>
      {modalStatus && (
        <div className="modalOverlayEvent">
          <div className="modalContentEvent">
            <form onSubmit={handleSubmit}>
              <button className="exitButton" onClick={handleClose}>
                <i className="fa fa-close"></i>
              </button>
              <h2>Create Event</h2>
              <input
                type="text"
                name="eventName"
                required
                placeholder="Enter Event Name"
              />
              <input
                type="text"
                name="eventInfo"
                required
                placeholder="Enter Event Description"
              />
              <input
                type="text"
                name="eventImg"
                placeholder="Enter Event Image"
              />
              <input
                type="text"
                name="eventLoco"
                required
                placeholder="Enter Event Location"
              />
              <input
                type="text"
                name="eventLength"
                required
                placeholder="Enter Event Length (Hours)"
              />
              <input
                type="datetime-local"
                name="eventDate"
                required
                placeholder="Enter Event Date & Time"
              />
              {adminGroups.length > 0 && (
                <select
                  value={selectedGroupId}
                  name="groupSelect"
                  onChange={(e) => setSelectedGroupId(parseInt(e.target.value))}
                >
                  <option disabled>Select Group</option>
                  {adminGroups.map((group) => (
                    <option key={group.groupId} value={group.groupId}>
                      {group.groupName}
                    </option>
                  ))}
                </select>
              )}
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
