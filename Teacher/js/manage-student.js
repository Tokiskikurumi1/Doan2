// ======================= LẤY USER HIỆN TẠI =======================
const currentUser = JSON.parse(localStorage.getItem("currentUserData"));
if (!currentUser || currentUser.role !== "teacher") {
  alert("Bạn không có quyền truy cập!");
  window.location.href = "../../User_header_footer/login.html";
}

// ======================= DOM ELEMENTS =======================
const tbody = document.querySelector(".student-table tbody");
const searchInput = document.querySelector(".search-bar");
const courseFilter = document.getElementById("courseType");
const paginationInfo = document.querySelector(".pagination p");
const prevBtn = document.querySelector(
  ".pagination button.btn-outline:first-of-type"
);
const nextBtn = document.querySelector(
  ".pagination button.btn-outline:last-of-type"
);
const pageNumBtn = document.querySelector(".pagination .btn-primary");

let currentPage = 1;
const itemsPerPage = 10;

let allStudents = []; // danh sách học viên đã ánh xạ

// ===============================================================
//  HÀM ÁNH XẠ STUDENT
// ===============================================================
function mapStudentsWithUserData(course) {
  const listUsers = JSON.parse(localStorage.getItem("listusers")) || {};

  return course.students.map((s) => {
    const fullUser = listUsers[s.id] || {};

    return {
      id: s.id,
      name: fullUser.yourname || fullUser.name || s.name,
      email: fullUser.email || "Không có email",
      username: fullUser.username || "",
      phone: fullUser.phone || "",
      joined: s.date,
      course: course.type,
      courseFull: course.name,
      progress: s.progress || 0, // sau này có thể cập nhật thêm
    };
  });
}

// ===============================================================
//  LOAD DỮ LIỆU HỌC VIÊN CHỈ THEO GIẢNG VIÊN HIỆN TẠI
// ===============================================================
function loadStudentData() {
  const courses = JSON.parse(localStorage.getItem("courses")) || [];

  // Lọc khóa học của giáo viên
  const teacherCourses = courses.filter((c) => c.teacherId === currentUser.id);

  let result = [];

  teacherCourses.forEach((course) => {
    const mappedStudents = mapStudentsWithUserData(course);
    result = result.concat(mappedStudents);
  });

  allStudents = result;

  console.log("Danh sách học viên ánh xạ:", allStudents);
}

// ===============================================================
// LỌC HỌC VIÊN THEO SEARCH + FILTER
// ===============================================================
function getFilteredStudents() {
  let filtered = [...allStudents];

  // Lọc theo khóa học
  if (courseFilter.value !== "ALL") {
    filtered = filtered.filter((s) => s.course === courseFilter.value);
  }

  // Tìm kiếm theo tên / email
  const query = searchInput.value.toLowerCase().trim();
  if (query) {
    filtered = filtered.filter(
      (s) =>
        s.course === courseFilter.value || s.courseFull === courseFilter.value
    );
  }

  return filtered;
}

// ===============================================================
//  HIỂN THỊ BẢNG
// ===============================================================
function renderTable() {
  const filtered = getFilteredStudents();

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = filtered.slice(start, end);

  tbody.innerHTML = "";

  if (pageData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:2rem; color:#888;">
          Không có học viên nào.
        </td>
      </tr>`;
  } else {
    pageData.forEach((s, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${start + index + 1}</td>
        <td><strong>${s.name}</strong></td>
        <td>${s.email}</td>
        <td><span class="badge badge-published">${s.courseFull}</span></td>
        <td>${new Date(s.joined).toLocaleDateString("vi-VN")}</td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="flex:1; height:8px; background:#e5e7eb; border-radius:4px;">
              <div style="width:${
                s.progress
              }%; height:100%; background:#10b981;"></div>
            </div>
            <span style="font-weight:600; color:#10b981;">${s.progress}%</span>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  // Cập nhật phân trang
  paginationInfo.textContent = `Hiển thị ${
    totalItems === 0 ? 0 : start + 1
  }-${Math.min(end, totalItems)} của ${totalItems} học viên`;

  pageNumBtn.textContent = currentPage;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage >= totalPages;
}

// ===============================================================
// PHÂN TRANG
// ===============================================================
function changePage(newPage) {
  const totalPages = Math.ceil(getFilteredStudents().length / itemsPerPage);
  if (newPage < 1 || newPage > totalPages) return;

  currentPage = newPage;
  renderTable();
}

// ===============================================================
//  SETUP EVENT
// ===============================================================
function setupEvents() {
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderTable();
  });

  courseFilter.addEventListener("change", () => {
    currentPage = 1;
    renderTable();
  });

  prevBtn.addEventListener("click", () => changePage(currentPage - 1));
  nextBtn.addEventListener("click", () => changePage(currentPage + 1));
}

// ===============================================================
// 🔥 KHỞI ĐỘNG
// ===============================================================
document.addEventListener("DOMContentLoaded", () => {
  loadStudentData();
  renderTable();
  setupEvents();
});
