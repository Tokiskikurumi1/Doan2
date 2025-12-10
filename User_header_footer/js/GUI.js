// search box

const searchBox = document.getElementById("searchBox");
const searchInput = searchBox.querySelector("input");
const searchIcon = document.getElementById("searchIcon");
const resultsContainer = document.getElementById("search-results-container");
const searchWrapper = document.querySelector(".header-search");
const searchResults = document.querySelector(".header-search-results");

let searchOpened = false;

searchResults.style.display = "none";

searchIcon.addEventListener("click", function () {
  if (!searchOpened) {
    searchWrapper.classList.add("active");
    searchInput.focus();
    searchOpened = true;
  } else {
    window.location.href = "/search";
  }
});

searchInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase().trim();
  resultsContainer.innerHTML = "";

  if (keyword === "") {
    searchResults.style.display = "none";
    return;
  }

  const filtered = ["a", "b", "c", "d", "e"].filter(item =>
    item.toLowerCase().includes(keyword)
  );

  if (filtered.length > 0) {
    searchResults.style.display = "block";
    filtered.forEach(item => {
      const div = document.createElement("div");
      div.className = "header-search-results-item";
      div.textContent = item;
      resultsContainer.appendChild(div);
    });
  } else {
    searchResults.style.display = "none";
  }
});

document.addEventListener("click", function (e) {
  const isClickInside = searchWrapper.contains(e.target);
  if (!isClickInside) {
    searchWrapper.classList.remove("active");
    searchResults.style.display = "none";
    searchOpened = false;
  }
});

// dropdown hover

function setupDropdownHover(containerId) {
  const container = document.getElementById(containerId);
  let timeout;

  container.addEventListener("mouseenter", () => {
    clearTimeout(timeout);
    container.classList.add("active");
  });

  container.addEventListener("mouseleave", () => {
    timeout = setTimeout(() => {
      container.classList.remove("active");
    }, 150);
  });
}

setupDropdownHover("userContainer");
setupDropdownHover("notificationContainer");

// burger menu

document.getElementById("burgerToggle").addEventListener("click", function () {
  const menu = document.getElementById("burgerMenu");
  menu.classList.toggle("active");
});

// hiện user info

function loadUserToGUI() {
  const currentUserId = localStorage.getItem("currentUser");
  if (!currentUserId) return;

  const users = JSON.parse(localStorage.getItem("listusers")) || {};
  const user = users[currentUserId];
  if (!user) return;

  // Hiển thị tên trong popup
  const namePopup = document.querySelector(".user-name-popup p");
  if (namePopup) {
    namePopup.textContent = user.yourname || "User";
  }

  // Hiển thị avatar
  const avatarImg = document.querySelector(".header-user-icon img");
  if (avatarImg) {
    avatarImg.src = user.avatar || "./img/img_GUI/user.png";
  }
}

loadUserToGUI();

// đăng xuất

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Xóa user hiện tại
    localStorage.removeItem("currentUser");

    // Chuyển về trang đăng nhập
    window.location.href = "../index.html";
  });
}


document.addEventListener("DOMContentLoaded", function () {
  loadUserToGUI();
});

function loadUserToGUI() {
  const currentUserId = localStorage.getItem("currentUser");
  if (!currentUserId) {
    console.warn("Không tìm thấy currentUser trong localStorage");
    return;
  }

  const users = JSON.parse(localStorage.getItem("listusers")) || {};
  const user = users[currentUserId];

  if (!user) {
    console.warn("Không tìm thấy user trong listusers");
    return;
  }

  // Load tên user
  const namePopup = document.querySelector(".user-name-popup p");
  if (namePopup) {
    namePopup.textContent = user.yourname || "User";
  } else {
    console.warn("Không tìm thấy .user-name-popup p");
  }

  // Load avatar
  const avatarImg = document.querySelector(".header-user-icon img");
  if (avatarImg) {
    avatarImg.src = user.avatar || "./img/img_GUI/user.png";
  }
}


