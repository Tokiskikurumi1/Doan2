/* utils.js */
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("vi-VN");
}

function getTopicClass(topic) {
  switch (topic) {
    case "Announcement":
      return "bg-red-light text-red";
    case "QA":
      return "bg-blue-light text-blue";
    case "Review":
      return "bg-green-light text-green";
    case "Spoiler":
      return "bg-gray-dark text-gray";
    default:
      return "bg-slate-light text-slate";
  }
}
