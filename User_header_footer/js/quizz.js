import { CourseManager } from "./object.js";

const assignmentId = localStorage.getItem("doingAssignmentId");
if (!assignmentId) {
    alert("Không tìm thấy bài kiểm tra!");
    window.location.href = "learn.html";
}

const courses = CourseManager.getAll();
let currentAssignment = null;

for (let cid in courses) {
    const course = courses[cid];
    if (!course.videos) continue;
    course.videos.forEach(video => {
        if (!video.assignments) return;
        video.assignments.forEach(a => {
            if (String(a.id) === String(assignmentId)) currentAssignment = a;
        });
    });
}

if (!currentAssignment) {
    alert("Bài kiểm tra không tồn tại!");
    window.location.href = "learn.html";
}

const questionArea = document.querySelector(".question-area");
const menuContainer = document.getElementById("questionMenu");

let userAnswers = {};
let currentIndex = 0;


menuContainer.innerHTML = currentAssignment.questions
    .map((q, i) => `<button class="q-btn" data-id="${i}">${i + 1}</button>`)
    .join("");

const menuButtons = document.querySelectorAll(".q-btn");


function renderAllQuestions() {
    questionArea.innerHTML = currentAssignment.questions.map((q, index) => `
        <div class="question-box" id="qbox-${index}">
            <h2>Câu ${index + 1}</h2>
            <p>${q.question}</p>

            <div class="answers">
                ${q.answers.map((opt, i) => `
                    <label class="answer-item">
                        <input type="radio" 
                               name="q${index}" 
                               value="${i}"
                               ${userAnswers[index] == i ? "checked" : ""}>
                        <span>${opt}</span>
                    </label>
                `).join("")}
            </div>
        </div>
    `).join("");

    currentAssignment.questions.forEach((q, index) => {
        document.querySelectorAll(`input[name="q${index}"]`).forEach(input => {
            input.addEventListener("change", () => {
                userAnswers[index] = Number(input.value);

                const btn = menuButtons[index];
                btn.classList.add("answered"); 
            });
        });
    });
}

renderAllQuestions();



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


function submitQuiz() {
    let correct = 0;
    currentAssignment.questions.forEach((q, i) => {
        if (userAnswers[i] === q.correct) correct++;
    });
    const total = currentAssignment.questions.length;
    alert(`Bạn đúng ${correct}/${total} câu`);
    window.location.href = "learn.html";
}

document.getElementById("submitQuizBtn").addEventListener("click", submitQuiz);

const btn = document.getElementById("toggleMenu");
const menu = document.getElementById("questionMenu");

if (btn && menu) {
    btn.addEventListener("click", () => {
        menu.classList.toggle("show");
    });
}
