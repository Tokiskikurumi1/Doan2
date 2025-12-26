// Load Sidebar
fetch("components/sidebar.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("sidebar-placeholder").innerHTML = html;
    restoreActiveMenu();
    sideBarActive();
  })
  .catch((err) => console.error("Lỗi load sidebar:", err));

// Load Header
fetch("components/header.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    updateLoginStatus();
    MenuToggle();
  })
  .catch((err) => console.error("Lỗi load header:", err));

// ==================== MENU TOGGLE ====================
function MenuToggle() {
  const menuIcon = document.getElementById("menuIcon");
  const leftSlide = document.querySelector(".left-slide");
  const overlay = document.getElementById("overlay");

  if (!menuIcon || !leftSlide || !overlay) {
    return;
  }

  menuIcon.onclick = () => {
    leftSlide.classList.toggle("active");
    overlay.classList.toggle("active");
  };

  overlay.onclick = () => {
    leftSlide.classList.remove("active");
    overlay.classList.remove("active");
  };
}

// ==================== ACTIVE MENU ====================
function sideBarActive() {
  const links = document.querySelectorAll(".nav-bar-title ul li a");

  links.forEach((item, index) => {
    item.addEventListener("click", () => {
      localStorage.setItem("activeMenu", index);
    });
  });
}

function restoreActiveMenu() {
  const links = document.querySelectorAll(".nav-bar-title ul li a");
  const activeIndex = localStorage.getItem("activeMenu");

  if (!links.length) return;

  links.forEach((a) => a.classList.remove("active"));
  if (activeIndex !== null && links[activeIndex]) {
    links[activeIndex].classList.add("active");
  }
}

// ==================== HIỂN THỊ THÔNG TIN NGƯỜI DÙNG ====================
function updateLoginStatus() {
  const userInfo = document.querySelector(".user-info");
  if (!userInfo) return;

  const user = JSON.parse(localStorage.getItem("currentUserData"));

  if (user) {
    userInfo.innerHTML = `
      <div class="avatar">
        <i class="fa-solid fa-user"></i>
      </div>
      <span style="font-weight: 500">
        ${user.role === "teacher" ? "GV. " : ""}${user.yourname}
      </span>
    `;

    // ĐĂNG XUẤT BẰNG LI – CHẠY 100%, KHÔNG BỊ ĐÈ SỰ KIỆN
    const logoutItem = document.getElementById("logout");
    if (logoutItem) {
      // Xóa hết sự kiện cũ (nếu có) bằng cách clone
      const newItem = logoutItem.cloneNode(true);
      logoutItem.parentNode.replaceChild(newItem, logoutItem);

      // Gắn sự kiện vào thẻ <li> mới
      newItem.addEventListener("click", (e) => {
        // Nếu bấm vào <a> bên trong thì vẫn chặn href
        e.preventDefault();
        if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
          localStorage.removeItem("currentUser");
          localStorage.removeItem("currentUserData");
          localStorage.removeItem("activeMenu");
          window.location.href = "../index.html";
        }
      });
    }
  } else {
    userInfo.innerHTML = `<a href="../User_header_footer/login.html">Đăng nhập</a>`;
  }
}
