// create-homework.js
let questionIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  console.log("create-homework.js loaded");

  const editingId = localStorage.getItem("editingAssignmentId");

  // NẾU KHÔNG CÓ ID → RESET HOÀN TOÀN + TẠO CÂU HỎI MỚI
  if (!editingId) {
    resetForm();
    addQuestion(); // Tạo câu hỏi mặc định
  } else {
    loadDraft(editingId);
  }

  document.querySelector(".quizForm").addEventListener("submit", handleSubmit);
});

function addQuestion() {
  questionIndex++;
  const container = document.getElementById("questions-container");
  const qDiv = document.createElement("div");
  qDiv.className = "question-builder";
  qDiv.innerHTML = getQuestionHTML(questionIndex);
  container.appendChild(qDiv);
}

function getQuestionHTML(qIdx) {
  return `
    <div class="question-header">
      <div class="question-title">Câu hỏi ${qIdx}</div>
      <button type="button" class="btn-remove" onclick="removeQuestion(this)">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="form-group">
      <label class="form-label">Nội dung câu hỏi *</label>
      <textarea class="form-textarea question-content" placeholder="VD: Câu nào đúng về thì hiện tại đơn?" required></textarea>
    </div>
    <div class="answer-list">
      ${generateAnswerHTML(0, qIdx)}
      ${generateAnswerHTML(1, qIdx)}
      ${generateAnswerHTML(2, qIdx)}
      ${generateAnswerHTML(3, qIdx)}
    </div>
    <button type="button" class="btn-add-answer" onclick="addAnswer(this, ${qIdx})">
      <i class="fas fa-plus"></i> Thêm đáp án
    </button>
  `;
}

function generateAnswerHTML(idx, qIdx) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  return `
    <div class="answer-option">
      <input type="radio" name="correct-${qIdx}" value="${idx}" ${
    idx === 0 ? "required" : ""
  }>
      <input type="text" class="answer-input" placeholder="Đáp án ${
        letters[idx]
      }" required>
      ${
        idx >= 4
          ? `<button type="button" class="btn-remove" onclick="removeAnswer(this)"><i class="fas fa-times"></i></button>`
          : ""
      }
    </div>
  `;
}

function addAnswer(button, qIdx) {
  const list = button.previousElementSibling;
  if (list.children.length >= 6) {
    alert("Tối đa 6 đáp án!");
    return;
  }
  const idx = list.children.length;
  list.insertAdjacentHTML("beforeend", generateAnswerHTML(idx, qIdx));
}

function removeAnswer(btn) {
  const option = btn.closest(".answer-option");
  const list = option.parentElement;
  option.remove();
  updateAnswerIndices(list);
}

function updateAnswerIndices(list) {
  const options = list.querySelectorAll(".answer-option");
  const letters = ["A", "B", "C", "D", "E", "F"];
  options.forEach((opt, i) => {
    opt.querySelector('input[type="radio"]').value = i;
    opt.querySelector(".answer-input").placeholder = `Đáp án ${letters[i]}`;
    const removeBtn = opt.querySelector(".btn-remove");
    if (removeBtn) removeBtn.outerHTML = i >= 4 ? removeBtn.outerHTML : "";
  });
}

function removeQuestion(btn) {
  btn.closest(".question-builder").remove();
  updateQuestionNumbers();
}

function updateQuestionNumbers() {
  const questions = document.querySelectorAll(".question-builder");
  questions.forEach((q, i) => {
    q.querySelector(".question-title").textContent = `Câu hỏi ${i + 1}`;
    q.querySelectorAll('input[type="radio"]').forEach((r) => {
      r.name = `correct-${i + 1}`;
    });
  });
  questionIndex = questions.length;
}

function handleSubmit(e) {
  e.preventDefault();

  const questions = document.querySelectorAll(".question-builder");
  if (questions.length === 0) return alert("Vui lòng thêm ít nhất 1 câu hỏi!");

  for (let q of questions) {
    if (!q.querySelector('input[type="radio"]:checked')) {
      return alert("Vui lòng chọn đáp án đúng cho mỗi câu hỏi!");
    }
  }

  const editingId = localStorage.getItem("editingAssignmentId");

  const assignment = {
    id: editingId || Date.now().toString(),
    title: document.getElementById("homework-title").value.trim(),
    course: document.getElementById("course-select").value,
    deadline: document.getElementById("deadline-input").value,
    description: document.querySelector(".form-textarea").value.trim(),
    status: document.getElementById("status-select").value,
    createdAt: new Date().toISOString(),
    questions: [],
  };

  questions.forEach((q) => {
    const text = q.querySelector(".question-content").value.trim();
    const answers = q.querySelectorAll(".answer-input");
    const correct = q.querySelector('input[type="radio"]:checked').value;

    assignment.questions.push({
      question: text,
      answers: Array.from(answers).map((a) => a.value.trim()),
      correct: parseInt(correct),
    });
  });

  let assignments = JSON.parse(localStorage.getItem("assignments") || "[]");
  if (editingId) {
    const idx = assignments.findIndex((x) => x.id === editingId);
    if (idx !== -1) assignments[idx] = assignment;
    localStorage.removeItem("editingAssignmentId");
  } else {
    assignments.push(assignment);
  }

  localStorage.setItem("assignments", JSON.stringify(assignments));
  alert("Lưu bài tập thành công!");
  window.location.href = "manage-homework.html";
}

function loadDraft(id) {
  const assignments = JSON.parse(localStorage.getItem("assignments") || "[]");
  const draft = assignments.find((x) => x.id === id);
  if (!draft) return;

  document.getElementById("homework-title").value = draft.title;
  document.getElementById("course-select").value = draft.course;
  document.getElementById("deadline-input").value = draft.deadline || "";
  document.querySelector(".form-textarea").value = draft.description || "";
  document.getElementById("status-select").value = draft.status;

  const container = document.getElementById("questions-container");
  container.innerHTML = "";
  questionIndex = 0;

  draft.questions.forEach((q, qIdx) => {
    addQuestion();
    const qDiv = container.children[qIdx];
    qDiv.querySelector(".question-content").value = q.question;

    const answerList = qDiv.querySelector(".answer-list");
    answerList.innerHTML = "";

    q.answers.forEach((ans, i) => {
      const div = document.createElement("div");
      div.className = "answer-option";
      div.innerHTML = `
        <input type="radio" name="correct-${qIdx + 1}" value="${i}" ${
        i === q.correct ? "checked" : ""
      }>
        <input type="text" class="answer-input" value="${ans}" placeholder="Đáp án ${
        ["A", "B", "C", "D", "E", "F"][i]
      }" required>
        ${
          i >= 4
            ? `<button type="button" class="btn-remove" onclick="removeAnswer(this)"><i class="fas fa-times"></i></button>`
            : ""
        }
      `;
      answerList.appendChild(div);
    });
  });

  updateQuestionNumbers();
}

function closeModal() {
  if (confirm("Thoát mà không lưu?")) {
    localStorage.removeItem("editingAssignmentId");
    window.location.href = "manage-homework.html";
  }
}

function resetForm() {
  const title = document.getElementById("homework-title");
  const course = document.getElementById("course-select");
  const deadline = document.getElementById("deadline-input");
  const desc = document.querySelector(".form-textarea");
  const status = document.getElementById("status-select");
  const container = document.getElementById("questions-container");

  if (title) title.value = "";
  if (course) course.value = "Tiếng Anh Cơ Bản";
  if (deadline) deadline.value = "";
  if (desc) desc.value = "";
  if (status) status.value = "draft";
  if (container) container.innerHTML = "";

  questionIndex = 0;
}
