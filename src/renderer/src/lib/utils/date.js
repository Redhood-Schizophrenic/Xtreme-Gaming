// Convert date to string
//
export default function formatDateTimeString(date) {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return formatter.format(date)
}
