// =================== HOME.JS – PHIÊN BẢN CHẠY ỔN KHI ĐỂ RIÊNG FILE ===================

// 1. MENU MOBILE
const menuIcon = document.querySelector("#menu-icon");
const navMobile = document.querySelector(".nav-bar-menu-icon-active");

if (menuIcon && navMobile) {
  menuIcon.onclick = () => {
    navMobile.classList.toggle("active");
    menuIcon.classList.toggle("fa-bars");
    menuIcon.classList.toggle("fa-x");
  };
}

// 2. CẬP NHẬT TRẠNG THÁI ĐĂNG NHẬP
function updateLoginStatus() {
  const loginArea = document.querySelector(".login");
  if (!loginArea) return; // nếu chưa có thì thôi, không lỗi

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser && currentUser.username) {
    loginArea.innerHTML = `
      <span>Chào mừng: ${
        currentUser.name || currentUser.username
      } | <a href="#" id="logout">Đăng xuất</a></span>
    `;
    document.getElementById("logout")?.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      location.reload();
    });
  } else {
    loginArea.innerHTML = `
      <a href="./User_header_footer/login.html"><span>Đăng nhập</span></a>
      <span>/</span>
      <a href="./User_header_footer/login.html"><span>Đăng ký</span></a>
    `;
  }
}

// 3. HIỂN THỊ KHÓA HỌC PHỔ BIẾN (5 KHÓA ĐẦU TIÊN)
function renderPopularCourses() {
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const container = document.querySelector(".popular-courses-list");

  if (!container) return;

  container.innerHTML = ""; // xóa box cũ

  const displayCourses = courses.slice(0, 5);

  if (displayCourses.length === 0) {
    container.innerHTML =
      '<p style="grid-column: 1 / -1; text-align:center; padding:40px;">Chưa có khóa học nào</p>';
    return;
  }

  displayCourses.forEach((course) => {
    const box = document.createElement("div");
    box.className = "box";
    box.innerHTML = `
        <img src="${course.image}" alt="${course.title || ""}">
        <h3>${course.name}</h3>
        <div class="info">
          <span>${
            course.price
              ? Number(course.price).toLocaleString("vi-VN") + " VND"
              : "Miễn phí"
          }</span>
        </div>
    `;
    container.appendChild(box);
  });
}

// 4. CHẠY KHI DOM SẴN SÀNG (QUAN TRỌNG NHẤT)
document.addEventListener("DOMContentLoaded", () => {
  updateLoginStatus(); // đăng nhập
  renderPopularCourses(); // khóa học phổ biến
});

// Nếu trang load chậm (header/footer load bằng JS), chạy lại sau 1 lần nữa cho chắc
window.addEventListener("load", () => {
  setTimeout(() => {
    updateLoginStatus();
    renderPopularCourses();
  }, 300);
});
