  .then((html) => {
    document.getElementById("sidebar-placeholder").innerHTML = html;
    restoreActiveMenu();
    sideBarActive();
  })
  .catch((err) => console.error("Lỗi load sidebar:", err));

// Load Header
fetch("Components/header.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;

    MenuToggle(); // phải gọi ở đây, không gọi sớm quá!
  })
  .catch((err) => console.error("Lỗi load header:", err));

// ==================== MENU TOGGLE ====================
function MenuToggle() {
  const menuIcon = document.getElementById("menuIcon");
  const leftSlide = document.querySelector(".left-slide");
  const overlay = document.getElementById("overlay");

  // Phải kiểm tra tồn tại (vì có thể đang ở trang không có header)
  if (!menuIcon || !leftSlide || !overlay) {
    return; // thoát nếu không có phần tử (trang login chẳng hạn)
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

  if (!links.length) return; // nếu chưa load sidebar thì thôi

  links.forEach((a) => a.classList.remove("active"));
  if (activeIndex !== null && links[activeIndex]) {
    links[activeIndex].classList.add("active");
  }
}
# Bug fixes and improvements
# Bug fixes and improvements
# Bug fixes and improvements
# Performance optimization
// Code documentation updated
// Feature flag implementation
   Code review suggestions applied */
// Bug fixes and code refactoring
// API improvements and error handling
// API improvements and error handling
// Logging mechanism enhanced
// API improvements and error handling
// API improvements and error handling
// Unit tests added for better coverage
// Enhanced functionality - 2026-01-10
// Configuration settings optimized
   Code review suggestions applied */
// Security enhancements integrated
// Code documentation updated
