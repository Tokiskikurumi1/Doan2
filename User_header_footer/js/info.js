// load dữ liệu khi trang được tải

document.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  setupAvatarUpload();
  setupSaveInfo();
  setupChangePassword();

  // Khóa form ngay khi mở trang
  toggleEditMode(false);
});

function getCurrentUser() {
  const id = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("listusers")) || {};
  return users[id] || null;
}

function saveUser(user) {
  const users = JSON.parse(localStorage.getItem("listusers")) || {};
  users[user.id] = user;
  localStorage.setItem("listusers", JSON.stringify(users));
}

function loadUserInfo() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById("infoName").textContent = user.yourname;
  document.getElementById("yourname").value = user.yourname;
  document.getElementById("email").value = user.email;
  document.getElementById("phone").value = user.phone || "";
  document.getElementById("username").value = user.username;
  document.getElementById("role").value = user.role;
  document.getElementById("gender").value = user.gender || "";
  document.getElementById("dob").value = user.dob || "";
  document.getElementById("district").value = user.district || "";
  document.getElementById("province").value = user.province || "";

  document.getElementById("avatarPreview").src =
    user.avatar || "./img/img_GUI/user.png";
}

// upload avatar

function setupAvatarUpload() {
  const input = document.getElementById("avatarInput");
  const preview = document.getElementById("avatarPreview");

  input.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;

      const user = getCurrentUser();
      user.avatar = e.target.result;
      saveUser(user);
    };
    reader.readAsDataURL(file);
  });
}

// lưu thông tin

function setupSaveInfo() {
  document.getElementById("saveInfoBtn").addEventListener("click", () => {
    const user = getCurrentUser();
    if (!user) return;

    user.yourname = document.getElementById("yourname").value;
    user.phone = document.getElementById("phone").value;
    user.gender = document.getElementById("gender").value;
    user.dob = document.getElementById("dob").value;
    user.district = document.getElementById("district").value;
    user.province = document.getElementById("province").value;

    saveUser(user);

    // Sau khi lưu → khóa lại form
    toggleEditMode(false);

    alert("Cập nhật thông tin thành công!");
  });
}

// đổi mât khẩu

function setupChangePassword() {
  document.getElementById("changePassBtn").addEventListener("click", () => {
    const user = getCurrentUser();
    if (!user) return;

    const current = document.getElementById("currentPassword").value;
    const newPass = document.getElementById("newPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (current !== user.password) {
      alert("Mật khẩu hiện tại không đúng!");
      return;
    }

    if (newPass !== confirm) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    if (newPass.length < 8) {
      alert("Mật khẩu mới phải ít nhất 8 ký tự!");
      return;
    }

    user.password = newPass;
    saveUser(user);

    alert("Đổi mật khẩu thành công!");
  });
}

// sửa tt

document.getElementById("editInfoBtn").addEventListener("click", () => {
  toggleEditMode(true);
});

document.getElementById("cancelEditBtn").addEventListener("click", () => {
  loadUserInfo(); //  reset lại dữ liệu gốc
  toggleEditMode(false);
});

function toggleEditMode(enable) {
  const editableFields = [
    "yourname",
    "phone",
    "gender",
    "dob",
    "district",
    "province",
  ];

  editableFields.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.disabled = !enable;
  });

  // Chỉ hiện nút phù hợp
  document.getElementById("editButtons").style.display = enable ? "none" : "flex";
  document.getElementById("saveButtons").style.display = enable ? "flex" : "none";
}
