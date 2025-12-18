import { CourseManager } from "./object.js";
// lây bài kiểm tra hiện tại

const assignmentId = localStorage.getItem("doingAssignmentId");
if (!assignmentId) {
    alert("Không tìm thấy bài kiểm tra!");
    window.location.href = "learn.html";
}

const courses = CourseManager.getAll();
let currentAssignment = null;

// Tìm assignment trong toàn bộ khóa học
for (let cid in courses) {
    const course = courses[cid];
    course.videos.forEach(video => {
        video.assignments.forEach(a => {
            if (String(a.id) === String(assignmentId)) {
                currentAssignment = a;
            }
        });
    });
}

if (!currentAssignment) {
    alert("Bài kiểm tra không tồn tại!");
    window.location.href = "learn.html";
}

// render câu hỏi

const questionArea = document.querySelector(".question-area");
const menuButtons = document.querySelectorAll(".q-btn");

let currentIndex = 0;
let userAnswers = {}; // Lưu đáp án người dùng

function renderQuestion(index) {
    const q = currentAssignment.questions[index];

    questionArea.innerHTML = `
        <div class="question-box">
            <h2>Câu ${index + 1}</h2>
            <p>${q.question}</p>

            <div class="answers">
                ${q.answers.map((opt, i) => `
                    <label class="answer-item">
                        <input type="radio" name="q${index}" value="${i}"
                            ${userAnswers[index] == i ? "checked" : ""}>
                        <span>${opt}</span>
                    </label>
                `).join("")}
            </div>
        </div>
    `;

    // Lưu đáp án khi chọn
    document.querySelectorAll(`input[name="q${index}"]`).forEach(input => {
        input.addEventListener("change", () => {
            userAnswers[index] = Number(input.value);
        });
    });

    // Đổi active menu
    menuButtons.forEach(btn => btn.classList.remove("active"));
    menuButtons[index].classList.add("active");
}

// chuyển câu hỏi = menu

menuButtons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        currentIndex = i;
        renderQuestion(i);
    });
});

// đếm ngược thời gian

let timeLeft = (currentAssignment.duration || 20) * 60; // phút → giây
const timeEl = document.getElementById("time");

function updateTimer() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;

    timeEl.textContent = `${m}:${s < 10 ? "0" + s : s}`;

    if (timeLeft <= 0) {
        submitQuiz();
    } else {
        timeLeft--;
        setTimeout(updateTimer, 1000);
    }
}

updateTimer();

// nộp bài

function submitQuiz() {
    let correct = 0;

    currentAssignment.questions.forEach((q, i) => {
        if (userAnswers[i] === q.correct) correct++;
    });

    const total = currentAssignment.questions.length;

    alert(`Bạn đúng ${correct}/${total} câu`);

    window.location.href = "learn.html";
}

// button toggle menu question

const btn = document.getElementById("toggleMenu");
const menu = document.getElementById("questionMenu");

btn.addEventListener("click", () => {
    menu.classList.toggle("show");
});


document.getElementById("submitQuizBtn").addEventListener("click", () => { submitQuiz(); });
// khởi tạo
renderQuestion(0);
