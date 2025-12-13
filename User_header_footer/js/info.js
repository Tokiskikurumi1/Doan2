import { UserManager } from "./object.js";

document.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  setupAvatarUpload();
  setupSaveInfo();
  setupChangePassword();

  toggleEditMode(false); // khóa form khi mở trang
});
function getCurrentUser() {
  return UserManager.getCurrentUserData(); // lấy từ currentUserData
}

function saveUser(user) {
  //Lưu vào listusers
  const users = UserManager.getAllUsers();
  users[user.id] = user;
  UserManager.saveAllUsers(users);

  //Cập nhật lại currentUserData
  UserManager.setCurrentUserData(user);
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

      saveUser(user); // lưu cả listusers + currentUserData
    };
    reader.readAsDataURL(file);
  });
}


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

    toggleEditMode(false);
    alert("Cập nhật thông tin thành công!");
  });
}



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


document.getElementById("editInfoBtn").addEventListener("click", () => {
  toggleEditMode(true);
});

document.getElementById("cancelEditBtn").addEventListener("click", () => {
  loadUserInfo(); // reset lại dữ liệu
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

  document.getElementById("editButtons").style.display = enable ? "none" : "flex";
  document.getElementById("saveButtons").style.display = enable ? "flex" : "none";
}
