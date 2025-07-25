import "../Events/css/RecommendedEvents.css";
import { useState, useEffect } from "react";
import EventCard from "./EventCard";
import LoadingState from "../LoadingState";

function RecommendedEvents({ userName }) {
  const [recommended, setRecommended] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecommended = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/user/${userName}/scoreEvents`,
        );
        const data = await response.json();
        setRecommended(data);
      } catch (error) {
        console.error("Error: Fetching recommended events", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommended();
  }, [userName]);

  const handleJoin = async (eventId) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="RecommendedEvents">
      <h2>My Recommended Events</h2>
      <div className="recommendedList">
        {recommended.length === 0 ? (
          <p>Sorry, you don't have any recommended events at this moment!</p>
        ) : (
          [...recommended]
            .sort((a, b) => b.weightedTotal - a.weightedTotal)
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
