
// Lưu đang nhập
function savedUserdata() {
  const isCheckbox = document.getElementById("checkbox").checked;
  if (isCheckbox) {
    localStorage.setItem("isLoggedIn", "true");
  } else {
    localStorage.removeItem("isLoggedIn");
  }
}

// Mặc định hiển thị form đăng nhập và điền dữ liệu đã lưu
window.onload = () => {
  showForm("Auth-Login");

  const savedUsername = localStorage.getItem("savedUsername");
  const savedPassword = localStorage.getItem("savedPassword");
  const savedRole = localStorage.getItem("savedRole");

  if (savedUsername && savedPassword && savedRole) {
    document.getElementById("login-username").value = savedUsername;
    document.getElementById("login-password").value = savedPassword;
    document.getElementById("login-role").value = savedRole;
    document.querySelector(".Auth-Login input[type='checkbox']").checked = true;
  }
};


// Hiệu ứng chuyển đổi form
function showForm(formClass) {
  document.querySelectorAll(".Auth > div").forEach((div) => {
    div.style.display = "none";
    div.classList.remove("active");
  });
  const target = document.querySelector(`.${formClass}`);
  target.style.display = "flex";
  setTimeout(() => target.classList.add("active"), 50);
}

// Chuyển đổi giữa các form
document.querySelector(".Auth-Login span:nth-of-type(1)").onclick = () =>
  showForm("Forgot-password");
document.querySelector(".Auth-Login span:nth-of-type(2)").onclick = () =>
  showForm("Auth-Signup");
document.querySelector(".Auth-Signup span").onclick = () =>
  showForm("Auth-Login");
document.querySelector(".Forgot-password span").onclick = () =>
  showForm("Auth-Login");

// Dữ liệu kiểm tra
const regex = {
  username: /^[a-zA-Z0-9]{0,12}$/,
  email: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
  password: /^[a-zA-Z0-9]{0,12}$/, // này mới chất
  // password: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/, đăng nhập quá mất thời gian
};

// Hàm hiển thị lỗi
function showError(message) {
  alert(message);
}

// Xử lý đăng nhập
document.querySelector(".Auth-Login button").onclick = () => {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const role = document.getElementById("login-role").value;
  const remember = document.querySelector(
    ".Auth-Login input[type='checkbox']"
  ).checked;

  if (!regex.username.test(username)) {
    return showError("Sai tài khoản hoặc mật khẩu.");
  }
  if (!regex.password.test(password)) {
    return showError("Sai tài khoản hoặc mật khẩu.");
  }
  if (!role) {
    return showError("Vui lòng chọn vai trò.");
  }

  if (remember) {
    localStorage.setItem("savedUsername", username);
    localStorage.setItem("savedPassword", password);
    localStorage.setItem("savedRole", role);
  } else {
    localStorage.removeItem("savedUsername");
    localStorage.removeItem("savedPassword");
    localStorage.removeItem("savedRole");
  }
  // alert("Đăng nhập thành công!");


  // Chuyển hướng theo vai trò
  if (role === "student") {
    let time = 3;
    const countdownElement = document.getElementById("countdown");
    countdownElement.textContent = `Đăng nhập thành công,...`;

    const interval = setInterval(() => {
      time--;
      countdownElement.textContent = `Chuyển sang giao diện chính trong ${time}...`;
      if (time === 0) {
        clearInterval(interval);
        countdownElement.textContent = "Đang chuyển sang giao diện chính...";
        setTimeout(() => {
          window.location.href = "../index.html"; // ← Giao diện chính
        }, 500);
      }
    }, 1000);
  } else if (role === "teacher") {
    window.location.href = "#";
  }
};



// Xử lý đăng ký
document.querySelector(".Auth-Signup button").onclick = () => {
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document
    .getElementById("signup-password-confirm")
    .value.trim();
  const role = document.getElementById("signup-role").value;
  const agree = document.querySelector(
    '.Auth-Signup input[type="checkbox"]'
  ).checked;

  if (!regex.username.test(username)) {
    return showError("Tên tài khoản phải từ 8 đến 12 ký tự không dấu.");
  }
  if (!regex.email.test(email)) {
    return showError("Email phải có định dạng example@gmail.com.");
  }
  if (!regex.password.test(password)) {
    return showError(
      "Mật khẩu phải ≥ 8 ký tự, viết hoa chữ cái đầu và có ký tự đặc biệt."
    );
  }
  if (password !== confirmPassword) {
    return showError("Mật khẩu nhập lại không khớp.");
  }
  if (!role) {
    return showError("Vui lòng chọn vai trò.");
  }
  if (!agree) {
    return showError("Bạn cần đồng ý với điều khoản.");
  }

  alert("Đăng ký thành công!");
  showForm("Auth-Login");
};

// Xử lý quên mật khẩu
document.querySelector(".Forgot-password button").onclick = () => {
  const email = document.getElementById("forgot-email").value.trim();
  const agree = document.querySelector(
    '.Forgot-password input[type="checkbox"]'
  ).checked;

  if (!regex.email.test(email)) {
    return showError("Email phải có định dạng example@gmail.com.");
  }
  if (!agree) {
    return showError("Bạn cần đồng ý với điều khoản.");
  }

  alert("Mật khẩu đã được gửi lại qua email!");
  showForm("Auth-Login");
};

//===================== XỬ LÝ GIAO DIỆN KHI LỰA CHỌN VAI TRÒ ============================
