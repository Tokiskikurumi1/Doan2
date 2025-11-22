// Kiểm tra người dùng tồn tại
currentUser = localStorage.getItem("currentUser");
window.addEventListener("DOMContentLoaded", () => {
  let currentUser = localStorage.getItem("currentUser");
  if (currentUser && listusers[currentUser]) {
    window.location.href = "index.html";
  }
});
// login.js
import { User, UserManager } from "./object.js";

document.addEventListener("DOMContentLoaded", () => {
  showForm("Auth-Login");

  document.querySelector(".link-forgot").onclick = () =>
    showForm("Forgot-password");
  document.querySelector(".link-signup").onclick = () =>
    showForm("Auth-Signup");
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

// Regex kiểm tra
const usernameRegex = /^[a-zA-Z0-9]{4,12}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function registerUser() {
  const yourname = document.getElementById("signup-yourname").value.trim();
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document
    .getElementById("signup-password-confirm")
    .value.trim();

  if (!usernameRegex.test(username))
    return alert("Tên tài khoản không hợp lệ.");
  if (!passwordRegex.test(password)) return alert("Mật khẩu không hợp lệ.");
  if (password !== confirmPassword)
    return alert("Mật khẩu xác nhận không khớp.");
  if (!emailRegex.test(email)) return alert("Email không hợp lệ.");

  const users = UserManager.getAllUsers();
  const exists = Object.values(users).some((u) => u.username === username);
  if (exists) return alert("Tên tài khoản đã tồn tại.");
  if (UserManager.isEmailTaken(email)) return alert("Email đã được sử dụng.");

  // mặc định role là student khi đăng ký
  try {
    const newUser = new User({
      username,
      yourname,
      email,
      password,
      role: "student",
    });
    newUser.save();
    alert("Đăng ký thành công!");
    showForm("Auth-Login");
  } catch (err) {
    alert(err.message);
  }
}
document.getElementById("signup-button").onclick = registerUser;
// Hàm đăng nhập

function loginUser() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const role = document.getElementById("login-role").value;

  if (!username || !password || !role) {
    alert("Vui lòng nhập đầy đủ thông tin và chọn vai trò.");
    return;
  }

  const users = UserManager.getAllUsers();
  const user = Object.values(users).find((u) => u.username === username);

  if (!user) {
    alert("Tài khoản không tồn tại.");
    return;
  }

  if (user.password !== password) {
    alert("Mật khẩu không đúng.");
    return;
  }

  if (user.role !== role) {
    alert("Vai trò không khớp với tài khoản.");
    return;
  }

  // lưu id của user hiện tại
  UserManager.setCurrentUser(user.id);

  alert("Đăng nhập thành công!");

  // điều hướng theo role
  if (user.role === "teacher") {
    window.location.href = "Teacher/teacher.html";
  } else if (user.role === "student") {
    window.location.href = "info.html";
  } else {
    alert("Vai trò không hợp lệ.");
  }
}

// Hàm đặt lại mật khẩu
function resetPassword() {
  const email = document.getElementById("forgot-email").value.trim();
  const password = UserManager.getPasswordByEmail(email);
  if (password) {
    alert("Mật khẩu của bạn là: " + password);
  } else {
    alert("Email không tồn tại trong hệ thống.");
  }
}
