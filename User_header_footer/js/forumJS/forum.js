// forum.js
let currentTopic = "All";
// DOM Elements
const postListEl = document.getElementById("post-list");
const topicFiltersEl = document.getElementById("topic-filters");
const pageTitleEl = document.getElementById("page-title");
const postCountEl = document.getElementById("post-count");
const modalEl = document.getElementById("create-modal");

function getCurrentUserInfo() {
  const currentUserId = localStorage.getItem("currentUser");
  if (!currentUserId) {
    return { name: "Bạn", avt: "?", id: null };
  }
  const usersObject = JSON.parse(localStorage.getItem("listusers") || "{}");
  const user = usersObject[currentUserId];
  if (!user) return { name: "Bạn", avt: "?", id: currentUserId };

  const displayName =
    user.yourname || user.name || user.username || user.phone || "Người dùng";
  const avt = displayName.trim().charAt(0).toUpperCase();

  return { id: currentUserId, name: displayName.trim(), avt };
}

// Tạo chữ cái đầu + màu nền ngẫu nhiên đẹp (dựa trên tên)
function generateAvatar(name) {
  if (!name || name === "Khách") return { letter: "?", bg: "#94a3b8" };

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
  const index = name.charCodeAt(0) % colors.length;
  return { letter, bg: colors[index] };
}
let currentUser = getCurrentUserInfo();

// Init
function init() {
  renderFilters();
  renderPosts();
  setupEventListeners();
}

// 1. Render Filters
function renderFilters() {
  const topics = ["All", "TOEIC", "IELTS", "Speaking", "Reading"];

  topicFiltersEl.innerHTML = topics
    .map(
      (topic) => `
    <button 
      class="filter-btn ${topic === currentTopic ? "active" : ""}" 
      onclick="setTopic('${topic}')"
    >
      ${topic === "All" ? "Tất cả" : topic}
    </button>
  `
    )
    .join("");
}

// 2. Render Posts
function renderPosts() {
  let filtered =
    currentTopic === "All"
      ? posts
      : posts.filter((p) => p.topic === currentTopic);

  filtered = filtered.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  pageTitleEl.innerText =
    currentTopic === "All" ? "Thảo luận mới nhất" : currentTopic;
  postCountEl.innerText = `${filtered.length} bài viết`;

  if (filtered.length === 0) {
    postListEl.innerHTML = `
      <div class="card" style="padding: 3rem; text-align: center; color: var(--text-muted); border-style: dashed;">
        <p>Chưa có bài viết nào trong chủ đề này.</p>
      </div>`;
    return;
  }

  postListEl.innerHTML = filtered
    .map((post) => {
      const { letter, bg } = generateAvatar(post.authorName);
      return `
    <a href="./detail-forum.html?id=${post.id}" class="card post-item">
      <div class="card-body">
        <div class="post-header">
          <div>
            <div class="post-meta">
              <span class="badge ${getTopicClass(post.topic)}">${
        post.topic
      }</span>
              <span style="color: var(--text-muted); font-size: 0.875rem;">
                ${formatDate(post.createdAt)}
              </span>
            </div>
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <p class="post-desc">${escapeHtml(post.content.substring(0, 150))}${
        post.content.length > 150 ? "..." : ""
      }</p>
            
            <!-- Avatar dạng chữ cái đầu -->
            <div class="user-info" style="margin-top: 12px; display: flex; align-items: center; gap: 10px;">
              <div style="
                width: 32px; 
                height: 32px; 
                border-radius: 50%; 
                background: ${bg}; 
                color: white; 
                font-weight: bold; 
                font-size: 14px; 
                display: flex; 
                align-items: center; 
                justify-content: center;
              ">
                ${letter}
              </div>
              <span style="font-weight: 500;">${escapeHtml(
                post.authorName
              )}</span>
            </div>
          </div>
          
        </div>
      </div>
    </a>
  `;
    })
    .join("");
}

// Global: đổi chủ đề
window.setTopic = function (topic) {
  currentTopic = topic;
  renderFilters();
  renderPosts();
};

// 4. Tạo bài viết
function setupEventListeners() {
  const openBtn = document.getElementById("btn-open-modal");
  const closeBtn = document.getElementById("btn-close-modal");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      if (!currentUser || currentUser.id === "guest") {
        // modalEl.classList.add("open");
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

  modalEl.addEventListener("click", (e) => {
    if (e.target === modalEl) modalEl.classList.remove("open");
  });

  // Submit form
  document.getElementById("create-form")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("input-title").value.trim();
    const topic = document.getElementById("input-topic").value;
    const content = document.getElementById("input-content").value.trim();

    if (!title || !content) {
      return alert("Vui lòng nhập tiêu đề và nội dung!");
    }

    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      topic,
      authorId: currentUser.id,
      authorName: currentUser.name,
      createdAt: new Date().toISOString(),
      viewCount: 0,
    };

    posts.unshift(newPost);
    savePostsToStorage();
    e.target.reset();
    modalEl.classList.remove("open");
    setTopic("All");
  });
}

// Utils
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}

function getTopicClass(topic) {
  const map = {
    TOEIC: "bg-blue-light text-blue",
    IELTS: "bg-purple-light text-purple",
    Speaking: "bg-green-light text-green",
    Reading: "bg-orange-light text-orange",
  };
  return map[topic] || "bg-gray-light text-gray";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function savePostsToStorage() {
  localStorage.setItem("forum_posts", JSON.stringify(posts));
}

// Chạy app
init();
