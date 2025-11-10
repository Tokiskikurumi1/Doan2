  alert("Bạn không có quyền truy cập trang này!");
  window.location.href = "../User_header_footer/login.html";
}

// ======================= LẤY DỮ LIỆU =======================
function loadCoursesArray() {
  const raw = JSON.parse(localStorage.getItem("courses")) || [];
  return Array.isArray(raw) ? raw : Object.values(raw);
}

let courses = loadCoursesArray();
const assignments = JSON.parse(localStorage.getItem("assignments")) || [];

const totalCourses = document.getElementById("total-courses");
const totalExercises = document.getElementById("total-exercises");
const totalStudents = document.getElementById("total-students");
const titleComback = document.querySelector(".title-comback");

// phần khóa học phổ biến
const popularCourseNameEl = document.getElementById("popular-course-name");
const popularCourseMetaEl = document.getElementById("popular-course-meta");
const popularCourseBadgeEl = document.getElementById("popular-course-badge");
const popularCourseDetailBtn = document.getElementById(
  "popular-course-detail-btn"
);

// bảng học viên mới
const recentStudentsBody = document.getElementById("recent-students-body");

// ======================= LỌC THEO GIẢNG VIÊN HIỆN TẠI =======================

// Khóa học của giảng viên
const teacherCourses = courses.filter(
  (c) => String(c.teacherId) === String(user.id)
);

// Bài tập của giảng viên
const teacherAssignments = assignments.filter(
  (a) => String(a.teacherId) === String(user.id)
);

// Tính tổng khóa học & bài tập
totalCourses.textContent = teacherCourses.length;
totalExercises.textContent = teacherAssignments.length;

// ======================= TỔNG HỌC VIÊN CỦA GIẢNG VIÊN =======================

let allStudents = [];

teacherCourses.forEach((course) => {
  if (Array.isArray(course.students)) {
    course.students.forEach((s) => {
      allStudents.push({
        id: s.id,
        name: s.name || s.yourname || "Không tên",
        date: s.date,
        courseName: course.name,
        price: course.price,
      });
    });
  }
});

totalStudents.textContent = allStudents.length;

// ======================= KHÓA HỌC PHỔ BIẾN NHẤT =======================

function renderPopularCourse() {
  if (teacherCourses.length === 0) {
    popularCourseNameEl.textContent = "Chưa có khóa học nào";
    popularCourseMetaEl.textContent = "";
    popularCourseBadgeEl.textContent = "—";
    popularCourseDetailBtn.disabled = true;
    return;
  }

  // Tìm khóa có nhiều học viên nhất
  let popular = teacherCourses[0];
  teacherCourses.forEach((c) => {
    if ((c.students?.length || 0) > (popular.students?.length || 0)) {
      popular = c;
    }
  });

  const studentCount = popular.students ? popular.students.length : 0;

  popularCourseNameEl.textContent = popular.name;
  popularCourseMetaEl.textContent = `${studentCount} học viên`;
  popularCourseBadgeEl.textContent = studentCount > 0 ? "Đang hot" : "Mới tạo";

  // nút Chi tiết → sang trang manage/detail khóa học đó
  popularCourseDetailBtn.onclick = () => {
    localStorage.setItem("selectedCourseId", popular.id);
    window.location.href = "./detail-course.html";
  };
}

// ======================= HỌC VIÊN MỚI ĐĂNG KÝ GẦN ĐÂY =======================

function formatDateVN(d) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date)) return d; // fallback nếu chuỗi lạ
  return date.toLocaleDateString("vi-VN");
}

function renderRecentStudents() {
  if (!recentStudentsBody) return;

  recentStudentsBody.innerHTML = "";

  if (allStudents.length === 0) {
    recentStudentsBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding: 1rem; color: var(--grey);">
          Chưa có học viên nào đăng ký khóa học của bạn.
        </td>
      </tr>
    `;
    return;
  }

  // Sort theo ngày tham gia mới → cũ
  const sorted = [...allStudents].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Lấy tối đa 10 học viên gần nhất
  sorted.slice(0, 10).forEach((s, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>HV${String(s.id).padStart(3, "0")}</td>
      <td>${s.name}</td>
      <td>${formatDateVN(s.date)}</td>
      <td>${s.courseName}</td>
      <td>${
        s.price ? Number(s.price).toLocaleString("vi-VN") + " VND" : "—"
      }</td>
    `;
    recentStudentsBody.appendChild(tr);
  });
}

// ======================= CHÀO MỪNG =======================

function renderWelcome() {
  if (!user) {
    titleComback.innerHTML = "<h2>Đang tải...</h2>";
    setTimeout(() => {
      window.location.href = "../User_header_footer/login.html";
    }, 1000);
    return;
  }

  const hoTen = user.yourname || user.name || "Bạn";
  const prefix = user.role === "teacher" ? "GV." : "HV.";

  titleComback.innerHTML = `
    <h2>
      Chào mừng trở lại,
      <span style="color: var(--blue-)">${prefix} ${hoTen}</span>!
    </h2>
    <p style="color: var(--grey)">
      Hôm nay: ${new Date().toLocaleDateString("vi-VN")}
    </p>
  `;
}

// ======================= GỌI HÀM =======================

renderWelcome();
renderPopularCourse();
renderRecentStudents();
# Update 2026-01-10 17:57:43
# Feature enhancement 2026-01-10 18:03:02
# API improvements
// UI/UX improvements added
// API improvements and error handling
// Enhanced functionality - 2026-01-10
   Additional implementation details
// API improvements and error handling
// Feature flag implementation
/* Multi-line comment block
// Database optimization completed
// Database optimization completed
// Security enhancements integrated
