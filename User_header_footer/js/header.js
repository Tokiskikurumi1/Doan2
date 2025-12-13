import { UserManager } from "../js/object.js";
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
    const resultsContainer = this.querySelector("#search-results-container");

    if (!wrapper || !input || !icon || !resultsBox) return;

    resultsBox.style.display = "none";
    let opened = false;

    icon.addEventListener("click", () => {
      if (!opened) {
        wrapper.classList.add("active");
        input.focus();
        opened = true;
      }
    });

    input.addEventListener("input", () => {
      const keyword = input.value.trim().toLowerCase();
      resultsContainer.innerHTML = "";

      if (!keyword) {
        resultsBox.style.display = "none";
        return;
      }

      const fakeData = ["Ngữ pháp", "Từ vựng", "Giao tiếp", "Phát âm", "TOEIC"];
      const filtered = fakeData.filter(x => x.toLowerCase().includes(keyword));

      if (filtered.length) {
        resultsBox.style.display = "block";
        filtered.forEach(item => {
          const div = document.createElement("div");
          div.className = "header-search-results-item";
          div.textContent = item;
          resultsContainer.appendChild(div);
        });
      } else {
        resultsBox.style.display = "none";
      }
    });

    document.addEventListener("click", e => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove("active");
        resultsBox.style.display = "none";
        opened = false;
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
}

customElements.define("app-header", HeaderComponent);
