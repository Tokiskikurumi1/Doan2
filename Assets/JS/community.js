// script.js - simple in-browser prototype (no backend)
const posts = [
  {
    id: 1,
    title:
      "Cách sử dụng thì Hiện tại đơn eassssssssssssssssssssssssssseassssssssssssssssssssssssssstrong bài nói",
    author: "Lan",
    time: "2 giờ trước",
    cat: "Ngữ pháp",
    content:
      "Giải thích + ví dụ: I eat, he easssssssssssssssssssssssssss sssssssssss sssssssssssssssssssssssssssssts...",
    content:
      "Giải thích + ví dụ: I eat, he easssssssssssssssssssssssssss sssssssssss sssssssssssssssssssssssssssssts...",
  },
  {
    id: 2,
    title: "500 từ vựng cơ bản cho người mới bắt đầu",
    author: "Minh",
    time: "1 ngày trước",
    cat: "Từ vựng",
    content: "Danh sách 500 từ: ...",
  },
  {
    id: 3,
    title: "Mẹo luyện nghe mỗi ngày",
    author: "Hương",
    time: "3 ngày trước",
    cat: "Luyện nghe",
    content: "Nghe podcast, chép chính tả...",
  },
];

const postList = document.getElementById("postList");
const post = document.querySelector(".post");
const postModal = document.getElementById("postModal");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalContent = document.getElementById("modalContent");
const commentsEl = document.getElementById("comments");
const closeModal = document.getElementById("closeModal");
const newPostBtn = document.getElementById("newPostBtn");
const newPostModal = document.getElementById("newPostModal");
const closeNewPost = document.getElementById("closeNewPost");
const createPost = document.getElementById("createPost");
const categories = document.querySelectorAll(".cat");
const searchInput = document.getElementById("searchInput");

let currentFilter = "Ngữ pháp";
let currentPost = null;
let commentsMap = {}; // postId -> comments array

function renderList() {
  postList.innerHTML = "";
  const q = (searchInput.value || "").toLowerCase();
  const filtered = posts.filter(
    (p) =>
      p.cat === currentFilter &&
      (p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q))
  );

  if (filtered.length === 0) {
    postList.innerHTML =
      '<div style="padding:20px;color:#6b7280">Không có bài viết trong danh mục này.</div>';
    return;
  }

  filtered.forEach((p) => {
    const el = document.createElement("div");
    el.className = "post";
    el.innerHTML = `
      <div class="top-content">
        <div class="left">
          <div class="avt-name-title">
            <div class="c-avatar">${p.author[0] || "U"}</div>
            <div class="meta">Bởi ${p.author} • ${p.time}</div>
          </div>
          <div class="title">${p.title}</div>
        </div>
      </div>
      <div class="icons-action">
        <div class="icon-card">
          <i class="fa-solid fa-heart"></i>
          <p class="count-heart">0</p>
        </div>
        <div class="icon-card">
          <i class="fa-solid fa-message"></i>
          <p class="count-message">0</p>
        </div>
      </div>
    `;

    // Gắn sự kiện mở bài chi tiết cho từng bài
    el.addEventListener("click", () => openPost(p.id));

    // Thêm vào danh sách
    postList.appendChild(el);
  });
}

function openPost(id) {
  const p = posts.find((x) => x.id === id);
  currentPost = p;
  modalTitle.textContent = p.title;
  modalMeta.innerHTML = `<div class="avt-name-title">
              <div class="c-avatar">${p.author[0] || "U"}</div>
              <div class="meta">Bởi ${p.author} • ${p.time}</div>
            </div>`;
  modalContent.textContent = p.content;
  renderComments();
  postModal.setAttribute("aria-hidden", "false");
}

function closeModalFn() {
  postModal.setAttribute("aria-hidden", "true");
}

function renderComments() {
  commentsEl.innerHTML = "";
  const arr = commentsMap[currentPost.id] || [];
  if (arr.length === 0)
    commentsEl.innerHTML =
      '<div style="color:#6b7280;padding:8px 0">Chưa có bình luận</div>';
  arr.forEach((c) => {
    const e = document.createElement("div");
    e.className = "comment";
    e.innerHTML = `<div class="c-avatar">${
      c.name[0] || "U"
    }</div><div class="c-body"><strong>${c.name}</strong><div class="c-meta">${
      c.time
    }</div><div>${c.text}</div></div>`;
    commentsEl.appendChild(e);
  });
}

document.getElementById("sendComment").addEventListener("click", () => {
  const txt = document.getElementById("commentInput").value.trim();
  if (!txt) return alert("Viết bình luận trước khi gửi");
  const arr = (commentsMap[currentPost.id] = commentsMap[currentPost.id] || []);
  arr.push({ name: "Bạn", time: "vừa xong", text: txt });
  document.getElementById("commentInput").value = "";
  renderComments();
});

closeModal.addEventListener("click", closeModalFn);
postModal.addEventListener("click", (e) => {
  if (e.target === postModal) closeModalFn();
});

newPostBtn.addEventListener("click", () =>
  newPostModal.setAttribute("aria-hidden", "false")
);
closeNewPost.addEventListener("click", () =>
  newPostModal.setAttribute("aria-hidden", "true")
);
newPostModal.addEventListener("click", (e) => {
  if (e.target === newPostModal)
    newPostModal.setAttribute("aria-hidden", "true");
});

createPost.addEventListener("click", () => {
  const title = document.getElementById("postTitle").value.trim();
  const body = document.getElementById("postBody").value.trim();
  const cat = document.getElementById("postCategory").value;
  if (!title || !body) return alert("Tiêu đề và nội dung không được để trống");
  const id = posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1;
  posts.unshift({
    id,
    title,
    author: "Bạn",
    time: "vừa xong",
    cat,
    content: body,
  });
  document.getElementById("postTitle").value = "";
  document.getElementById("postBody").value = "";
  newPostModal.setAttribute("aria-hidden", "true");
  currentFilter = cat;
  document
    .querySelectorAll(".cat")
    .forEach((c) => c.classList.remove("active"));
  document
    .querySelector('.cat[data-cat="' + cat + '"]')
    .classList.add("active");
  renderList();
});

categories.forEach((c) => {
  c.addEventListener("click", () => {
    document
      .querySelectorAll(".cat")
      .forEach((x) => x.classList.remove("active"));
    c.classList.add("active");
    currentFilter = c.getAttribute("data-cat");
    renderList();
  });
});

searchInput.addEventListener("input", renderList);

// initial render
renderList();
