// ========================== KEY LOCALSTORAGE ==========================
const POSTS_KEY = "community_posts";

// ========================== LẤY DỮ LIỆU TỪ LOCAL ==========================
let posts = JSON.parse(localStorage.getItem(POSTS_KEY)) || [];

// Dữ liệu mẫu nếu chưa có
if (posts.length === 0) {
  posts = [
    {
      id: 1,
      author: "Lan",
      authorId: "123456",
      avt: "L",
      time: "2 giờ trước",
      cat: "Ngữ pháp",
      content: "Cách sử dụng thì Hiện tại đơn...",
      likes: 0,
      comments: 0,
      _liked: false,
    },
    {
      id: 2,
      author: "Minh",
      authorId: "789012",
      avt: "M",
      time: "1 ngày trước",
      cat: "TT",
      content: "500 từ vựng cơ bản...",
      likes: 0,
      comments: 0,
      _liked: false,
    },
    {
      id: 3,
      author: "Hương",
      authorId: "345678",
      avt: "H",
      time: "3 ngày trước",
      cat: "Trang cá nhân",
      content: "Mẹo luyện nghe mỗi ngày...",
      likes: 0,
      comments: 0,
      _liked: false,
    },
  ];
  savePosts();
}

// ========================== LƯU POSTS ==========================
function savePosts() {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

// ========================== LẤY THÔNG TIN USER ĐĂNG NHẬP ==========================

function isLoggedIn() {
  return !!localStorage.getItem("currentUser");
}

// ========================== THÔNG TIN NGƯỜI DÙNG ĐĂNG NHẬP ==========================
function getCurrentUserInfo() {
  const currentUserId = localStorage.getItem("currentUser");

  // Chưa đăng nhập
  if (!currentUserId) {
    return { name: "Bạn", avt: "?", id: null };
  }

  // Lấy danh sách user dạng object { "1764125657899": { ...user data... } }
  const usersObject = JSON.parse(localStorage.getItem("listusers") || "{}");

  // Tìm user theo ID
  const user = usersObject[currentUserId];

  if (!user) {
    return { name: "Bạn", avt: "?", id: currentUserId };
  }

  // Ưu tiên lấy tên: yourname → name → username → phone → fallback
  const displayName =
    user.yourname ||
    user.name ||
    user.username ||
    user.phone ||
    user.id ||
    "Người dùng";

  const avt = displayName.trim().charAt(0).toUpperCase();

  return {
    id: currentUserId,
    name: displayName.trim(),
    avt: avt,
  };
}

function isLoggedIn() {
  return !!localStorage.getItem("currentUser");
}

// ========================== DOM ELEMENTS ==========================
const postList = document.getElementById("postList");
const postModal = document.getElementById("postModal");
const modalMeta = document.getElementById("modalMeta");
const modalContent = document.getElementById("modalContent");
const commentsEl = document.getElementById("comments");
const commentInput = document.getElementById("commentInput");
const closeModal = document.getElementById("closeModal");
const newPostBtn = document.getElementById("newPostBtn");
const newPostModal = document.getElementById("newPostModal");
const closeNewPost = document.getElementById("closeNewPost");
const createPost = document.getElementById("createPost");
const categories = document.querySelectorAll(".cat");
const searchInput = document.getElementById("searchInput");
const postImageInput = document.getElementById("postImage");
const imagePreview = document.getElementById("imagePreview");
const avatarElements = document.querySelector(".actions .avatar");
const generalBtn = document.getElementById("generalBtn");
const imgSearch = document.querySelector(".img-search");
const searchbar = document.querySelector(".topbar .searchbar");
const profileSection = document.getElementById("profileSection");

let currentFilter = "Tổng hợp";
let currentPost = null;
let commentsMap = {}; // postId → mảng bình luận

// ========================== CẬP NHẬT AVATAR & TÊN ==========================
function updateUserDisplay() {
  const info = getCurrentUserInfo();
  if (avatarElements) {
    avatarElements.textContent = info.avt;
  }
  // Cập nhật avatar + tên trong form tạo bài
  const createAvt = document.querySelector(".avt_create .c-avatar");
  const createName = document.querySelector(".avt_create .meta");
  if (createAvt) createAvt.textContent = info.avt;
  if (createName) createName.textContent = info.name;

  // Cập nhật trang cá nhân
  if (profileSection && currentFilter === "Trang cá nhân") {
    renderMyPosts();
  }
}
updateUserDisplay();

// ========================== HIỂN THỊ DANH SÁCH BÀI VIẾT ==========================
function renderList() {
  if (!isLoggedIn()) {
    postList.innerHTML = `<div style="padding:40px;text-align:center;color:#6b7280;font-size:18px;">
      Vui lòng <a href="../User_header_footer/login.html" style="color:#2563eb;text-decoration:underline;">đăng nhập</a> để xem các bài viết.
    </div>`;
    return;
  }

  postList.innerHTML = "";
  const q = (searchInput.value || "").toLowerCase().trim();

  let filtered = posts.filter(
    (p) =>
      (p.content || "").toLowerCase().includes(q) ||
      (p.author || "").toLowerCase().includes(q)
  );

  if (filtered.length === 0) {
    postList.innerHTML =
      '<div style="padding:40px;color:#6b7280;text-align:center;">Không tìm thấy bài viết nào.</div>';
    return;
  }

  filtered.forEach((p) => renderSinglePost(p));
}

function renderSinglePost(p) {
  const el = document.createElement("div");
  el.className = "post";
  el.innerHTML = `
    <div class="top-content">
      <div class="left">
        <div class="avt-name-title">
          <div class="c-avatar">${p.avt || "U"}</div>
          <div class="meta">Bởi ${p.author} • ${p.time}</div>
        </div>
        <div class="title">${p.content}</div>
        ${p.image ? `<img src="${p.image}" class="post-image" />` : ""}
      </div>
    </div>
    <div class="icons-action">
      <div class="icon-card heart-card">
        <i class="fa-solid fa-heart" style="color:${
          p._liked ? "red" : "#9ca3af"
        }"></i>
        <p class="count-heart">${p.likes || 0}</p>
      </div>
      <div class="icon-card message-card">
        <i class="fa-solid fa-message"></i>
        <p class="count-message">${p.comments || 0}</p>
      </div>
    </div>
  `;

  el.addEventListener("click", (e) => {
    if (e.target.closest(".icon-card")) return;
    openPost(p.id);
  });

  el.querySelector(".heart-card").addEventListener("click", (e) => {
    e.stopPropagation();
    p._liked = !p._liked;
    p.likes += p._liked ? 1 : -1;
    savePosts();
    if (currentFilter === "Trang cá nhân") renderMyPosts();
    else renderList();
  });

  el.querySelector(".message-card").addEventListener("click", (e) => {
    e.stopPropagation();
    openPost(p.id);
  });

  postList.appendChild(el);
}

// ========================== TRANG CÁ NHÂN ==========================
function renderMyPosts() {
  if (!isLoggedIn()) return;

  const info = getCurrentUserInfo();
  profileSection.innerHTML = `
    <div class="c-avatar" style="width:80px;height:80px;font-size:32px;margin:0 auto;background:#2563eb;color:white;display:flex;align-items:center;justify-content:center;border-radius:50%">
      ${info.avt}
    </div>
    <h3 style="margin-top:12px;text-align:center">${info.name}</h3>
    <p style="color:gray;text-align:center">Bài viết của tôi</p>
  `;

  postList.innerHTML = "";
  const q = (searchInput.value || "").toLowerCase().trim();
  const myPosts = posts.filter(
    (p) =>
      p.author === info.name &&
      (p.content.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q))
  );

  if (myPosts.length === 0) {
    postList.innerHTML =
      '<div style="padding:40px;color:#6b7280;text-align:center;">Bạn chưa đăng bài nào.</div>';
    return;
  }

  myPosts.forEach((p) => renderSinglePost(p));
}

// ========================== MỞ BÀI CHI TIẾT ==========================
function openPost(id) {
  const p = posts.find((x) => x.id === id);
  if (!p) return;
  currentPost = p;

  modalMeta.innerHTML = `
    <div class="avt-name-title">
      <div class="c-avatar">${p.avt}</div>
      <div class="meta">Bởi ${p.author} • ${p.time}</div>
    </div>
  `;

  modalContent.innerHTML = `
    <div class="text-content">${p.content}</div>
    ${
      p.image
        ? `<img src="${p.image}" class="post-image" style="max-width:100%;border-radius:8px;margin-top:12px;" />`
        : ""
    }
  `;

  renderComments();
  postModal.setAttribute("aria-hidden", "false");
}

function closeModalFn() {
  postModal.setAttribute("aria-hidden", "true");
}
closeModal?.addEventListener("click", closeModalFn);
postModal?.addEventListener(
  "click",
  (e) => e.target === postModal && closeModalFn()
);

// ========================== BÌNH LUẬN ==========================
function renderComments() {
  commentsEl.innerHTML = "";
  const arr = commentsMap[currentPost.id] || [];
  if (arr.length === 0) {
    commentsEl.innerHTML =
      '<div style="color:#9ca3af;padding:12px 0">Chưa có bình luận nào.</div>';
    return;
  }
  arr.forEach((c) => {
    const el = document.createElement("div");
    el.className = "comment";
    el.innerHTML = `
      <div class="c-avatar">${c.avt}</div>
      <div class="c-body">
        <strong>${c.name}</strong>
        <div class="c-meta">${c.time}</div>
        <div>${c.text}</div>
      </div>
    `;
    commentsEl.appendChild(el);
  });
}

document.getElementById("sendComment")?.addEventListener("click", () => {
  const txt = commentInput.value.trim();
  if (!txt) return alert("Vui lòng nhập nội dung bình luận!");

  const info = getCurrentUserInfo();
  const arr = commentsMap[currentPost.id] || [];
  arr.push({
    name: info.name,
    avt: info.avt,
    time: "vừa xong",
    text: txt,
  });
  commentsMap[currentPost.id] = arr;
  currentPost.comments = arr.length;
  savePosts();
  commentInput.value = "";
  renderComments();

  if (currentFilter === "Trang cá nhân") renderMyPosts();
  else renderList();
});

// ========================== TẠO BÀI MỚI ==========================
// === THAY ĐOẠN TẠO BÀI MỚI ===
createPost?.addEventListener("click", () => {
  const body = document.getElementById("postBody").value.trim();
  const file = postImageInput.files[0];

  if (!body && !file) return alert("Hãy viết gì đó hoặc thêm ảnh nhé!");

  const info = getCurrentUserInfo();
  const newId = posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1;

  const addPost = (imgBase64 = null) => {
    posts.unshift({
      id: newId,
      author: info.name, // tên hiển thị
      authorId: info.id, // ← THÊM DÒNG NÀY (ID thật)
      avt: info.avt,
      time: "vừa xong",
      cat: "Trang cá nhân",
      content: body,
      image: imgBase64,
      likes: 0,
      comments: 0,
      _liked: false,
    });
    savePosts();
    // ...reset form như cũ
    document.getElementById("postBody").value = "";
    postImageInput.value = "";
    imagePreview.src = "";
    imagePreview.style.display = "none";
    newPostModal.setAttribute("aria-hidden", "true");

    if (currentFilter === "Trang cá nhân") renderMyPosts();
    else renderList();
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => addPost(e.target.result);
    reader.readAsDataURL(file);
  } else addPost();
});

// ========================== CHUYỂN TAB ==========================
categories.forEach((cat) => {
  cat.addEventListener("click", () => {
    categories.forEach((x) => x.classList.remove("active"));
    cat.classList.add("active");
    currentFilter = cat.getAttribute("data-cat");
    document.getElementById("panelTitle").textContent =
      currentFilter === "Trang cá nhân" ? "Trang cá nhân" : "Bài viết mới nhất";

    profileSection.style.display =
      currentFilter === "Trang cá nhân" ? "block" : "none";

    if (currentFilter === "Trang cá nhân") renderMyPosts();
    else renderList();
  });
});

// ========================== TÌM KIẾM ==========================
searchInput?.addEventListener("input", () => {
  currentFilter === "Trang cá nhân" ? renderMyPosts() : renderList();
});

// Click avatar → mở trang cá nhân
document.querySelector(".avatar")?.addEventListener("click", () => {
  if (!isLoggedIn()) return alert("Vui lòng đăng nhập!");
  document.querySelector('[data-cat="Trang cá nhân"]').click();
});

generalBtn?.addEventListener("click", () => {
  document.querySelector('[data-cat="Tổng hợp"]').click();
});

// ========================== THANH TÌM KIẾM MOBILE ==========================
imgSearch?.addEventListener("click", () => {
  searchbar.classList.toggle("active");
  imgSearch.classList.toggle("active");
  if (searchbar.classList.contains("active")) {
    searchInput.focus();
  }
});

// ========================== KHỞI TẠO ==========================
renderList();
