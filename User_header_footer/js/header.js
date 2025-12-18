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

          // Messenger
          this.initMessenger();
          this.initChatList();
          this.initChatSend();
        });
      })
      .catch(err => console.error("Lỗi load header.html:", err));
  }

  /* ==========================
        LOAD USER
  ========================== */
  loadUser() {
    const user = UserManager.getCurrentUserData();
    if (!user) return;

    const name = this.querySelector(".user-name-popup p");
    const avatar = this.querySelector(".header-user-icon img");

    if (name) name.textContent = user.yourname || "User";
    if (avatar) avatar.src = user.avatar || "../img/img_GUI/user.png";
  }

  /* ==========================
        SEARCH BOX
  ========================== */
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

  /* ==========================
        DROPDOWN USER + NOTI
  ========================== */
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

  /* ==========================
        BURGER MENU
  ========================== */
  initBurgerMenu() {
    const toggle = this.querySelector("#burgerToggle");
    const menu = this.querySelector("#burgerMenu");

    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      menu.classList.toggle("active");
    });
  }

  /* ==========================
        LOGOUT
  ========================== */
  initLogout() {
    const btn = this.querySelector("#logoutBtn");
    if (!btn) return;

    btn.addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("currentUserData");
      window.location.href = "./login.html";
    });
  }

  /* ==========================
        MESSENGER: OPEN/CLOSE
  ========================== */
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

  /* ==========================
        MESSENGER: SELECT CHAT
  ========================== */
  initChatList() {
    const chatItems = this.querySelectorAll(".chat-item");
    const chatTitle = this.querySelector("#chatTitle");
    const chatBody = this.querySelector("#chatBody");

    if (!chatItems.length) return;

    chatItems.forEach(item => {
      item.addEventListener("click", () => {
        const name = item.querySelector(".chat-name").textContent;
        chatTitle.textContent = name;
        chatBody.innerHTML = ""; // load tin nhắn từ DB nếu có
      });
    });
  }

  /* ==========================
        MESSENGER: SEND MESSAGE
  ========================== */
  initChatSend() {
    const input = this.querySelector("#chatInput");
    const btn = this.querySelector("#sendChatBtn");
    const chatBody = this.querySelector("#chatBody");

    if (!input || !btn || !chatBody) return;

    const send = () => {
      const text = input.value.trim();
      if (!text) return;

      const msg = document.createElement("div");
      msg.className = "message user";
      msg.textContent = text;
      chatBody.appendChild(msg);

      input.value = "";
      chatBody.scrollTop = chatBody.scrollHeight;

      // Bot trả lời demo
      setTimeout(() => {
        const reply = document.createElement("div");
        reply.className = "message other";
        reply.textContent = "Đã nhận tin nhắn!";
        chatBody.appendChild(reply);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 500);
    };

    btn.addEventListener("click", send);
    input.addEventListener("keypress", e => {
      if (e.key === "Enter") send();
    });
  }
}

customElements.define("app-header", HeaderComponent);
