// ========================== KEY LOCALSTORAGE ==========================
const POSTS_KEY = "community_posts";
const COMMENTS_KEY = "community_comments";

// ========================== LẤY DỮ LIỆU ==========================
let posts = JSON.parse(localStorage.getItem(POSTS_KEY)) || [];
let commentsMap = JSON.parse(localStorage.getItem(COMMENTS_KEY)) || {};

// Dữ liệu mẫu
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

// ========================== LƯU DỮ LIỆU ==========================
function savePosts() {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}
function saveComments() {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(commentsMap));
}

// ========================== USER INFO ==========================
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

function isLoggedIn() {
  return !!localStorage.getItem("currentUser");
}

// ========================== DOM READY ==========================
document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const postList = document.getElementById("postList");
  const profileSection = document.getElementById("profileSection");
  const panelTitle = document.getElementById("panelTitle");
  const categories = document.querySelectorAll(".cat");
  const searchInput = document.getElementById("searchInput");

  // Modal
  const postModal = document.getElementById("postModal");
  const newPostModal = document.getElementById("newPostModal");
  const closeModal = document.getElementById("closeModal");
  const closeNewPost = document.getElementById("closeNewPost");

  // Tạo bài
  const newPostBtn = document.getElementById("newPostBtn");
  const createPost = document.getElementById("createPost");
  const postBody = document.getElementById("postBody");
  const postImageInput = document.getElementById("postImage");
  const imagePreview = document.getElementById("imagePreview");

  // Bình luận
  const commentInput = document.getElementById("commentInput");
  const sendComment = document.getElementById("sendComment");

  let currentFilter = "Tổng hợp";
  let currentPost = null;

  // ========================== CẬP NHẬT AVATAR ==========================
  function updateUserDisplay() {
    const info = getCurrentUserInfo();
    document
      .querySelectorAll(".actions .avatar, .avt_create .c-avatar")
      .forEach((el) => {
        el.textContent = info.avt;
      });
    document.querySelector(".avt_create .meta")?.replaceChildren(info.name);
  }

  // ========================== RENDER ==========================
  function renderList() {
    if (!postList) return;
    if (!isLoggedIn()) {
      postList.innerHTML = `<div style="padding:40px;text-align:center;color:#6b7280;font-size:18px;">
        Vui lòng <a href="../User_header_footer/login.html" style="color:#2563eb;text-decoration:underline;">đăng nhập</a> để xem các bài viết.
      </div>`;
      return;
    }

    postList.innerHTML = "";
    const q = (searchInput?.value || "").toLowerCase().trim();
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

    // el.querySelector(".heart-card").addEventListener("click", (e) => {
    //   e.stopPropagation();
    //   p._liked = !p._liked;
    //   p.likes += p._liked ? 1 : -1;
    //   savePosts();
    //   currentFilter === "Trang cá nhân" ? renderMyPosts() : renderList();
    // });

    el.querySelector(".message-card").addEventListener("click", (e) => {
      e.stopPropagation();
      openPost(p.id);
    });

    postList.appendChild(el);
  }

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
    const q = (searchInput?.value || "").toLowerCase().trim();
    const myPosts = posts.filter(
      (p) =>
        p.author === info.name &&
        ((p.content || "").toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q))
    );

    if (myPosts.length === 0) {
      postList.innerHTML =
        '<div style="padding:40px;color:#6b7280;text-align:center;">Bạn chưa đăng bài nào.</div>';
      return;
    }
    myPosts.forEach((p) => renderSinglePost(p));
  }

  // ========================== MODAL ==========================
  function openPost(id) {
    const p = posts.find((x) => x.id === id);
    if (!p) return;
    currentPost = p;

    document.getElementById("modalMeta").innerHTML = `
      <div class="avt-name-title">
        <div class="c-avatar">${p.avt}</div>
        <div class="meta">Bởi ${p.author} • ${p.time}</div>
      </div>
    `;
    document.getElementById("modalContent").innerHTML = `
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

  function renderComments() {
    const container = document.getElementById("comments");
    const arr = commentsMap[currentPost.id] || [];
    container.innerHTML =
      arr.length === 0
        ? '<div style="color:#9ca3af;padding:12px 0">Chưa có bình luận nào.</div>'
        : "";

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
      container.appendChild(el);
    });
  }

  // ========================== TẠO BÀI ==========================
  newPostBtn?.addEventListener("click", () => {
    newPostModal.setAttribute("aria-hidden", "false");
  });

  closeNewPost?.addEventListener("click", () => {
    newPostModal.setAttribute("aria-hidden", "true");
  });

  createPost?.addEventListener("click", () => {
    const body = postBody.value.trim();
    const file = postImageInput.files[0];

    if (!body && !file) return alert("Hãy viết gì đó hoặc thêm ảnh nhé!");

    const info = getCurrentUserInfo();
    const newId = posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1;

    const addPost = (imgBase64 = null) => {
      posts.unshift({
        id: newId,
        author: info.name,
        authorId: info.id,
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
      postBody.value = "";
      postImageInput.value = "";
      imagePreview.src = "";
      imagePreview.style.display = "none";
      newPostModal.setAttribute("aria-hidden", "true");
      currentFilter === "Trang cá nhân" ? renderMyPosts() : renderList();
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => addPost(e.target.result);
      reader.readAsDataURL(file);
    } else {
      addPost();
    }
  });

  // Preview ảnh
  postImageInput?.addEventListener("change", () => {
    const file = postImageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // ========================== BÌNH LUẬN ==========================
  sendComment?.addEventListener("click", () => {
    const txt = commentInput.value.trim();
    if (!txt) return alert("Vui lòng nhập bình luận!");

    const info = getCurrentUserInfo();
    if (!commentsMap[currentPost.id]) commentsMap[currentPost.id] = [];

    commentsMap[currentPost.id].push({
      name: info.name,
      avt: info.avt,
      time: "vừa xong",
      text: txt,
    });

    currentPost.comments = commentsMap[currentPost.id].length;
    savePosts();
    saveComments();
    commentInput.value = "";
    renderComments();
    currentFilter === "Trang cá nhân" ? renderMyPosts() : renderList();
  });

  // ========================== TAB & TÌM KIẾM ==========================
  categories.forEach((cat) => {
    cat.addEventListener("click", () => {
      categories.forEach((c) => c.classList.remove("active"));
      cat.classList.add("active");
      currentFilter = cat.getAttribute("data-cat");
      panelTitle.textContent =
        currentFilter === "Trang cá nhân"
          ? "Trang cá nhân"
          : "Bài viết mới nhất";
      profileSection.style.display =
        currentFilter === "Trang cá nhân" ? "block" : "none";
      currentFilter === "Trang cá nhân" ? renderMyPosts() : renderList();
    });
  });

  searchInput?.addEventListener("input", () => {
    currentFilter === "Trang cá nhân" ? renderMyPosts() : renderList();
  });

  // Click avatar → trang cá nhân
  document.querySelector(".actions .avatar")?.addEventListener("click", () => {
    if (!isLoggedIn()) return alert("Vui lòng đăng nhập!");
    document.querySelector('[data-cat="Trang cá nhân"]').click();
  });

  // Nút tổng hợp
  document.getElementById("generalBtn")?.addEventListener("click", () => {
    document.querySelector('[data-cat="Tổng hợp"]').click();
  });

  // Đóng modal khi click ngoài
  postModal?.addEventListener("click", (e) => {
    if (e.target === postModal) postModal.setAttribute("aria-hidden", "true");
  });
  closeModal?.addEventListener("click", () => {
    postModal.setAttribute("aria-hidden", "true");
  });

  // Mobile search
  document.querySelector(".img-search")?.addEventListener("click", () => {
    document.querySelector(".topbar .searchbar").classList.toggle("active");
    document.querySelector(".img-search").classList.toggle("active");
    if (
      document.querySelector(".topbar .searchbar").classList.contains("active")
    ) {
      searchInput.focus();
    }
  });

  // ========================== KHỞI TẠO ==========================
  updateUserDisplay();
  renderList();
});
