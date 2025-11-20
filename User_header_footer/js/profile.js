import { UserManager, CourseManager } from "./object.js";

// Lấy user hiện tại
const currentUser = UserManager.getCurrentUserData();
if (!currentUser) {
  document.querySelector(".learning-profile").innerHTML =
    "<p>Bạn cần đăng nhập để xem thông tin.</p>";
  throw new Error("User not logged in");
}

// Lấy danh sách khóa học đã đăng ký
const courses = Object.values(CourseManager.getAll()) || [];
const myCourses = courses.filter(
  c => Array.isArray(c.students) && c.students.some(s => s.id === currentUser.id)
);

// Hàm tính tiến độ và trạng thái
function getCourseProgress(course) {
  let total = 0;
  let done = 0;
  course.videos?.forEach(video => {
    video.assignments?.forEach(a => {
      total++;
      if (a.assStatus === "complete") done++;
    });
  });
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const status = percent === 100 ? "Hoàn thành" : "Đang học";
  return { percent, done, total, status };
}

// Lấy điểm thi từ localStorage
const results = JSON.parse(localStorage.getItem("examResults")) || [];

// Tính điểm trung bình theo courseId
function getAverageScore(courseId) {
  const courseResults = results.filter(r => r.courseId === courseId);
  if (courseResults.length === 0) return null;
  const sum = courseResults.reduce((acc, r) => acc + r.score, 0);
  return (sum / courseResults.length).toFixed(1);
}

// RENDER PHẦN KHÓA HỌC ĐÃ ĐĂNG KÝ
const sectionCourses = document.querySelectorAll(".section")[0];
if (sectionCourses) {
  sectionCourses.innerHTML = "<h3>Các khóa học đã đăng ký</h3>";
}

if (sectionCourses) {
  myCourses.forEach(course => {
    const { percent, done, total, status } = getCourseProgress(course);
    const card = document.createElement("div");
    card.className = "course-card";
    card.innerHTML = `
      <h4>${course.name}</h4>
      <p>Tiến độ: ${percent}% (${done}/${total} bài tập)</p>
      <div class="progress-bar">
        <div class="progress" style="width:${percent}%"></div>
      </div>
      <p>Giảng viên: ${course.teacherName}</p>
      <p>Trạng thái: <strong>${status}</strong></p>
    `;
    sectionCourses.appendChild(card);
  });
}

// RENDER PHẦN ĐIỂM SỐ
const scoreTable = document.querySelector(".score-table");
if (scoreTable) {
  scoreTable.innerHTML = `
    <tr>
      <th>Khóa học</th>
      <th>Trạng thái</th>
      <th>Bài tập đã làm</th>
      <th>Điểm trung bình (thang 100)</th>
    </tr>
  `;
}

myCourses.forEach(course => {
  const { status, done, total } = getCourseProgress(course);
  const avgScore = getAverageScore(course.id);
  scoreTable.innerHTML += `
    <tr>
      <td>${course.name}</td>
      <td>${status}</td>
      <td>${done}/${total}</td>
      <td>${avgScore ? avgScore : "-"}</td>
    </tr>
  `;
});

// RENDER LỊCH SỬ ĐIỂM
const submissionBody = document.getElementById("submissionBody");
if (submissionBody) {
  submissionBody.innerHTML = ""; // clear cũ
  results.forEach((r, index) => {
    // tìm tên khóa học từ courseId
    const course = courses.find(c => c.id === r.courseId);
    const courseName = course ? course.name : "N/A";

    // format thời gian
    const date = new Date(r.date);
    const formattedDate = date.toLocaleString("vi-VN");

    submissionBody.innerHTML += `
      <tr>
        <td>${String(index + 1).padStart(2, "0")}</td>
        <td>${r.subject}</td>
        <td>${formattedDate}</td>
        <td><strong style="color:${r.score >= 50 ? "var(--green)" : "var(--orange)"}">${r.score}</strong></td>
      </tr>
    `;
  });
}
# Code optimization and refactoring
# UI/UX improvements
# Code optimization and refactoring
# Bug fixes and improvements
