const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

// Bảo vệ trang: chưa đăng nhập hoặc không phải giảng viên → đá về login
if (!currentUser || currentUser.role !== "teacher") {
  alert("Vui lòng đăng nhập với tài khoản giảng viên!");
  window.location.href = "../../Auth/login.html";
}

// ======================= HIỂN THỊ + ĐIỀN THÔNG TIN CÁ NHÂN =======================
function loadUserInfo() {
  // Điền các trường có sẵn trong currentUser
  if (currentUser.name)
    document.getElementById("full-name").value = currentUser.name;
  if (currentUser.email)
    document.getElementById("email").value = currentUser.email;
  if (currentUser.phone)
    document.getElementById("phone-number").value = currentUser.phone;
  if (currentUser.dob)
    document.getElementById("date-of-birth").value = currentUser.dob;
  if (currentUser.gender)
    document.getElementById("gender").value = currentUser.gender;
  if (currentUser.province)
    document.getElementById("province").value = currentUser.province;
  if (currentUser.district)
    document.getElementById("district").value = currentUser.district;
}

// Gọi ngay khi load trang
document.addEventListener("DOMContentLoaded", loadUserInfo);

// ======================= LƯU THAY ĐỔI THÔNG TIN =======================
document.getElementById("save-btn")?.addEventListener("click", function () {
  const updatedInfo = {
    ...currentUser, // giữ nguyên id, role, password...
    name: document.getElementById("full-name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone-number").value.trim(),
    dob: document.getElementById("date-of-birth").value,
    gender: document.getElementById("gender").value,
    province: document.getElementById("province").value.trim(),
    district: document.getElementById("district").value.trim(),
  };

  // Cập nhật vào localStorage currentUser
  localStorage.setItem("currentUser", JSON.stringify(updatedInfo));

  // Cập nhật vào danh sách users (rất quan trọng để lần sau đăng nhập vẫn giữ thông tin)
  let allUsers = JSON.parse(localStorage.getItem("users") || "[]");
  const userIndex = allUsers.findIndex((u) => u.id === currentUser.id);
  if (userIndex !== -1) {
    allUsers[userIndex] = { ...allUsers[userIndex], ...updatedInfo };
    localStorage.setItem("users", JSON.stringify(allUsers));
  }

  alert("Cập nhật thông tin thành công!");
});

// ======================= MỞ MODAL ĐỔI MẬT KHẨU =======================
document
  .getElementById("change-password-btn")
  ?.addEventListener("click", () => {
    document.getElementById("modal-change-password").classList.add("show");
  });

// ======================= ĐÓNG MODAL =======================
function closeModal() {
  document.getElementById("modal-change-password").classList.remove("show");
  // Xóa dữ liệu form
  document
    .querySelectorAll("#modal-change-password input")
    .forEach((input) => (input.value = ""));
}

// Click nền hoặc nút Hủy để đóng
document
  .getElementById("modal-change-password")
  ?.addEventListener("click", function (e) {
    if (e.target === this || e.target.classList.contains("cancel-btn")) {
      closeModal();
    }
  });

// ======================= HIỆN/ẨN MẬT KHẨU =======================
function togglePass(icon) {
  const input = icon.previousElementSibling;
  if (!input) return;

  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  } else {
    input.type = "password";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  }
}

// ======================= XỬ LÝ ĐỔI MẬT KHẨU =======================
document
  .querySelector("#modal-change-password form")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();

    const oldPass = document.getElementById("current-password").value;
    const newPass = document.getElementById("new-password").value;
    const confirmPass = document.getElementById("confirm-password").value;

    if (!oldPass || !newPass || !confirmPass) {
      return alert("Vui lòng nhập đầy đủ thông tin!");
    }
    if (newPass !== confirmPass) {
      return alert("Mật khẩu mới không khớp!");
    }
    if (newPass.length < 8) {
      return alert("Mật khẩu mới phải có ít nhất 8 ký tự!");
    }

    // Lấy danh sách users
    let allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = allUsers.findIndex((u) => u.id === currentUser.id);

    if (userIndex === -1) {
      return alert("Lỗi hệ thống: Không tìm thấy tài khoản!");
    }

    // Kiểm tra mật khẩu cũ
    if (allUsers[userIndex].password !== oldPass) {
      return alert("Mật khẩu hiện tại không đúng!");
    }

    // Cập nhật mật khẩu mới
    allUsers[userIndex].password = newPass;
    localStorage.setItem("users", JSON.stringify(allUsers));

    alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại để bảo mật.");
  });
