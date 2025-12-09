// data.js - Dữ liệu mẫu (chỉ dùng lần đầu nếu chưa có localStorage)
let posts = [
  {
    id: "1",
    title: "Làm thế nào để đạt 900+ TOEIC trong 2 tháng?",
    content: "Mình đang ôn TOEIC, ai có kinh nghiệm chia sẻ giúp mình với...",
    topic: "TOEIC",
    authorId: "u1",
    authorName: "Nguyễn Văn A",
    authorAvatar: "N",
    createdAt: "2025-11-20T10:00:00",
  },
  {
    id: "2",
    title: "Mẹo nói tiếng Anh trôi chảy như người bản xứ",
    content:
      "Mình hay bị bí từ, nói ngập ngừng. Có cách nào cải thiện không ạ?",
    topic: "Speaking",
    authorId: "u2",
    authorName: "Trần Thị B",
    authorAvatar: "t",
    createdAt: "2025-11-25T14:30:00",
  },
];

// Load từ localStorage nếu có
function loadPostsFromStorage() {
  const saved = localStorage.getItem("forum_posts");
  if (saved) {
    try {
      posts = JSON.parse(saved);
    } catch (e) {
      console.error("Lỗi parse localStorage posts:", e);
      posts = [];
    }
  }
}

// Save vào localStorage
function savePostsToStorage() {
  localStorage.setItem("forum_posts", JSON.stringify(posts));
}

// Gọi ngay khi load
loadPostsFromStorage();
# Update 2026-01-10 17:57:44
