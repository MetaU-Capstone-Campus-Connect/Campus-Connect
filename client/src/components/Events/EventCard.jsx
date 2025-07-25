import "./css/EventCard.css";
import UserHover from "../User/UserHover";
import formatDatetime from "../../utils";

function EventCard({ event, userName, onJoin }) {
  const hasJoined = event.eventUsers.some((user) => user.userName === userName);

  return (
    <div className="eventCardContainer">
      <div className="eventCardTimeline">
        <div className="timelineTime">
          {formatDatetime.formattedTime(event.eventDate)}
        </div>
      </div>
      <div className="eventCardMain">
        <div className="eventCardImg">
          <img
            src={event.eventImg || "/src/assets/default-event.webp"}
            width="200"
            height="200"
            className="eventImg"
          />
        </div>
        <div className="eventCardCenterInfo">
          <div className="eventCardLeftSide">
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
            {event.eventGroups?.length === 0 &&
              event.eventUsers?.length > 0 && (
                <p>
                  <b>User Host:</b> {event.eventHost}
                </p>
              )}
          </div>

          <div className="eventCardRightSide">
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
          </div>
        </div>
        <div className="eventCardRSVP">
          {hasJoined ? (
            <button disabled className="joinedButton">
              Joined
            </button>
          ) : (
            onJoin && (
              <button onClick={() => onJoin(event.eventId)}>RSVP</button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard;
