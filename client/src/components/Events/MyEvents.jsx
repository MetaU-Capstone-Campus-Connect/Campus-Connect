import "../Events/css/MyEvents.css";
import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import LoadingState from "../LoadingState";

function MyEvents({ userName }) {
  const [rsvpEvents, setRsvpEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMyEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/user/${userName}/events`,
        );
        const data = await response.json();
        const now = new Date();
        const futureEvents = data.filter(
          (event) => new Date(event.eventDate) > now,
        );

        setRsvpEvents(futureEvents);
      } catch (error) {
        console.error("Error: Fetching upcoming future events", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyEvents();
  }, [userName]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="MyEvents">
      <h2>Upcoming Events</h2>
      <div className="myEventsList">
        {rsvpEvents.length === 0 ? (
          <p>Sorry, you don't have any upcoming events at this moment!</p>
        ) : (
          rsvpEvents.map((event) => (
            <EventCard key={event.eventId} event={event} userName={userName} />
          ))
        )}
      </div>
    </div>
  );
}

export default MyEvents;
