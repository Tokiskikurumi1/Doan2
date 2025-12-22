import { CourseManager } from "./object.js";

const assignmentId = localStorage.getItem("doingAssignmentId");
if (!assignmentId) {
    alert("Không tìm thấy bài kiểm tra!");
    window.location.href = "learn.html";
}

const courses = CourseManager.getAll();
let currentAssignment = null;

// Tìm assignment theo ID và loại bỏ bản nháp
for (let cid in courses) {
    const course = courses[cid];
    if (!course.videos) continue;
    course.videos.forEach(video => {
        if (!video.assignments) return;
        video.assignments.forEach(a => {
            if (String(a.id) === String(assignmentId) && a.status !== "draft") {
                currentAssignment = a;
            }
        });
    });
}

if (!currentAssignment) {
    alert("Bài kiểm tra không tồn tại hoặc chưa được phát hành!");
    window.location.href = "learn.html";
}

const questionArea = document.querySelector(".question-area");
const menuContainer = document.getElementById("questionMenu");
let userAnswers = {};
let currentIndex = 0;

// Tạo menu câu hỏi
menuContainer.innerHTML = currentAssignment.questions
    .map((q, i) => `<button class="q-btn" data-id="${i}">${i + 1}</button>`)
    .join("");

const menuButtons = document.querySelectorAll(".q-btn");

// Render toàn bộ câu hỏi
function renderAllQuestions() {
    questionArea.innerHTML = currentAssignment.questions.map((q, index) => {
        const originalText = q.original || q.question || "";
        return `
        <div class="question-box" id="qbox-${index}">
            <h2>Câu ${index + 1}</h2>
            <p><strong>Original:</strong> ${originalText}</p>
            <div class="answers">
                ${currentAssignment.type === "Rewrite"
                    ? `<input type="text" name="q${index}" class="answer-text"
                              placeholder="Nhập câu viết lại..."
                              value="${userAnswers[index] || ""}"/>`
                    : (q.answers || []).map((opt, i) => `
                        <label class="answer-item">
                            <input type="radio" name="q${index}" value="${i}" ${userAnswers[index] == i ? "checked" : ""}>
                            <span>${opt}</span>
                        </label>
                    `).join("")
                }
            </div>
        </div>
        `;
    }).join("");

    // Gắn sự kiện cho input hoặc radio
    currentAssignment.questions.forEach((q, index) => {
        if (currentAssignment.type === "Rewrite") {
            const input = document.querySelector(`input[name="q${index}"]`);
            if (input) {
                input.addEventListener("input", () => {
                    userAnswers[index] = input.value;
                    menuButtons[index].classList.add("answered");
                });
            }
        } else {
            document.querySelectorAll(`input[name="q${index}"]`).forEach(input => {
                input.addEventListener("change", () => {
                    userAnswers[index] = Number(input.value);
                    menuButtons[index].classList.add("answered");
                });
            });
        }
    });
}

renderAllQuestions();

// Sự kiện chuyển câu hỏi
menuButtons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        currentIndex = i;
        menuButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const box = document.getElementById(`qbox-${i}`);
        if (box) box.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

menuButtons[0].classList.add("active");

// Đồng hồ đếm ngược
let timeLeft = (currentAssignment.duration || 20) * 60;
const timeEl = document.getElementById("time");

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

updateTimer();

// Nộp bài
let isSubmitting = false;
function submitQuiz() {
    isSubmitting = true;
    let correct = 0;
    currentAssignment.questions.forEach((q, i) => {
        if (currentAssignment.type === "Rewrite") {
            if (userAnswers[i] && q.rewritten && userAnswers[i].trim() === q.rewritten.trim()) {
                correct++;
            }
        } else {
            if (userAnswers[i] === q.correct) correct++;
        }
    });
    const total = currentAssignment.questions.length;
    const score = Math.round((correct / total) * 100);

    // đổi trạng thái assStatus sang complete
    currentAssignment.assStatus = "complete";
    const courses = CourseManager.getAll();
    for (let cid in courses) {
        const course = courses[cid];
        if (!course.videos) continue;
        course.videos.forEach(video => {
            if (!video.assignments) return;
            video.assignments.forEach(a => {
                if (String(a.id) === String(currentAssignment.id)) {
                    a.assStatus = "complete";
                }
            });
        });
    }
    CourseManager.saveAll(courses);

    //tạo object kết quả 
    const resultObj = {
        score,                  // điểm %
        correct,                // số câu đúng
        total,                  // tổng số câu
        subject: currentAssignment.title || "Bài kiểm tra",
        courseId: currentAssignment.courseId,
        assignmentId: currentAssignment.id,
        date: new Date().toISOString()
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
      alert(`Bạn đã rời khỏi màn hình thi (${leaveCount}/${maxLeave}). Nếu vượt quá ${maxLeave} lần sẽ bị kết thúc.`);
    }
    if (leaveCount > maxLeave) {
      alert("Bạn đã rời khỏi quá nhiều lần. Bài thi sẽ kết thúc!");
      submitQuiz();
    }
  }
});
