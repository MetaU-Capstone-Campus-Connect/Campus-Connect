import { useEffect, useState } from "react";
import "../Events/css/CalendarEvents.css";
import EventCard from "./EventCard";
import formatDateTime from "../../utils";

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
  const [slideDirection, setSlideDirection] = useState(null);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((res) => res.json())
      .then((data) => setAllEvents(data))
      .catch((err) =>
        console.error("Error: Fetching calender component events", err),
      );
  }, []);

  const getDays = (startOffset) => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + startOffset);
    const days = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      const dayName = dayList[date.getDay()];
      const formattedDate = date.toLocaleDateString("en-CA");
      days.push({
        day: `${dayName}, ${
          date.getMonth() + 1
        }/${date.getDate()}/${date.getFullYear()}`,
        date: formattedDate,
      });
    }
    return days;
  };

  const [currentDays, setCurrentDays] = useState(getDays(offset));
  const [nextDays, setNextDays] = useState([]);

  const filteredEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.eventDate).toLocaleDateString("en-CA");
    return eventDate === selectedDate;
  });

  const startSlide = (direction) => {
    if (isSliding) return;
    const newOffset =
      direction === "right" ? offset + 5 : Math.max(offset - 5, 0);
    if (newOffset === offset) return;

    setIsSliding(true);
    setSlideDirection(direction);
    setNextDays(getDays(newOffset));

    setTimeout(() => {
      setOffset(newOffset);
      setCurrentDays(getDays(newOffset));
      setNextDays([]);
      setSlideDirection(null);
      setIsSliding(false);
    }, 1500)
  };

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
        <div className="listDaysWrapper">
          <div className={`listDaysContainer ${slideDirection}`}>
            <div className="listDays currentSet">
              {currentDays.map(({ day, date }) => (
                <div className="day" key={date}>
                  <div className="dayTitle">{day}</div>
                  <button onClick={() => setSelectedDate(date)}>Show Events</button>
                </div>
              ))}
            </div>
            {slideDirection && (
              <div className="listDays nextSet">
                {nextDays.map(({ day, date }) => (
                  <div className="day">
                    <div className="dayTitle">{day}</div>
                    <button onClick={() => setSelectedDate(date)}>
                      Show Events
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="controlDirection">
            <button
              onClick={() => startSlide("left")}
              disabled={offset === 0 || isSliding}
              className="directButton"
            >
              <i className="fa fa-arrow-left"></i>
            </button>
            <button
              onClick={() => startSlide("right")}
              disabled={isSliding}
              className="directButton"
            >
              <i className="fa fa-arrow-right"></i>
            </button>
          </div>
          {selectedDate && (
            <div className="currentSelectedDay">
              {formatDateTime.formattedDate(selectedDate)}
            </div>
          )}
        </div>
      </div>
      <div className="eventsContainer">
        {selectedDate ? (
          filteredEvents.length === 0 ? (
            <h3>Sorry, there are no events scheduled!</h3>
          ) : (
            <div className="timelineContainer">
              <div className="timelineLine"></div>
              {filteredEvents.map((event) => (
                <EventCard
                  event={event}
                  userName={userName}
                  onJoin={handleJoin}
                />
              ))}
            </div>
          )
        ) : (
          <h3>Select a date to view events!</h3>
        )}
      </div>
    </div>
  );
}

export default CalendarEvents;
