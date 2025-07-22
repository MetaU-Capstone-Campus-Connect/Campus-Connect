function formattedDate(release_date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(release_date).toLocaleDateString(undefined, options);
};

export default formattedDate;