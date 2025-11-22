const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Bảo vệ trang
if (!currentUser || currentUser.role !== "teacher") {
  alert("Vui lòng đăng nhập với tài khoản giảng viên!");
  window.location.href = "../User_header_footer/login.html";
}

const fullName = document.getElementById("full-name");
const email = document.getElementById("email");
const phoneNumber = document.getElementById("phone-number");
const dateOfBirth = document.getElementById("date-of-birth");
const gender = document.getElementById("gender");
const province = document.getElementById("province");
const district = document.getElementById("district");

// ======================= LOAD THÔNG TIN =======================
function loadUserInfo() {
  // SỬA 1: LẤY DỮ LIỆU TỪ "listusers" VÀ CHUYỂN THÀNH MẢNG
  const rawData = localStorage.getItem("listusers");
  if (!rawData) {
    alert("Không có dữ liệu người dùng!");
    return;
  }

  const usersObject = JSON.parse(rawData); // { "123": {user}, "456": {user} }
  const usersArray = Object.values(usersObject); // ← thành mảng

  // SỬA 2: ÉP KIỂU ID VỀ STRING ĐỂ SO SÁNH AN TOÀN
  const fullUserInfo = usersArray.find(
    (u) => String(u.id) === String(currentUser.id)
  );

  if (!fullUserInfo) {
    console.error("Không tìm thấy user với id:", currentUser.id);
    console.log("Danh sách user:", usersArray);
    alert("Không tải được thông tin cá nhân! Vui lòng đăng nhập lại.");
    window.location.href = "../User_header_footer/login.html";
    return;
  }

  // Điền thông tin
  fullName.value = fullUserInfo.yourname || "";
  email.value = fullUserInfo.email || "";
  phoneNumber.value = fullUserInfo.phone || "";
  dateOfBirth.value = fullUserInfo.dob || "";
  gender.value = fullUserInfo.gender || "";
  province.value = fullUserInfo.province || "";
  district.value = fullUserInfo.district || "";

  // Cập nhật lại currentUser để chắc chắn
  localStorage.setItem("currentUser", JSON.stringify(fullUserInfo));
}

document.addEventListener("DOMContentLoaded", loadUserInfo);

// ======================= LƯU THÔNG TIN =======================
document.getElementById("save-btn")?.addEventListener("click", function () {
  const updatedData = {
    yourname: fullName.value.trim(),
    email: email.value.trim(),
    phone: phoneNumber.value.trim(),
    dob: dateOfBirth.value,
    gender: gender.value,
    province: province.value.trim(),
    district: district.value.trim(),
  };

  // LẤY DỮ LIỆU TỪ listusers ĐÚNG CÁCH
  const rawData = localStorage.getItem("listusers");
  const usersObject = rawData ? JSON.parse(rawData) : {};

  if (usersObject[currentUser.id]) {
    // Cập nhật user trong danh sách
    usersObject[currentUser.id] = {
      ...usersObject[currentUser.id],
      ...updatedData,
    };
    localStorage.setItem("listusers", JSON.stringify(usersObject));

    // Cập nhật currentUser
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ ...currentUser, ...updatedData })
    );

    alert("Cập nhật thông tin thành công!");
  } else {
    alert("Lỗi: Không tìm thấy tài khoản!");
  }
});

// ======================= ĐỔI MẬT KHẨU =======================
document
  .getElementById("change-password-btn")
  ?.addEventListener("click", () => {
    const modal = document.getElementById("modal-change-password");
    if (modal) modal.classList.add("show");
  });

// ======================= ĐÓNG MODAL =======================
function closeModal() {
  const modal = document.getElementById("modal-change-password");
  if (modal) {
    modal.classList.remove("show");
    modal.querySelectorAll("input").forEach((i) => (i.value = ""));
  }
}

// Đóng khi click nền hoặc nút Hủy
document
  .getElementById("modal-change-password")
  ?.addEventListener("click", function (e) {
    if (e.target === this || e.target.classList.contains("cancel-btn")) {
      closeModal();
    }
  });

// ======================= XỬ LÝ ĐỔI MẬT KHẨU =======================
document.addEventListener("DOMContentLoaded", () => {
  const changePassForm = document.querySelector("#modal-change-password form");
  if (!changePassForm) return;

  changePassForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const oldPass = document.getElementById("current-password").value;
    const newPass = document.getElementById("new-password").value;
    const confirmPass = document.getElementById("confirm-password").value;

    if (!oldPass || !newPass || !confirmPass)
      return alert("Vui lòng nhập đầy đủ thông tin!");

    if (newPass !== confirmPass) return alert("Mật khẩu xác nhận không khớp!");

    if (newPass.length < 8)
      return alert("Mật khẩu mới phải có ít nhất 8 ký tự!");

    // Lấy dữ liệu listusers
    const rawData = localStorage.getItem("listusers");
    if (!rawData) return alert("Lỗi hệ thống!");

    const usersObject = JSON.parse(rawData);
    const user = usersObject[currentUser.id];

    if (!user) return alert("Không tìm thấy tài khoản!");

    if (user.password !== oldPass)
      return alert("Mật khẩu hiện tại không đúng!");

    // Cập nhật mật khẩu mới
    user.password = newPass;
    localStorage.setItem("listusers", JSON.stringify(usersObject));

    alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
    localStorage.removeItem("currentUser");
    window.location.href = "../User_header_footer/login.html";
  });
});
