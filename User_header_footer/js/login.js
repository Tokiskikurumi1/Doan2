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

async function registerUser() {
  const yourname = document.getElementById("signup-yourname").value.trim();
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document
    .getElementById("signup-password-confirm")
    .value.trim();
  const agreeTerms = document.getElementById("checkbox1").checked;

  if (!agreeTerms)
    return alert("Bạn phải đồng ý với điều khoản trước khi đăng ký.");
  if (!usernameRegex.test(username))
    return alert("Tên tài khoản không hợp lệ.");
  if (!passwordRegex.test(password)) return alert("Mật khẩu không hợp lệ.");
  if (password !== confirmPassword)
    return alert("Mật khẩu xác nhận không khớp.");
  if (!emailRegex.test(email)) return alert("Email không hợp lệ.");

  try {
    const userData = {
      username,
      yourname,
      email,
      password,
      role: "student",
    };

    await apiClient.register(userData);

    alert("Đăng ký thành công!");
    showForm("Auth-Login");
  } catch (err) {
    alert("Có lỗi khi đăng ký: " + err.message);
  }
}

async function loginUser() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const rememberMe = document.getElementById("checkbox").checked;

  if (!username || !password) {
    alert("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  try {
    const data = await apiClient.login(username, password);

    // Lưu token và thông tin user
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));

    if (rememberMe) {
      localStorage.setItem("rememberLogin", "true");
    } else {
      localStorage.removeItem("rememberLogin");
    }

    alert("Đăng nhập thành công!");

    // Chuyển hướng dựa trên vai trò từ database
    if (data.RoleID === 3) {
      window.location.href = "./home.html";
    } else if (data.RoleID === 2) {
      window.location.href = "../Teacher/teacher.html";
    } else {
      // Default redirect if role not recognized
      window.location.href = "./home.html";
    }
  } catch (error) {
    console.error('Login error:', error);
    alert("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.");
  }
}
# Feature enhancement 2026-01-10 18:02:42
# UI/UX improvements
# Performance optimization
# UI/UX improvements
// UI/UX improvements added
// Bug fixes and code refactoring
   Additional implementation details
// Enhanced functionality - 2026-01-10
// UI/UX improvements added
// Bug fixes and code refactoring
// Code documentation updated
// API improvements and error handling
// Security enhancements integrated
// Feature flag implementation
