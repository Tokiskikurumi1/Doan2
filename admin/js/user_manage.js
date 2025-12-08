const userTableBody = document.getElementById("userTableBody");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");
const addUserBtn = document.getElementById("addUserBtn");
const addUserModal = document.getElementById("addUserModal");

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const roleInput = document.getElementById("roleInput");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const saveUserBtn = document.getElementById("saveUserBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

let editingUserId = null;
let users = []; // mảng user hiện tại
// ======================= CÀI ĐẶT PHÂN TRANG =======================
const itemsPerPage = 10;
let currentPage = 1;
let currentList = []; // Danh sách sau khi lọc

// Lấy dữ liệu từ localStorage (không có thì trả về mảng rỗng)
function getUsersFromLocalStorage() {
  const data = localStorage.getItem("listusers");
  if (!data) return [];

  try {
    const usersObj = JSON.parse(data);
    const usersArray = Object.values(usersObj);

    return usersArray.map((user) => {
      let normalizedRole = user.role || "student";

      // nếu chỗ khác lưu 'Giảng viên' / 'Học viên' thì map lại
      if (normalizedRole.toLowerCase() === "giảng viên")
        normalizedRole = "teacher";
      if (normalizedRole.toLowerCase() === "học viên")
        normalizedRole = "student";

      return {
        id: String(user.id || Date.now()),
        name: user.yourname || user.name || "Chưa đặt tên",
        yourname: user.yourname || user.name || "Chưa đặt tên",
        email: user.email || "",
        role: normalizedRole,
        username: user.username || "",
        password: user.password || "",
        phone: user.phone || "",
        address: user.address || "",
        created: user.created || new Date().toLocaleDateString("vi-VN"),
      };
    });
  } catch (e) {
    console.error("Lỗi đọc dữ liệu người dùng:", e);
    return [];
  }
}

// Lưu lại dưới dạng object { id: user } để đồng bộ với UserManager
function saveUsersToLocalStorage(usersArray) {
  const usersObj = {};
  usersArray.forEach((user) => {
    usersObj[user.id] = user; // id là string → an toàn 100%
  });
  localStorage.setItem("listusers", JSON.stringify(usersObj));
}

// Load dữ liệu khi mở trang
users = getUsersFromLocalStorage();

// Hiển thị danh sách
function displayUsers(list) {
  currentList = list; // cập nhật danh sách đang dùng cho phân trang

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = list.slice(start, end);

  userTableBody.innerHTML = "";

  if (paginated.length === 0) {
    userTableBody.innerHTML = `
      <tr><td colspan="6" style="text-align:center; padding:20px;">Không có dữ liệu</td></tr>`;
    return;
  }

  paginated.forEach((user) => {
    userTableBody.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.yourname || user.name}</td>
        <td>${user.email}</td>
        <td>${user.role === "teacher" ? "Giảng viên" : "Học viên"}</td>
        <td>${user.created}</td>
        <td class="actions">
          <button class="edit" onclick="Edit('${user.id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="delete" onclick="Delete('${user.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>`;
  });

  renderPagination();
}

// Lọc + tìm kiếm
function filterUsers() {
  const search = searchInput.value.toLowerCase();
  const role = roleFilter.value;

  const filtered = users.filter((user) => {
    const matchSearch =
      user.yourname.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search);

    const matchRole = role === "all" || user.role === role;

    return matchSearch && matchRole;
  });

  currentPage = 1; // ✔ reset số trang về 1
  displayUsers(filtered); // ✔ cập nhật danh sách phân trang
}

// Mở modal
function openModal(user = null) {
  addUserModal.style.display = "flex";
  if (user) {
    editingUserId = user.id;
    nameInput.value = user.yourname || user.name || "";
    emailInput.value = user.email;
    usernameInput.value = user.username || "";
    passwordInput.value = ""; // không hiện mật khẩu cũ
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

// Lưu user (thêm hoặc sửa)
function saveUser() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const role = roleInput.value;

  if (!name || !email) {
    alert("Vui lòng nhập Họ tên và Email!");
    return;
  }
  if (!editingUserId && (!username || !password)) {
    alert("Tài khoản mới cần nhập Username và Password!");
    return;
  }

  const userData = {
    id: editingUserId || String(Date.now()),
    yourname: name,
    name: name, // giữ cả 2 để tương thích
    email,
    username: editingUserId
      ? username || users.find((u) => u.id === editingUserId)?.username
      : username,
    password: editingUserId
      ? password || users.find((u) => u.id === editingUserId)?.password
      : password,
    role,
    created: editingUserId
      ? users.find((u) => u.id === editingUserId)?.created
      : new Date().toLocaleDateString("vi-VN"),
    phone: editingUserId
      ? users.find((u) => u.id === editingUserId)?.phone || ""
      : "",
    address: editingUserId
      ? users.find((u) => u.id === editingUserId)?.address || ""
      : "",
  };

  if (editingUserId) {
    const index = users.findIndex((u) => u.id === editingUserId);
    if (index !== -1) users[index] = userData;
  } else {
    users.push(userData);
  }

  saveUsersToLocalStorage(users);
  users = getUsersFromLocalStorage();
  filterUsers();
  addUserModal.style.display = "none";
}

// Sửa
function Edit(id) {
  const user = users.find((u) => u.id === id);
  if (user) openModal(user);
}

// Xóa
function Delete(id) {
  if (confirm("Xóa người dùng này?")) {
    users = users.filter((u) => u.id !== id);
    saveUsersToLocalStorage(users);
    users = getUsersFromLocalStorage();
    filterUsers();
  }
}

// ==================== EVENTS ====================
searchInput.addEventListener("input", filterUsers);
roleFilter.addEventListener("change", filterUsers);
addUserBtn.addEventListener("click", () => openModal());
saveUserBtn.addEventListener("click", saveUser);
closeModalBtn.addEventListener(
  "click",
  () => (addUserModal.style.display = "none")
);
addUserModal.addEventListener("click", (e) => {
  if (e.target === addUserModal) addUserModal.style.display = "none";
});

function renderPagination() {
  const totalItems = currentList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  document.getElementById("totalRecords").textContent = totalItems;

  document.getElementById("pageStart").textContent =
    totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;

  document.getElementById("pageEnd").textContent = Math.min(
    currentPage * itemsPerPage,
    totalItems
  );

  // xử lý nút
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;

  document.getElementById("prevPage").onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      displayUsers(currentList);
    }
  };

  document.getElementById("nextPage").onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayUsers(currentList);
    }
  };

  const pageNumbers = document.getElementById("pageNumbers");
  pageNumbers.innerHTML = `
    <div class="page-number active">${currentPage}</div>
  `;
}

// function addPageButton(page) {
//   const btn = document.createElement("div");
//   btn.className = "page-number" + (page === currentPage ? " active" : "");
//   btn.textContent = page;
//   btn.onclick = () => {
//     currentPage = page;
//     displayPayment(currentList);
//   };
//   document.getElementById("pageNumbers").appendChild(btn);
// }

// document.getElementById("prevPage").onclick = () => {
//   if (currentPage > 1) {
//     currentPage--;
//     displayPayment(currentList);
//   }
// };

// document.getElementById("nextPage").onclick = () => {
//   if (currentPage < Math.ceil(currentList.length / itemsPerPage)) {
//     currentPage++;
//     displayPayment(currentList);
//   }
// };
// Khởi động
displayUsers(users);
