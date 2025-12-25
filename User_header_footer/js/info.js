import { UserManager, apiClient } from "./object.js";

// Helper function to format date for input field (yyyy/mm/dd)
function formatDateForInput(date) {
  if (!date) return "";
  console.log("Raw date from API:", date); // Debug log

  // Handle different date formats from API
  let dateStr;
  if (typeof date === 'string') {
    // Remove time part if present (e.g., "1995-03-10T00:00:00" -> "1995-03-10")
    dateStr = date.split('T')[0];
  } else {
    dateStr = date;
  }

  // If already in yyyy-mm-dd format, convert to yyyy/mm/dd
  if (dateStr && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const parts = dateStr.split('-');
    const formatted = `${parts[0]}/${parts[1]}/${parts[2]}`;
    console.log("Formatted date:", formatted); // Debug log
    return formatted;
  }

  // Fallback to Date parsing
  const d = new Date(dateStr);
  console.log("Parsed date:", d); // Debug log
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const formatted = `${year}/${month}/${day}`;
  console.log("Formatted date:", formatted); // Debug log
  return formatted;
}

document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is logged in (has token)
  if (!localStorage.getItem('token')) {
    alert("Vui lòng đăng nhập trước!");
    window.location.href = "./login.html";
    return;
  }

  await loadUserInfo();
  setupSaveInfo();
  setupChangePassword();

  toggleEditMode(false); // khóa form khi mở trang
});
function getCurrentUser() {
  return UserManager.getCurrentUserData(); // lấy từ currentUserData
}

function saveUser(user) {
  //Cập nhật lại currentUserData
  UserManager.setCurrentUserData(user);
}

async function loadUserInfo() {
  const user = getCurrentUser();
  if (!user) return;

  try {
    // Load profile from database via API
    const profile = await apiClient.getUserProfile(user.userID);
    document.getElementById("infoName").textContent = profile.userName;
    document.getElementById("yourname").value = profile.userName;
    document.getElementById("email").value = profile.email;
    document.getElementById("phone").value = profile.phoneNumber || "";
    document.getElementById("username").value = profile.account || profile.userName; // Use account for login name
    document.getElementById("role").value = profile.roleName || "Student";
    document.getElementById("gender").value = profile.gender || "";
    document.getElementById("dob").value = profile.dateOfBirth ? formatDateForInput(profile.dateOfBirth) : "";
    document.getElementById("district").value = profile.district || "";
    document.getElementById("province").value = profile.province || "";

    // Update local user data with API data
    user.username = profile.account || profile.userName;
    user.role = profile.roleName || "Student";
    user.dob = profile.dateOfBirth ? formatDateForInput(new Date(profile.dateOfBirth)) : "";
    saveUser(user);
  } catch (error) {
    console.error("Failed to load profile from API, using local data", error);
    // Fallback to local data
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
  }


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
  document.getElementById("saveInfoBtn").addEventListener("click", async () => {
    const user = getCurrentUser();
    if (!user) return;

    const dobValue = document.getElementById("dob").value;
    const phoneValue = document.getElementById("phone").value;

    // Validate phone number (must be exactly 10 digits if provided)
    if (phoneValue && (!/^\d{10}$/.test(phoneValue))) {
      alert("Số điện thoại phải có đúng 10 chữ số!");
      return;
    }

    const updatedData = {
      UserID: user.userID,
      UserName: document.getElementById("yourname").value.trim(),
      PhoneNumber: phoneValue || null,
      Gender: document.getElementById("gender").value || null,
      DateOfBirth: dobValue || null,
      District: document.getElementById("district").value.trim() || null,
      Province: document.getElementById("province").value.trim() || null,
      Email: document.getElementById("email").value.trim()
    };

    // Validate required fields
    if (!updatedData.UserName) {
      alert("Họ và tên không được để trống!");
      return;
    }

    if (!updatedData.Email) {
      alert("Email không được để trống!");
      return;
    }

    try {
      await apiClient.updateUserProfile(user.userID, updatedData);
      // Update local data
      user.yourname = updatedData.UserName;
      user.phone = updatedData.PhoneNumber;
      user.gender = updatedData.Gender;
      user.dob = updatedData.DateOfBirth;
      user.district = updatedData.District;
      user.province = updatedData.Province;
      saveUser(user);

      toggleEditMode(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Cập nhật thông tin thất bại. Vui lòng kiểm tra lại dữ liệu và thử lại.");
    }
  });
}



function setupChangePassword() {
  document.getElementById("changePassBtn").addEventListener("click", async () => {
    const user = getCurrentUser();
    if (!user) return;

    const current = document.getElementById("currentPassword").value;
    const newPass = document.getElementById("newPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (!current || !newPass || !confirm) {
      alert("Vui lòng điền đầy đủ thông tin mật khẩu!");
      return;
    }

    if (newPass !== confirm) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    const changePasswordData = {
      account: user.username || user.email,
      oldPassword: current,
      newPassword: newPass
    };

    try {
      await apiClient.changePassword(changePasswordData);
      // Update local data
      user.password = newPass;
      saveUser(user);

      // Clear password fields
      document.getElementById("currentPassword").value = "";
      document.getElementById("newPassword").value = "";
      document.getElementById("confirmPassword").value = "";

      alert("Đổi mật khẩu thành công!");
    } catch (error) {
      console.error("Failed to change password", error);
      alert("Đổi mật khẩu thất bại. Vui lòng kiểm tra mật khẩu hiện tại.");
    }
  });
}


document.getElementById("editInfoBtn").addEventListener("click", () => {
  toggleEditMode(true);
});

document.getElementById("cancelEditBtn").addEventListener("click", async () => {
  await loadUserInfo(); // reset lại dữ liệu
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
