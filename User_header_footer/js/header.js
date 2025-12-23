import { UserManager, CourseManager } from "../js/object.js";

class HeaderComponent extends HTMLElement {
  connectedCallback() {
    fetch("./header.html")
      .then(res => res.text())
      .then(html => {
        this.innerHTML = html;
        requestAnimationFrame(() => {
          this.loadUser();
          this.initSearch();
          this.initDropdowns();
          this.initBurgerMenu();
          this.initLogout();
          this.initMessenger();
          this.initChatList();
          
        });
      })
      .catch(err => console.error("Lỗi load header.html:", err));
  }


  loadUser() {
    const user = UserManager.getCurrentUserData();
    if (!user) return;
    const name = this.querySelector(".user-name-popup p");
    const avatar = this.querySelector(".header-user-icon img");
    if (name) name.textContent = user.yourname || "User";
    if (avatar) avatar.src = user.avatar || "../img/img_GUI/user.png";
  }

  initSearch() {
    const wrapper = this.querySelector(".header-search");
    const input = this.querySelector("#searchBox input");
    const icon = this.querySelector("#searchIcon");
    const resultsBox = this.querySelector(".header-search-results");
    const coursesList = this.querySelector("#search-courses");
    const assignmentsList = this.querySelector("#search-assignments");
    const videosList = this.querySelector("#search-videos");

    if (!wrapper || !input || !icon || !resultsBox) return;

    resultsBox.style.display = "none";

    // mở ô tìm kiếm khi click icon
    icon.addEventListener("click", () => {
      wrapper.classList.add("active");
      input.focus();
    });

    // nhập chữ
    input.addEventListener("input", () => {
  const keyword = input.value.trim().toLowerCase();
  coursesList.innerHTML = "";
  assignmentsList.innerHTML = "";
  videosList.innerHTML = "";

  resultsBox.style.display = "block";

  if (!keyword) {
    resultsBox.style.display = "none";
    return;
  }

  const courses = Object.values(CourseManager.getAll() || {});
  const courseResults = courses.filter(c => c.name.toLowerCase().includes(keyword));
  const videoResults = [];
  const assignmentResults = [];

  courses.forEach(course => {
    (course.videos || []).forEach(video => {
      if (video.title.toLowerCase().includes(keyword)) videoResults.push(video);
      (video.assignments || []).forEach(a => {
        if (a.title.toLowerCase().includes(keyword)) assignmentResults.push(a);
      });
    });
  });

  //luôn hiển thị kết quả hoặc thông báo không tìm thấy
  if (courseResults.length) {
    courseResults.forEach(c => {
      const li = document.createElement("li");
      li.textContent = c.name;
      li.addEventListener("click", () => {
        window.location.href = `./course.html?id=${c.id}`;
      });
      coursesList.appendChild(li);
    });
  } else {
    coursesList.innerHTML = "<li>Không tìm thấy khóa học</li>";
  }

  if (videoResults.length) {
    videoResults.forEach(v => {
      const li = document.createElement("li");
      li.textContent = v.title;
      li.addEventListener("click", () => {
        window.location.href = `./video.html?id=${v.id}`;
      });
      videosList.appendChild(li);
    });
  } else {
    videosList.innerHTML = "<li>Không tìm thấy video</li>";
  }

  if (assignmentResults.length) {
    assignmentResults.forEach(a => {
      const li = document.createElement("li");
      li.textContent = a.title;
      li.addEventListener("click", () => {
        window.location.href = `./assignment.html?id=${a.id}`;
      });
      assignmentsList.appendChild(li);
    });
  } else {
    assignmentsList.innerHTML = "<li>Không tìm thấy bài tập</li>";
  }
});




    // đóng khi click ra ngoài
    document.addEventListener("click", e => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove("active");
        resultsBox.style.display = "none";
      }
    });
  }


  initDropdowns() {
    const setup = id => {
      const el = this.querySelector(`#${id}`);
      if (!el) return;
      let timeout;
      el.addEventListener("mouseenter", () => {
        clearTimeout(timeout);
        el.classList.add("active");
      });
      el.addEventListener("mouseleave", () => {
        timeout = setTimeout(() => el.classList.remove("active"), 150);
      });
    };
    setup("userContainer");
    setup("notificationContainer");
  }


  initBurgerMenu() {
    const toggle = this.querySelector("#burgerToggle");
    const menu = this.querySelector("#burgerMenu");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", () => {
      menu.classList.toggle("active");
    });
  }


  initLogout() {
    const btn = this.querySelector("#logoutBtn");
    if (!btn) return;
    btn.addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("currentUserData");
      window.location.href = "./login.html";
    });
  }

  initMessenger() {
    const icon = this.querySelector(".header-message-icon");
    const container = this.querySelector("#messengerContainer");
    const closeBtn = this.querySelector("#closeMessenger");
    if (!icon || !container || !closeBtn) return;
    icon.addEventListener("click", () => {
      container.style.display = "flex";
    });
    closeBtn.addEventListener("click", () => {
      container.style.display = "none";
    });
  }

  initChatList() {
    const chatItems = this.querySelectorAll(".chat-item");
    const chatTitle = this.querySelector("#chatTitle");
    const chatBody = this.querySelector("#chatBody");
    if (!chatItems.length) return;
    chatItems.forEach(item => {
      item.addEventListener("click", () => {
        const name = item.querySelector(".chat-name").textContent;
        chatTitle.textContent = name;
        chatBody.innerHTML = "";
      });
    });
  }

  
}

customElements.define("app-header", HeaderComponent);
