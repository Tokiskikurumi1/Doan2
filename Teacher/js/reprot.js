const user = JSON.parse(localStorage.getItem("currentUserData"));

// === Nếu chưa đăng nhập HOẶC không phải giáo viên → đá về login ===
if (!user || user.role !== "teacher") {
  alert("Bạn không có quyền truy cập trang này!");
  window.location.href = "../../User_header_footer/login.html";
}

function loadCoursesArray() {
  const raw = JSON.parse(localStorage.getItem("courses")) || [];
  return Array.isArray(raw) ? raw : Object.values(raw);
}

let courses = loadCoursesArray();
const comments = JSON.parse(localStorage.getItem("forum_comments")) || [];
const totalView = JSON.parse(localStorage.getItem("forum_posts")) || [];

// ================= DOM =================
const totalCourse = document.getElementById("totalCourse");
const totalConmments = document.getElementById("totalComments");
const accessForum = document.getElementById("accessForum");
const totalStudent = document.getElementById("totalStudents");
const studying = document.getElementById("studying");
const completed = document.getElementById("completed");
const printE = document.getElementById("print");
// ================= Tổng khóa học =================
const teacherCourses = courses.filter(
  (c) => String(c.teacherId) === String(user.id)
);
totalCourse.textContent = teacherCourses.length;

// ================= Tổng bình luận =================
totalConmments.textContent = comments.length;

// ================= Tổng lượt xem diễn đàn =================
const totalViews = totalView.reduce(
  (sum, post) => sum + (post.viewCount || 0),
  0
);
accessForum.textContent = totalViews;

// ================= ⭐ Tính tổng học viên của giảng viên ⭐ =================
let studentCount = 0;

teacherCourses.forEach((course) => {
  if (Array.isArray(course.students)) {
    studentCount += course.students.length;
  }
});

totalStudent.textContent = studentCount;
studying.textContent = studentCount;
// ================= BIỂU ĐỒ SỐ HỌC VIÊN THEO KHÓA =================
const chartBox = document.getElementById("courseChart");
const courseNameBox = document.getElementById("courseNames");

chartBox.innerHTML = "";
courseNameBox.innerHTML = "";

// Lấy số học viên từng khóa
const courseData = teacherCourses.map((course) => ({
  name: course.name,
  studentCount: Array.isArray(course.students) ? course.students.length : 0,
}));

if (courseData.length === 0) {
  chartBox.innerHTML = "<p>Không có dữ liệu</p>";
} else {
  // Tìm max để scale %
  const maxStudents = Math.max(...courseData.map((c) => c.studentCount)) || 1;

  courseData.forEach((course, index) => {
    const heightPercent = (course.studentCount / maxStudents) * 100;

    // Tạo cột
    const column = document.createElement("div");
    column.className = "chart-serie";
    column.style.setProperty("--i", heightPercent + "%");

    // đổi màu luân phiên
    const colors = [
      "var(--blue-)",
      "var(--green)",
      "var(--orange)",
      "var(--purple)",
    ];
    column.style.setProperty("--color", colors[index % colors.length]);

    column.innerHTML = `
      <h3 class="column-title">${course.studentCount}</h3>
    `;

    chartBox.appendChild(column);

    // Tên khóa học
    const nameSpan = document.createElement("span");
    nameSpan.textContent = course.name;
    courseNameBox.appendChild(nameSpan);
  });
}

// XUẤT BÁO CÁO
printE.addEventListener("click", () => {
  window.print();
});
