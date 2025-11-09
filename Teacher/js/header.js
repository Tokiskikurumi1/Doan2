const menuIcon = document.getElementById("menuIcon");
const leftSlide = document.querySelector(".left-slide");
const overlay = document.getElementById("overlay");
// Load Sidebar
fetch("components/sidebar.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("sidebar-placeholder").innerHTML = html;
    // highlightActiveNav();
  });

// Load Header
fetch("components/header.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;
    MenuToggle();
  });

// Menu toggle
function MenuToggle() {
  const menuIcon = document.getElementById("menuIcon");
  const leftSlide = document.querySelector(".left-slide");
  const overlay = document.getElementById("overlay");

  if (menuIcon && leftSlide && overlay) {
    menuIcon.addEventListener("click", () => {
      leftSlide.classList.toggle("active");
      overlay.classList.toggle("active");
    });
    overlay.addEventListener("click", () => {
      leftSlide.classList.remove("active");
      overlay.classList.remove("active");
    });
  }
}

function updateLoginStatus() {
  const loginTable = document.querySelector(".login");
  const currentUser = localStorage.getItem("savedUsername");
  const currentPass = localStorage.getItem("savedPassword");

  if (currentUser && currentPass) {
    loginTable.innerHTML = `
      <span>Chào mừng: ${currentUser} | <a href="../index.html" id="logout">Đăng xuất</a></span>
    `;
    document.getElementById("logout").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("savedUsername");
      localStorage.removeItem("savedPassword");
      localStorage.removeItem("savedRole");
      window.location.reload();
    });
  }
}
