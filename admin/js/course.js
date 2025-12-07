// ======================= LẤY CÁC ELEMENT =======================
const courseTableBody = document.getElementById("courseTableBody");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");

const modal = document.getElementById("editCourseModal");
const saveBtn = document.getElementById("saveCourseBtn");
const closeBtn = document.getElementById("closeModalBtn");

const nameInput = document.getElementById("nameInput");
const descInput = document.getElementById("descInput");
const roleInput = document.getElementById("roleInput");
const teacherInput = document.getElementById("teacherInput");

// ======================= BIẾN DỮ LIỆU =======================
let courses = JSON.parse(localStorage.getItem("courses") || "[]");
let editingCourseId = null;

// ======================= PHÂN TRANG =======================
const itemsPerPage = 10;
let currentPage = 1;
let currentList = []; // Danh sách sau khi lọc

// ======================= HIỂN THỊ KHÓA HỌC =======================
function displayCourses(list) {
  currentList = list;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = list.slice(start, end);

  courseTableBody.innerHTML = "";

  if (paginated.length === 0) {
    courseTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:40px;">
          Không tìm thấy khóa học nào
        </td>
      </tr>`;
    renderPagination();
    return;
  }

  paginated.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td><strong>${c.name}</strong></td>
      <td>${c.detail}</td>
      <td><span class="badge ${c.type}">${c.type.toUpperCase()}</span></td>
      <td>${c.teacherName}</td>
      <td class="actions">
        <button class="edit-btn" onclick="openEditModal(${c.id})">
          <i class="fas fa-pen"></i>
        </button>
        <button class="delete-btn" onclick="deleteCourse(${c.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    courseTableBody.appendChild(tr);
  });

  renderPagination();
}

// ======================= LỌC + TÌM KIẾM =======================
function filterCourses() {
  const keyword = searchInput.value.toLowerCase().trim();
  const category = roleFilter.value.toUpperCase();

  const filtered = courses.filter((c) => {
    const matchKeyword =
      c.name.toLowerCase().includes(keyword) ||
      c.detail.toLowerCase().includes(keyword) ||
      c.teacherName.toLowerCase().includes(keyword);

    const matchCategory =
      category === "ALL" || c.type.toUpperCase() === category;

    return matchKeyword && matchCategory;
  });

  currentPage = 1;
  displayCourses(filtered);
}

// ======================= PHÂN TRANG =======================
function renderPagination() {
  const totalItems = currentList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  document.getElementById("totalRecords").textContent = totalItems;
  document.getElementById("pageStart").textContent =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  document.getElementById("pageEnd").textContent = Math.min(
    currentPage * itemsPerPage,
    totalItems
  );

  document.getElementById("prevPage").disabled = currentPage <= 1;
  document.getElementById("nextPage").disabled = currentPage >= totalPages;

  document.getElementById("prevPage").onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      displayCourses(currentList);
    }
  };

  document.getElementById("nextPage").onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayCourses(currentList);
    }
  };

  // Hiện số trang hiện tại
  document.getElementById("pageNumbers").innerHTML = `
    <div class="page-number active">${currentPage}</div>
  `;
}

// ======================= MỞ MODAL SỬA =======================
function openEditModal(id) {
  const course = courses.find((c) => c.id === id);
  if (!course) return;

  editingCourseId = id;
  nameInput.value = course.name;
  descInput.value = course.detail;
  roleInput.value = course.type;
  teacherInput.value = course.teacherName;

  modal.classList.add("show");
}

// ======================= LƯU SỬA =======================
saveBtn.onclick = () => {
  if (!editingCourseId) return;

  const index = courses.findIndex((c) => c.id === editingCourseId);
  if (index === -1) return alert("Không tìm thấy khóa học!");

  const course = courses[index];

  courses[index] = {
    ...course,
    name: nameInput.value.trim(),
    detail: descInput.value.trim(),
    type: roleInput.value,
    teacherName: teacherInput.value.trim(),
  };

  localStorage.setItem("courses", JSON.stringify(courses));

  modal.classList.remove("show");
  filterCourses();
};

// ======================= XÓA KHÓA HỌC =======================
function deleteCourse(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa khóa học này?")) return;

  courses = courses.filter((c) => c.id !== id);
  localStorage.setItem("courses", JSON.stringify(courses));

  filterCourses();
}

// ======================= ĐÓNG MODAL =======================
closeBtn.onclick = () => {
  modal.classList.remove("show");
};

window.onclick = (e) => {
  if (e.target === modal) modal.classList.remove("show");
};

// ======================= SỰ KIỆN =======================
searchInput.addEventListener("input", filterCourses);
roleFilter.addEventListener("change", filterCourses);

// ======================= KHỞI TẠO =======================
filterCourses();
