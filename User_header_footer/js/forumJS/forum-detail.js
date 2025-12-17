// detail-forum.js – CHỈ DÀNH CHO TRANG CHI TIẾT BÀI VIẾT
let posts = [];
let comments = [];
let currentPostId = ""; // Lưu ID bài viết hiện tại (toàn cục)
const modalEl = document.getElementById("create-modal");

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

let forumPost = JSON.parse(localStorage.getItem("forum_posts")) || [];
let post = forumPost.find((p) => p.id === postId);

// Tăng lượt xem
if (post) {
  post.viewCount = (post.viewCount || 0) + 1;
  localStorage.setItem("forum_posts", JSON.stringify(forumPost));
}
////////////////////////////////////////////////////
// 1. Load dữ liệu từ localStorage
////////////////////////////////////////////////////
function loadData() {
  const savedPosts = localStorage.getItem("forum_posts");
  const savedComments = localStorage.getItem("forum_comments");

  if (savedPosts) {
    try {
      posts = JSON.parse(savedPosts);
    } catch (e) {
      posts = [];
    }
  }
  if (savedComments) {
    try {
      comments = JSON.parse(savedComments);
    } catch (e) {
      comments = [];
    }
  }
}

////////////////////////////////////////////////////
// 2. Lấy thông tin người dùng hiện tại
////////////////////////////////////////////////////
function getCurrentUser() {
  const currentUser = JSON.parse(localStorage.getItem("currentUserData"));
  if (!currentUser || !currentUser.id) {
    return { name: "Khách", id: null };
  }

  const users = JSON.parse(localStorage.getItem("listusers") || "{}");

  // Ưu tiên dữ liệu trong listusers, fallback currentUserData
  const user = users[currentUser.id] || currentUser;

  const name =
    user.yourname || user.name || user.username || user.phone || "Người dùng";

  return {
    id: user.id,
    name: name.trim(),
  };
}

////////////////////////////////////////////////////
// 3. Tạo avatar (chữ cái đầu + màu)
////////////////////////////////////////////////////
function generateAvatar(name) {
  if (!name || name === "Khách" || name.trim() === "") {
    return { letter: "?", bg: "#94a3b8" };
  }
  const letter = name.trim().charAt(0).toUpperCase();
  const colors = [
    "#f87171",
    "#fb923c",
    "#fbbf24",
    "#a3e635",
    "#34d399",
    "#22d3ee",
    "#60a5fa",
    "#a78bfa",
    "#f472b6",
    "#e879f9",
  ];
  const bg = colors[name.charCodeAt(0) % colors.length];
  return { letter, bg };
}

////////////////////////////////////////////////////
// 4. Utils khác
////////////////////////////////////////////////////
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMins = Math.floor((now - date) / 60000);

  if (diffMins < 1) return "vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} giờ trước`;
  return date.toLocaleDateString("vi-VN");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getTopicClass(topic) {
  const map = {
    TOEIC: "bg-blue-light",
    IELTS: "bg-purple-light",
    Speaking: "bg-green-light",
    Reading: "bg-orange-light",
  };
  return map[topic] || "bg-gray-light";
}

////////////////////////////////////////////////////
// 5. Render trang chi tiết
////////////////////////////////////////////////////
function initDetail() {
  loadData();

  const params = new URLSearchParams(location.search);
  currentPostId = params.get("id");

  if (!currentPostId) {
    document.getElementById("post-container").innerHTML =
      "<p style='text-align:center;padding:3rem;'>Không tìm thấy bài viết!</p>";
    return;
  }

  const post = posts.find((p) => p.id === currentPostId);
  if (!post) {
    document.getElementById("post-container").innerHTML =
      "<p style='text-align:center;padding:3rem;color:#94a3b8;'>Bài viết không tồn tại hoặc đã bị xóa.</p>";
    return;
  }

  const postComments = comments.filter((c) => c.postId === currentPostId);

  // TÍNH LẠI AVATAR CỦA NGƯỜI DÙNG HIỆN TẠI
  const currentUser = getCurrentUser();
  const { letter: currLetter, bg: currBg } = generateAvatar(currentUser.name);

  // Render bài viết...
  const { letter: postLetter, bg: postBg } = generateAvatar(post.authorName);
  document.getElementById("post-container").innerHTML = `
    <div class="card">
      <div class="card-body">
        <div style="margin-bottom:1rem;display:flex;gap:1rem;align-items:center;flex-wrap:wrap;">
          <span class="badge ${getTopicClass(post.topic)}">${post.topic}</span>
          <span style="color:#64748b;font-size:0.9rem;">${formatDate(
            post.createdAt
          )}</span>
        </div>

        <h1 style="font-size:1.8rem;font-weight:bold;margin:1rem 0;">${escapeHtml(
          post.title
        )}</h1>

        <div style="display:flex;align-items:center;gap:12px;margin:2rem 0;padding:1rem;background:#f8fafc;border-radius:12px;">
          <div style="width:48px;height:48px;border-radius:50%;background:${postBg};color:white;font-weight:bold;font-size:20px;display:flex;align-items:center;justify-content:center;">
            ${postLetter}
          </div>
          <div>
            <div style="font-weight:600;">${escapeHtml(post.authorName)}</div>
            <div style="font-size:0.85rem;color:#64748b;">Đã đăng</div>
          </div>
        </div>

        <div style="font-size:1.05rem;line-height:1.8;color:#334155;padding:1.5rem 0;border-top:1px solid #e2e8f0;white-space:pre-wrap;">
          ${escapeHtml(post.content)}
        </div>
      </div>
    </div>
  `;

  // Render danh sách bình luận...
  const commentList = document.getElementById("comment-list");
  const commentCount = document.getElementById("comment-count-display");
  commentCount.textContent = postComments.length;

  if (postComments.length === 0) {
    commentList.innerHTML = `<div style="text-align:center;color:#94a3b8;padding:2rem;">Chưa có bình luận nào. Hãy là người đầu tiên!</div>`;
  } else {
    commentList.innerHTML = postComments
      .map((c) => {
        const { letter, bg } = generateAvatar(c.username);
        return `
        <div style="display:flex;gap:1rem;padding:1rem 0;border-bottom:1px solid #e2e8f0;">
          <div style="width:40px;height:40px;border-radius:50%;background:${bg};color:white;font-weight:bold;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            ${letter}
          </div>
          <div style="flex:1;">
            <div style="font-weight:600;font-size:0.95rem;">${escapeHtml(
              c.username
            )}</div>
            <div style="margin:0.5rem 0;color:#475569;line-height:1.6;">${escapeHtml(
              c.content
            )}</div>
            <div style="font-size:0.8rem;color:#94a3b8;">${formatDate(
              c.createdAt
            )}</div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  // CẬP NHẬT AVATAR TRONG FORM BÌNH LUẬN
  const avatarEl = document.getElementById("current-user-avatar");
  if (avatarEl) {
    avatarEl.textContent = currLetter;
    avatarEl.style.backgroundColor = currBg;
  }

  setupEventListeners();
}

// ĐĂNG BÀI
function setupEventListeners() {
  const openBtn = document.getElementById("btn-open-modal");
  const closeBtn = document.getElementById("btn-close-modal");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      const user = getCurrentUser();
      if (!user || !user.id) {
        return alert("Vui lòng đăng nhập để đăng bài!");
      }
      modalEl.classList.add("open");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modalEl.classList.remove("open");
    });
  }

  document.getElementById("create-form")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("input-title").value.trim();
    const topic = document.getElementById("input-topic").value;
    const content = document.getElementById("input-content").value.trim();

    if (!title || !content) {
      return alert("Vui lòng nhập tiêu đề và nội dung!");
    }

    const user = getCurrentUser();

    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      topic,
      authorId: user.id,
      authorName: user.name,
      createdAt: new Date().toISOString(),
      viewCount: 0,
    };

    posts.unshift(newPost);
    localStorage.setItem("forum_posts", JSON.stringify(posts));
    modalEl.classList.remove("open");
    setTimeout(() => {
      window.location.href = "../User_header_footer/forum.html";
    }, 200);
  });
}

////////////////////////////////////////////////////
// 6. Gửi bình luận
////////////////////////////////////////////////////
window.handleAddComment = function () {
  const input = document.getElementById("comment-input");
  const content = input.value.trim();
  if (!content) return;

  const user = getCurrentUser();

  if (!currentPostId) {
    alert("Không xác định được bài viết!");
    return;
  }

  const newComment = {
    id: "c" + Date.now(),
    postId: currentPostId, // Đảm bảo đúng ID bài viết
    username: user.name,
    content: content,
    createdAt: new Date().toISOString(),
  };

  comments.push(newComment);
  localStorage.setItem("forum_comments", JSON.stringify(comments));

  input.value = "";
  initDetail(); // Refresh lại để hiện bình luận mới + avatar đẹp
};

////////////////////////////////////////////////////
// 7. Chạy khi trang load
////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", initDetail);
