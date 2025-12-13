const user = JSON.parse(localStorage.getItem("currentUserData"));

// === Nếu chưa đăng nhập HOẶC không phải giáo viên → đá về login ===
if (!user || user.role !== "teacher") {
  alert("Bạn không có quyền truy cập trang này!");
  window.location.href = "../../User_header_footer/login.html";
}

const courses = JSON.parse(localStorage.getItem("courses")) || [];
const comments = JSON.parse(localStorage.getItem("forum_comments")) || [];
const totalView = JSON.parse(localStorage.getItem("forum_posts")) || [];

// ================= DOM =================
const totalCourse = document.getElementById("totalCourse");
const totalConmments = document.getElementById("totalComments");
const accessForum = document.getElementById("accessForum");
const totalStudent = document.getElementById("totalStudents");
const studying = document.getElementById("studying");
const completed = document.getElementById("completed");

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
