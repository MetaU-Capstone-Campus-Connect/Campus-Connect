function formattedDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const [year, month, day] = date.split('-');
  const dateFormatted = new Date(year, month -1, day);
  return dateFormatted.toLocaleDateString(undefined, options);
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