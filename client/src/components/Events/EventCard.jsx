import "./css/EventCard.css";
import UserHover from "../User/UserHover";

function EventCard({ event, userName, onJoin }) {
  const hasJoined = event.eventUsers.some((user) => user.userName === userName);

  return (
    <div className="eventCard">
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
      <p>
        <b>How Long?:</b> {event.eventLength} Hour(s)
      </p>
      {event.eventGroups?.length > 0 && (
        <p>
          <b>Group Host:</b> {event.eventGroups[0].groupName}
        </p>
      )}
      {event.eventGroups?.length === 0 && event.eventUsers?.length > 0 && (
        <p>
          <b>User Host:</b> {event.eventHost}
        </p>
      )}
      <p>
        <b>Date & Time:</b> {new Date(event.eventDate).toLocaleString()}
      </p>

      <b>RSVP List:</b>
      {event.eventUsers && event.eventUsers.length > 0 ? (
        event.eventUsers.map((user) => (
          <UserHover userName={user.userName}>
            <p>{user.userName}</p>
          </UserHover>
        ))
      ) : (
        <p>No RSVPs yet</p>
      )}

      {hasJoined ? (
        <button disabled className="joinedButton">
          Joined
        </button>
      ) : (
        onJoin && <button onClick={() => onJoin(event.eventId)}>RSVP</button>
      )}
    </div>
  );
}

export default EventCard;
