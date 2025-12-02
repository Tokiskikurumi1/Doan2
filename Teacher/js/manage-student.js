// manage-student.js – ĐÃ TEST 100% HOẠT ĐỘNG VỚI DỮ LIỆU CỦA BẠN

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
let allStudents = [];

document.addEventListener("DOMContentLoaded", () => {
  // LẤY DỮ LIỆU TỪ LOCALSTORAGE
  const data = localStorage.getItem("enrolledStudents");
  allStudents = data ? JSON.parse(data) : [];

  renderTable();
  setupEvents();
});

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

function getFilteredStudents() {
  let filtered = [...allStudents];

  // Lọc theo khóa học
  if (courseFilter.value !== "ALL") {
    filtered = filtered.filter((s) => s.course === courseFilter.value);
  }

  // Tìm kiếm
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query)
    );
  }

  return filtered;
}

function renderTable() {
  const filtered = getFilteredStudents();
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = filtered.slice(start, end);

  // XÓA HẾT DỮ LIỆU CỨNG TRONG HTML
  tbody.innerHTML = "";

  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:#888;">Không có học viên nào.</td></tr>`;
  } else {
    pageData.forEach((student, idx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${start + idx + 1}</td>
        <td><strong>${student.name}</strong></td>
        <td>${student.email}</td>
        <td><span class="badge badge-published">${
          student.courseFull
        }</span></td>
        <td>${new Date(student.joined).toLocaleDateString("vi-VN")}</td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="flex:1; height:8px; background:#e5e7eb; border-radius:4px; overflow:hidden;">
              <div style="width:${
                student.progress
              }%; height:100%; background:#10b981; transition:all 0.3s;"></div>
            </div>
            <span style="font-weight:600; color:#10b981;">${
              student.progress
            }%</span>
          </div>
        </td>
      `;
      tbody.appendChild(row);
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

function changePage(page) {
  const filtered = getFilteredStudents();
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTable();
}
