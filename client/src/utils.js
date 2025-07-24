function formattedDate(release_date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(release_date).toLocaleDateString(undefined, options);
};

function formattedTime(eventDate) {
  const date = new Date(eventDate);
  const formatTime = date.toLocaleTimeString('en-US', {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  })

  return formatTime;
}
export default {
  formattedDate,
  formattedTime,
};