let assignments = JSON.parse(localStorage.getItem("assignments")) || [];
const assignmentID = localStorage.getItem("detailAssignmentId");

const examResults = JSON.parse(localStorage.getItem("examResults")) || [];
const users = JSON.parse(localStorage.getItem("listusers")) || {};

const assignment = assignments.find(
  (c) => String(c.id) === String(assignmentID)
);

if (!assignment) {
  alert("Không tìm thấy bài tập!");
  window.location.href = "Teacher/manage-homework.html";
}

// ==================================================== ELEMENTS ====================================================
const nameAssignment = document.getElementById("nameAss");
const nameCourse = document.getElementById("nameCourse");
const deadLine = document.getElementById("deadLine");
const timeWork = document.getElementById("timeWork");
const type = document.getElementById("type");
const description = document.getElementById("description");

// ========================== HIỂN THỊ ==========================
nameAssignment.innerHTML = assignment.title;
nameCourse.innerHTML = assignment.course;
deadLine.innerHTML = assignment.deadline;
timeWork.innerHTML = assignment.duration;
type.innerHTML = assignment.type;
description.innerHTML = assignment.description;

const assignmentResults = examResults.filter(
  (r) => String(r.assignmentId) === String(assignmentID)
);

// Sắp xếp: nộp gần nhất lên đầu
assignmentResults.sort((a, b) => new Date(b.date) - new Date(a.date));

// ========================== RENDER ==========================
const tbody = document.getElementById("submissionBody");
tbody.innerHTML = "";

if (assignmentResults.length === 0) {
  tbody.innerHTML = `
    <tr>
      <td colspan="5" style="text-align:center;">
        Chưa có học viên nộp bài
      </td>
    </tr>
  `;
}

assignmentResults.forEach((result, index) => {
  const user = users[result.studentID];

  const studentName = user ? user.yourname : "Không xác định";
  const score = result.score;

  const isPass = score >= 50;
  const status = isPass ? "Đạt" : "Không đạt";
  const scoreColor = isPass ? "var(--green)" : "red";

  const submitTime = new Date(result.date).toLocaleString("vi-VN");

  tbody.innerHTML += `
    <tr>
      <td>${index + 1}</td>
      <td><strong>${studentName}</strong></td>
      <td>${submitTime}</td>
      <td>
        <strong style="color:${scoreColor}">
          ${score}
        </strong>
      </td>
      <td style="color:${scoreColor}">
        ${status}
      </td>
    </tr>
  `;
});
