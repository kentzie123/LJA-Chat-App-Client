export const formatChatTimestamp = (timeString) => {
  const date = new Date(timeString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const timePart = `${hours}:${minutes} ${ampm}`;

  if (isToday) {
    return `Today at ${timePart}`;
  }

  if (isYesterday) {
    return `Yesterday at ${timePart}`;
  }

  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day} at ${timePart}`;
}
