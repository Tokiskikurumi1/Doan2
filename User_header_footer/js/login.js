  // login.js
  import { User, UserManager } from './object.js';
  console.log("JS đã được tải");


  document.addEventListener("DOMContentLoaded", () => {
    showForm("Auth-Login");

    document.querySelector(".link-forgot").onclick = () => showForm("Forgot-password");
    document.querySelector(".link-signup").onclick = () => showForm("Auth-Signup");
    document.querySelectorAll(".link-login").forEach((el) => {
      el.onclick = () => showForm("Auth-Login");
    });

    document.getElementById("signup-button").onclick = registerUser;
    document.getElementById("login-button").onclick = loginUser;
    document.getElementById("reset-button").onclick = resetPassword;
  });

  function showForm(formClass) {
    document.querySelectorAll(".Auth > div").forEach((div) => {
      div.classList.remove("active");
    });
    document.querySelector(`.${formClass}`).classList.add("active");
  }


  const usernameRegex = /^[a-zA-Z0-9]{4,12}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function registerUser() {
    const yourname = document.getElementById("signup-yourname").value.trim();
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirmPassword = document.getElementById("signup-password-confirm").value.trim();

    if (!usernameRegex.test(username)) return alert("Tên tài khoản không hợp lệ.");
    if (!passwordRegex.test(password)) return alert("Mật khẩu không hợp lệ.");
    if (password !== confirmPassword) return alert("Mật khẩu xác nhận không khớp.");
    if (!emailRegex.test(email)) return alert("Email không hợp lệ.");
    if (UserManager.userExists(username)) return alert("Tên tài khoản đã tồn tại.");
    if (UserManager.isEmailTaken(email)) return alert("Email đã được sử dụng.");

    const newUser = new User({ username, yourname, email, password });
    newUser.save();

    alert("Đăng ký thành công!");
    showForm("Auth-Login");
  }

  function loginUser() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const role = document.getElementById("login-role").value;

    if (!username || !password || !role) {
      alert("Vui lòng nhập đầy đủ thông tin và chọn vai trò.");
      return;
    }

    if (username === "a" && password === "a" && role === "teacher") {
      UserManager.setCurrentUser(username);
      window.location.href = "Teacher/teacher.html";
      return;
    }

    if (UserManager.validateLogin(username, password)) {
      UserManager.setCurrentUser(username);
      alert("Đăng nhập thành công!");
      window.location.href = "index.html";
    } else {
      alert("Tên tài khoản hoặc mật khẩu không đúng.");
    }
  }

  function resetPassword() {
    const email = document.getElementById("forgot-email").value;
    const password = UserManager.getPasswordByEmail(email);
    if (password) {
      alert("Mật khẩu của bạn là: " + password);
    } else {
      alert("Email không tồn tại trong hệ thống.");
    }
  }
