// ======================= LẤY THÔNG TIN GIẢNG VIÊN =======================
const user = JSON.parse(localStorage.getItem("currentUserData"));

// === BẢO VỆ TRANG: Nếu chưa đăng nhập HOẶC không phải giáo viên → đá về login ===
if (!user || user.role !== "teacher") {
  alert("Bạn không có quyền truy cập trang này!");
  window.location.href = "../../User_header_footer/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("manage_homework.js loaded");
  loadAssignments(); // load lần đầu
  setupTabs();
  setupCourseFilter(); // THÊM HÀM NÀY
  updateTabCounts();
});

let allAssignments = [];

// ======================= LOAD ASSIGNMENTS (CÓ LỌC THEO KHÓA HỌC) =======================
function loadAssignments(filterStatus = "all", filterCourse = "all") {
  const grid = document.querySelector(".assignment-grid");
  if (!grid) return;

  grid.innerHTML = "";

  // Lấy tất cả bài tập của giảng viên hiện tại
  const rawAssignments = JSON.parse(
    localStorage.getItem("assignments") || "[]"
  );
  allAssignments = rawAssignments.filter((a) => a.teacherId === user.id);

  // LỌC THEO TRẠNG THÁI + LOẠI KHÓA HỌC
  const filtered = allAssignments.filter((a) => {
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && a.status === "published") ||
      (filterStatus === "draft" && a.status === "draft");

    const matchCourse = filterCourse === "all" || a.course === filterCourse;

    return matchStatus && matchCourse;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <i class="fas fa-search fa-3x" style="color: #cbd5e1; margin-bottom: 1rem;"></i>
        <p style="color: #94a3b8; font-size: 1.1rem;">Không tìm thấy bài tập nào.</p>
      </div>`;
    return;
  }

  filtered.forEach((a) => {
    const card = createAssignmentCard(a);
    grid.appendChild(card);
  });
}

// ======================= TẠO CARD =======================
function createAssignmentCard(a) {
  const card = document.createElement("div");
  card.className = "assignment-card";

  const submitted = 0; // sẽ làm thật sau
  const notSubmitted = 0;
  const total = submitted + notSubmitted;
  const percent = total > 0 ? Math.round((submitted / total) * 100) : 0;

  if (a.status === "published") {
    card.innerHTML = `
      <div class="assignment-card-header">
        <div class="assignment">
          <h3 class="assignment-title">${escapeHtml(a.title)}</h3>
          <span class="badge badge-published">Đã xuất bản</span>
        </div>
        <div class="assignment-meta">
          <span><i class="fas fa-book"></i> ${escapeHtml(
            a.course || "Không xác định"
          )}</span>
          <span><i class="fas fa-calendar"></i> Hạn: ${formatDeadline(
            a.deadline
          )}</span>
        </div>
      </div>
      <div class="assignment-body">
        <div class="stats-grid" style="opacity: 0;">
          <div class="stat-item">
            <div class="stat-value done">${submitted}</div>
            <div class="stat-label">Đã nộp</div>
          </div>
          <div class="stat-item">
            <div class="stat-value done-yet">${notSubmitted}</div>
            <div class="stat-label">Chưa nộp</div>
          </div>
        </div>
        
        <div class="assignment-actions">
          <button class="btn btn-primary btn-sm" onclick="viewDetail('${
            a.id
          }')">Xem chi tiết</button>
          <button class="btn btn-outline btn-sm" onclick="editDraft('${
            a.id
          }')">Chỉnh sửa</button>
          <button class="btn btn-outline btn-sm text-red" onclick="deleteAssignment('${
            a.id
          }')">Xóa</button>
        </div>
      </div>
    `;
  } else {
    card.innerHTML = `
      <div class="assignment-card-header">
        <div class="assignment">
          <h3 class="assignment-title">${escapeHtml(a.title)}</h3>
          <span class="badge badge-draft">Bản nháp</span>
        </div>
        <div class="assignment-meta">
          <span><i class="fas fa-book"></i> ${escapeHtml(
            a.course || "Chưa chọn khóa"
          )}</span>
          <span><i class="fas fa-calendar"></i> Chưa đặt hạn</span>
        </div>
      </div>
      <div class="assignment-body">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">—</div>
            <div class="stat-label">Chưa xuất bản</div>
          </div>
        </div>
        <div class="assignment-actions">
          <button class="btn btn-outline btn-sm" onclick="editDraft('${
            a.id
          }')">Tiếp tục soạn</button>
          <button class="btn btn-outline btn-sm text-red" onclick="deleteAssignment('${
            a.id
          }')">Xóa</button>
        </div>
      </div>
    `;
  }
  return card;
}

// ======================= LỌC THEO LOẠI KHÓA HỌC (MỚI) =======================
function setupCourseFilter() {
  const select = document.getElementById("selectTypeCourse");
  if (!select) return;

  select.addEventListener("change", () => {
    const selectedCourse = select.value;
    const currentStatus = getActiveFilter(); // lấy tab đang active
    loadAssignments(currentStatus, selectedCourse);
  });
}

// ======================= TAB & ĐẾM =======================
function setupTabs() {
  const tabs = document.querySelectorAll(".filter-tabs .tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const text = tab.textContent || "";
      let filterStatus = "all";
      if (text.includes("Đã xuất bản")) filterStatus = "published";
      if (text.includes("Bản nháp")) filterStatus = "draft";

      const currentCourse =
        document.getElementById("selectTypeCourse")?.value || "all";
      loadAssignments(filterStatus, currentCourse); // truyền cả 2 filter
    });
  });
}

function updateTabCounts() {
  const published = allAssignments.filter(
    (a) => a.status === "published"
  ).length;
  const draft = allAssignments.filter((a) => a.status === "draft").length;
  const total = allAssignments.length;

  const tabs = document.querySelectorAll(".filter-tabs .tab");
  if (tabs[0]) tabs[0].textContent = `Tất cả (${total})`;
  if (tabs[1]) tabs[1].textContent = `Đã xuất bản (${published})`;
  if (tabs[2]) tabs[2].textContent = `Bản nháp (${draft})`;
}

function getActiveFilter() {
  const active = document.querySelector(".filter-tabs .tab.active");
  const text = active?.textContent || "";
  if (text.includes("Đã xuất bản")) return "published";
  if (text.includes("Bản nháp")) return "draft";
  return "all";
}

// ======================= CÁC HÀM HỖ TRỢ =======================
function formatDeadline(d) {
  if (!d) return "Chưa đặt hạn";
  const date = new Date(d);
  return isNaN(date) ? "Không hợp lệ" : date.toLocaleDateString("vi-VN");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function deleteAssignment(id) {
  if (!confirm("Xóa bài tập này? Hành động không thể hoàn tác!")) return;

  // 1. Xóa trong assignments[] (global)
  let assignments = JSON.parse(localStorage.getItem("assignments") || "[]");
  assignments = assignments.filter((a) => String(a.id) !== String(id));
  localStorage.setItem("assignments", JSON.stringify(assignments));

  // 2. Xóa bài tập trong từng khóa học → từng video
  const rawCourses = JSON.parse(localStorage.getItem("courses")) || [];
  let courses = Array.isArray(rawCourses)
    ? rawCourses
    : Object.values(rawCourses);

  courses.forEach((course) => {
    course.videos?.forEach((video) => {
      if (video.assignments) {
        video.assignments = video.assignments.filter(
          (a) => String(a.id) !== String(id)
        );
      }
    });
  });

  // Lưu lại changes
  localStorage.setItem("courses", JSON.stringify(courses));

  // 3. Cập nhật UI
  allAssignments = allAssignments.filter((a) => String(a.id) !== String(id));

  updateTabCounts();
  loadAssignments(
    getActiveFilter(),
    document.getElementById("selectTypeCourse")?.value || "all"
  );

  alert("Đã xóa bài tập!");
}

function editDraft(id) {
  localStorage.setItem("editingAssignmentId", id);
  window.location.href = "./create-homework.html";
}

function viewDetail(id) {
  localStorage.setItem("detailAssignmentId", id);
  window.location.href = "./detail-homework.html";
}

// TẠO MỚI
document
  .getElementById("create-new-homework")
  ?.addEventListener("click", () => {
    localStorage.removeItem("editingAssignmentId");
    window.location.href = "./create-homework.html";
  });
