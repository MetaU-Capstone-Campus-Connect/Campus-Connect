import "../Events/css/RecommendedEvents.css";
import { useState, useEffect } from "react";
import EventCard from "./EventCard";

function RecommendedEvents({ userName }) {
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/user/${userName}/scoreEvents`,
        );
        const data = await response.json();
        setRecommended(data);
      } catch (error) {
        console.error("Error: Fetching recommended events", error);
      }
    };
    fetchRecommended();
  }, [userName]);

  const handleJoin = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/event/${eventId}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userName }),
        },
      );

      if (response.ok) {
        setRecommended((prevEvents) =>
          prevEvents.map((event) => {
            if (event.eventId === eventId) {
              return {
                ...event,
                eventUsers: [...event.eventUsers, { userName }],
              };
            }
            return event;
          }),
        );
      }
    } catch (error) {
      console.error("Error: Joining recommended component event", error);
    }
  };

  return (
    <div className="RecommendedEvents">
      <h2>My Recommended Events</h2>
      <div className="recommendedList">
        {recommended.length === 0 ? (
          <p>Sorry, you don't have any recommended events at this moment!</p>
        ) : (
          [...recommended]
            .sort((a, b) => {
              const scoreA = a.scoreTitle + a.scoreInfo + a.scoreLocation;
              const scoreB = b.scoreTitle + b.scoreInfo + b.scoreLocation;
              return scoreB - scoreA;
            })
            .slice(0, 5)
            .map((event) => (
              <EventCard
                event={event}
                userName={userName}
                onJoin={handleJoin}
              />
            ))
        )}
      </div>
    </div>
  );
}

export default RecommendedEvents;
