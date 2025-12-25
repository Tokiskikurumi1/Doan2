import { apiClient, UserManager } from "./object.js";

const assignmentId = localStorage.getItem("doingAssignmentId");
if (!assignmentId) {
  alert("Không tìm thấy bài kiểm tra!");
  window.location.href = "learn.html";
}
const currentUser = UserManager.getCurrentUserData();
const courseId = localStorage.getItem("selectedCourseId");
let currentAssignment = null;
let userAnswers = {};
let currentIndex = 0;
let menuButtons;
let timeLeft;
let isSubmitting = false;

const questionArea = document.querySelector(".question-area");
const menuContainer = document.getElementById("questionMenu");
const timeEl = document.getElementById("time");

// Lấy thông tin assignment từ API
(async () => {
  try {
    currentAssignment = await apiClient.request(`/api/student/assignment/${assignmentId}`);
    if (!currentAssignment) {
      alert("Bài kiểm tra không tồn tại!");
      window.location.href = "learn.html";
      return;
    }
    initQuiz();
  } catch (error) {
    console.error("Failed to load assignment:", error);
    alert("Lỗi khi tải bài kiểm tra!");
    window.location.href = "learn.html";
  }
})();

function initQuiz() {
  // Tạo menu câu hỏi
  menuContainer.innerHTML = currentAssignment.questions
    .map((q, i) => `<button class="q-btn" data-id="${i}">${i + 1}</button>`)
    .join("");

  menuButtons = document.querySelectorAll(".q-btn");

  renderAllQuestions();

  menuButtons[0].classList.add("active");

  timeLeft = (currentAssignment.assignmentDuration || 20) * 60;
  updateTimer();

  // Sự kiện chuyển câu hỏi
  menuButtons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      currentIndex = i;
      menuButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const box = document.getElementById(`qbox-${i}`);
      if (box) box.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// Render toàn bộ câu hỏi
function renderAllQuestions() {
  questionArea.innerHTML = currentAssignment.questions
    .map((q, index) => {
      const originalText = q.original || q.content || "";
      const answers = currentAssignment.answers.filter(a => a.questionID === q.questionID).sort((a, b) => a.answerIndex - b.answerIndex);
      return `
        <div class="question-box" id="qbox-${index}">
            <p><strong>Câu ${index + 1}: </strong> ${originalText}</p>
            <div class="answers">
                ${
                  currentAssignment.assignmentType === "Rewrite"
                    ? `<input type="text" name="q${index}" class="answer-text"
                              placeholder="Nhập câu viết lại..."
                              value="${userAnswers[index] || ""}"/>`
                    : answers
                        .map(
                          (opt, i) => `
                        <label class="answer-item">
                            <input type="radio" name="q${index}" value="${i}" ${
                            userAnswers[index] == i ? "checked" : ""
                          }>
                            <span>${opt.answerText}</span>
                        </label>
                    `
                        )
                        .join("")
                }
            </div>
        </div>
        `;
    })
    .join("");

  // Gắn sự kiện cho input hoặc radio
  currentAssignment.questions.forEach((q, index) => {
    if (currentAssignment.assignmentType === "Rewrite") {
      const input = document.querySelector(`input[name="q${index}"]`);
      if (input) {
        input.addEventListener("input", () => {
          userAnswers[index] = input.value;
          menuButtons[index].classList.add("answered");
        });
      }
    } else {
      document.querySelectorAll(`input[name="q${index}"]`).forEach((input) => {
        input.addEventListener("change", () => {
          userAnswers[index] = Number(input.value);
          menuButtons[index].classList.add("answered");
        });
      });
    }
  });
}

// Đồng hồ đếm ngược
function updateTimer() {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  timeEl.textContent = `${m}:${s < 10 ? "0" + s : s}`;
  if (timeLeft <= 0) submitQuiz();
  else {
    timeLeft--;
    setTimeout(updateTimer, 1000);
  }
}

// Nộp bài
async function submitQuiz() {
  isSubmitting = true;
  let correct = 0;
  currentAssignment.questions.forEach((q, i) => {
    if (currentAssignment.assignmentType === "Rewrite") {
      if (
        userAnswers[i] &&
        q.rewritten &&
        userAnswers[i].trim() === q.rewritten.trim()
      ) {
        correct++;
      }
    } else {
      const correctAnswer = currentAssignment.answers.find(a => a.questionID === q.questionID && a.isCorrect)?.answerIndex;
      if (userAnswers[i] === correctAnswer) correct++;
    }
  });
  const total = currentAssignment.questions.length;
  const score = Math.round((correct / total) * 100);

  // Gửi kết quả lên API
  try {
    await apiClient.request('/api/student/score/save', {
      method: 'POST',
      body: JSON.stringify({
        StudentID: currentUser.userID,
        CourseID: courseId,
        AssignmentID: currentAssignment.assignmentID,
        Subject: currentAssignment.assignmentName,
        Correct: correct,
        Total: total,
        Score: score
      })
    });
  } catch (error) {
    console.error("Failed to save score:", error);
  }

  //tạo object kết quả
  const resultObj = {
    score, // điểm %
    correct, // số câu đúng
    total, // tổng số câu
    subject: currentAssignment.assignmentName,
    courseId: courseId,
    assignmentId: currentAssignment.assignmentID,
    date: new Date().toISOString(),
    studentID: currentUser.userID,
  };

  //lưu vào mảng examResults
  const results = JSON.parse(localStorage.getItem("examResults")) || [];
  results.push(resultObj);
  localStorage.setItem("examResults", JSON.stringify(results));

  // cũng lưu lastExamResult để result.html hiển thị ngay
  localStorage.setItem("lastExamResult", JSON.stringify(resultObj));

  window.location.href = "result.html";
}

document.getElementById("submitQuizBtn").addEventListener("click", submitQuiz);

// Toggle menu
const btn = document.getElementById("toggleMenu");
const menu = document.getElementById("questionMenu");

if (btn && menu) {
  btn.addEventListener("click", () => {
    menu.classList.toggle("show");
  });
}

// Theo dõi khi người dùng rời khỏi trang
let leaveCount = 0;
const maxLeave = 3;

document.addEventListener("visibilitychange", () => {
  if (isSubmitting) return; // bỏ qua khi đang nộp
  if (document.hidden) {
    leaveCount++;
    if (leaveCount <= maxLeave) {
      alert(
        `Bạn đã rời khỏi màn hình thi (${leaveCount}/${maxLeave}). Nếu vượt quá ${maxLeave} lần sẽ bị kết thúc.`
      );
    }
    if (leaveCount > maxLeave) {
      alert("Bạn đã rời khỏi quá nhiều lần. Bài thi sẽ kết thúc!");
      submitQuiz();
    }
  }
});
