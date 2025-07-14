import { useEffect, useState } from "react";
import "../Events/css/CalendarEvents.css";
import EventCard from "./EventCard";

function CalendarEvents({ userName }) {
  const dayList = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [offset, setOffset] = useState(0);
  const [allEvents, setAllEvents] = useState([]);
  const today = new Date().toLocaleDateString("en-CA");
  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((res) => res.json())
      .then((data) => setAllEvents(data))
      .catch((err) =>
        console.error("Error: Fetching calender component events", err),
      );
  }, []);

  const displayWeek = () => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + offset);

    const days = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(baseDate.getDate() + i);

      const dayName = dayList[date.getDay()];
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();

      const displayDay = `${dayName}, ${month}/${day}/${year}`;
      days.push({ day: displayDay, date: date.toLocaleDateString("en-CA") });
    }
    return days;
  };

  const upcomingDays = displayWeek();

  const filteredEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.eventDate).toLocaleDateString("en-CA");
    return eventDate === selectedDate;
  });

  const handleNext = () => setOffset(offset + 5);
  const handlePrev = () => setOffset((prev) => Math.max(prev - 5, 0));

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
        setAllEvents((prevEvents) =>
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
      console.error("Error: Joining calender component event", error);
    }
  };

  return (
    <div className="CalendarEvents">
      <div className="dateNavigator">
        <div className="listDays">
          {upcomingDays.map(({ day, date }) => (
            <div className="day" key={date}>
              <div className="dayTitle">{day}</div>
              <button onClick={() => setSelectedDate(date)}>Show Events</button>
            </div>
          ))}
        </div>
        <div className="controlDirection">
          <button
            onClick={handlePrev}
            disabled={offset === 0}
            className="directButton"
          >
            <i className="fa fa-arrow-left"></i>
          </button>
          <button onClick={handleNext} className="directButton">
            <i className="fa fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <div className="eventsContainer">
        {selectedDate ? (
          filteredEvents.length === 0 ? (
            <h3>Sorry, there are no events scheduled!</h3>
          ) : (
            filteredEvents.map((event) => (
              <EventCard
                event={event}
                userName={userName}
                onJoin={handleJoin}
              />
            ))
          )
        ) : (
          <h3>Select a date to view events!</h3>
        )}
      </div>
    </div>
  );
}

export default CalendarEvents;
