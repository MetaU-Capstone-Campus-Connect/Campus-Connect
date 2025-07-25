import "../User/css/UserEvents.css";
import { useState, useEffect } from "react";
import LoadingState from "../LoadingState";

function UserEvents({ userName }) {
  const [userEvents, setUserEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchJoinedEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/user/${userName}/events`,
      );
      const data = await response.json();
      setUserEvents(data);
    } catch (error) {
      console.error("Error fetching user events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJoinedEvents();
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="UserEvents">
      {userEvents.length === 0 ? (
        <p>Sorry, you haven't joined any events!</p>
      ) : (
        <div className="eventList">
          {userEvents.map((event) => (
            <div className="eventCard" key={event.eventId}>
              <div className="eventImg">
                <img
                  src={event.eventImg || "/src/assets/default-event.webp"}
                  width="200"
                  height="200"
                  className="eventImg"
                />
              </div>
              <div className="eventLower">
                <div className="eventTitle">
                  <h2>{event.eventName}</h2>
                  <p>{event.eventInfo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserEvents;
