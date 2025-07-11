import { useEffect, useState } from "react";
import "../Events/css/Events.css";
import Header from "../Header";
import Footer from "../Footer";
import CreateEvent from "./CreateEvent";

function Events({ userName }) {
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
  const [selectedDate, setSelectedDate] = useState();
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((res) => res.json())
      .then((data) => setAllEvents(data))
      .catch((err) => console.error("Error fetching events", err));
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
    console.log(event.eventUsers);
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
      console.error("Error joining event:", error);
    }
  };

  return (
    <div className="Events">
      <Header />
      <div className="eventManager">
        <CreateEvent userName={userName} />
        <button>Recommended Events</button>
      </div>

      <div className="dateNavigator">
        <div className="listDays">
          {upcomingDays.map(({ day, date }) => (
            <div className="day">
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
            <i class="fa fa-arrow-left"></i>
          </button>
          <button onClick={handleNext} className="directButton">
            <i class="fa fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <div className="eventsContainer">
        {selectedDate ? (
          <>
            {filteredEvents.length === 0 ? (
              <h3>Sorry, there are no events scheduled!</h3>
            ) : (
              filteredEvents.map((event) => (
                <div key={event.eventId} className="eventCard">
                  <img
                    src={event.eventImg || "/src/assets/default-event.webp"}
                    width="200"
                    height="200"
                    className="eventImg"
                  />
                  <h4>{event.eventName}</h4>
                  <p>{event.eventInfo}</p>
                  <p>
                    <b>Where:</b> {event.eventLocation}
                  </p>
                  {event.eventGroups?.length > 0 && (
                    <p>
                      <b>Group Host:</b> {event.eventGroups[0].groupName}
                    </p>
                  )}
                  {event.eventGroups?.length === 0 &&
                    event.eventUsers?.length > 0 && (
                      <p>
                        <b>User Host:</b> {event.eventHost}
                      </p>
                    )}
                  <p>
                    <b>Date & Time:</b>{" "}
                    {new Date(event.eventDate).toLocaleString()}
                  </p>
                  <b>RSVP List:</b>
                    {event.eventUsers.map((user) => (
                      <p>{user.userName}</p>
                    ))}
                  {event.eventUsers.some(
                    (user) => user.userName === userName,
                  ) ? (
                    <button disabled className="joinedButton">
                      Joined
                    </button>
                  ) : (
                    <button onClick={() => handleJoin(event.eventId)}>
                      RSVP
                    </button>
                  )}
                </div>
              ))
            )}
          </>
        ) : (
          <h3>Select a date to view events!</h3>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Events;
