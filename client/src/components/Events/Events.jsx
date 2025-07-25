import { useState } from "react";
import "../Events/css/Events.css";
import Header from "../Header";
import CalendarEvents from "./CalendarEvents";
import RecommendedEvents from "./RecommendedEvents";
import MyEvents from "./MyEvents";
import CreateEvent from "./CreateEvent";

function Events({ userName }) {
  const [viewMode, setViewMode] = useState("calendar");

  const renderView = () => {
    switch (viewMode) {
      case "recommended":
        return <RecommendedEvents userName={userName} />;
      case "myEvents":
        return <MyEvents userName={userName} />;
      default:
        return <CalendarEvents userName={userName} />;
    }
  };

  return (
    <div className="Events">
      <Header />
      <div className="eventManager">
        <CreateEvent userName={userName} />
        <button onClick={() => setViewMode("calendar")}>Calendar View</button>

        <button onClick={() => setViewMode("recommended")}>
          Recommended Events
        </button>

        <button onClick={() => setViewMode("myEvents")}>My Events</button>
      </div>
      {renderView()}
    </div>
  );
}

export default Events;
