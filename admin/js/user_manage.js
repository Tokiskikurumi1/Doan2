const userTableBody = document.getElementById("userTableBody");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");
const addUserBtn = document.getElementById("addUserBtn");
const addUserModal = document.getElementById("addUserModal");

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const roleInput = document.getElementById("roleInput");
const statusInput = document.getElementById("statusInput");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const saveUserBtn = document.getElementById("saveUserBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

let editingUserId = null;

// Hàm lấy dữ liệu từ localStorage
function getUsersFromLocalStorage() {
  const data = localStorage.getItem("users");
  if (data) {
    const users = JSON.parse(data);

    // Lưu lại để lần sau không cần thêm nữa
    saveUsersToLocalStorage(users);
    return users;
  } else {
    // Dữ liệu mẫu lần đầu chạy
    const defaultUsers = [
      {
        id: 1,
        name: "Nguyễn Văn A",
        email: "a@gmail.com",
        role: "teacher",
        phone: "0901234567",
        address: "Quận 1, TP.HCM",
        created: "2024-10-01",
        username: "admin",
        password: "123456",
      },
      {
        id: 2,
        name: "Trần Thị B",
        email: "b@gmail.com",
        username: "student1",
        password: "123456",
        role: "student",
        phone: "",
        address: "",
        created: "2024-10-03",
      },
      {
        id: 3,
        name: "Lê Văn C",
        email: "c@gmail.com",
        username: "student2",
        password: "123456",
        role: "student",
        phone: "",
        address: "",
        created: "2024-10-05",
      },
    ];
    saveUsersToLocalStorage(defaultUsers);
    return defaultUsers;
  }
}

// Hàm lưu mảng users vào localStorage
function saveUsersToLocalStorage(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Load dữ liệu từ localStorage khi trang tải
let users = getUsersFromLocalStorage();

// Hàm hiển thị danh sách người dùng
function displayUsers(usersToDisplay) {
  userTableBody.innerHTML = "";
  usersToDisplay.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role === "teacher" ? "Giáo viên" : "Học sinh"}</td>
      <td>${user.created}</td>
      <td class="actions">
        <button class="edit" onclick="Edit(${user.id})">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="delete" onclick="Delete(${user.id})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    userTableBody.appendChild(row);
  });
}

// Hàm lọc người dùng
function filterUsers() {
  const searchText = searchInput.value.toLowerCase();
  const selectedRole = roleFilter.value;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText) ||
      (user.username && user.username.toLowerCase().includes(searchText));

    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  displayUsers(filteredUsers);
}

// Mở modal thêm/sửa
function openModal(user = null) {
  addUserModal.style.display = "flex";
  if (user) {
    editingUserId = user.id;
    nameInput.value = user.name;
    emailInput.value = user.email;
    usernameInput.value = user.username || "";
    passwordInput.value = user.password || "";
    roleInput.value = user.role;
  } else {
    editingUserId = null;
    nameInput.value = "";
    emailInput.value = "";
    usernameInput.value = "";
    passwordInput.value = "";
    roleInput.value = "student";
  }
}

// Lưu người dùng (thêm mới hoặc cập nhật)
function saveUser() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!name || !email) {
    alert("Vui lòng nhập đầy đủ Họ tên và Email!");
    return;
  }

  if (!editingUserId && (!username || !password)) {
    alert("Vui lòng nhập Tên đăng nhập và Mật khẩu cho tài khoản mới!");
    return;
  }

  const newUserData = {
    id: editingUserId || Date.now(),
    name,
    email,
    username: editingUserId
      ? username || users.find((u) => u.id === editingUserId).username
      : username,
    password: editingUserId
      ? password || users.find((u) => u.id === editingUserId).password
      : password,
    role: roleInput.value,
    created: editingUserId
      ? users.find((u) => u.id === editingUserId).created
      : new Date().toLocaleDateString("vi-VN"),

    // Giữ nguyên phone và address nếu đang sửa (không bị mất)
    phone: editingUserId ? users.find((u) => u.id === editingUserId).phone : "",
    district: editingUserId
      ? users.find((u) => u.id === editingUserId).district
      : "",
    province: editingUserId
      ? users.find((u) => u.id === editingUserId).province
      : "",
  };

  if (editingUserId) {
    // Cập nhật user cũ
    const index = users.findIndex((u) => u.id === editingUserId);
    users[index] = { ...users[index], ...newUserData };
  } else {
    // Thêm user mới
    users.push(newUserData);
  }

  // Lưu vào localStorage
  saveUsersToLocalStorage(users);

  // Cập nhật lại giao diện
  filterUsers();
  addUserModal.style.display = "none";
}

// Sửa người dùng
function Edit(id) {
  const user = users.find((u) => u.id === id);
  if (user) openModal(user);
}

// Xóa người dùng
function Delete(id) {
  if (confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
    users = users.filter((u) => u.id !== id);
    saveUsersToLocalStorage(users);
    filterUsers();
  }
}

// ==================== Sự kiện ====================
searchInput.addEventListener("input", filterUsers);
roleFilter.addEventListener("change", filterUsers);
addUserBtn.addEventListener("click", () => openModal());
saveUserBtn.addEventListener("click", saveUser);
closeModalBtn.addEventListener("click", () => {
  addUserModal.style.display = "none";
});

// Click ngoài modal để đóng
addUserModal.addEventListener("click", (e) => {
  if (e.target === addUserModal) {
    addUserModal.style.display = "none";
  }
});

// Hiển thị danh sách ban đầu
displayUsers(users);
