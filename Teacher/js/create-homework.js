// ======================= LẤY THÔNG TIN GIẢNG VIÊN =======================
const currentUserId = localStorage.getItem("currentUser");
const allUsersData = JSON.parse(localStorage.getItem("listusers")) || {};
const currentUser = currentUserId ? allUsersData[currentUserId] : null;

if (!currentUser || currentUser.role !== "teacher") {
  alert("Bạn không có quyền truy cập trang này!");
  window.location.href = "../User_header_footer/login.html";
}

// ======================= DOM ELEMENTS =======================
const quizForm = document.querySelector(".quizForm");
const title = document.getElementById("homework-title");
const courseSelect = document.getElementById("homework-course-select");
const deadline = document.getElementById("deadline-input");
const description = document.querySelector(".form-textarea");
const statusHW = document.getElementById("status-select");
const typeSelect = document.getElementById("type-select");
const durationelect = document.getElementById("duration-select");
const questionsContainer = document.getElementById("questions-container");

let questionCounter = 0; // ĐÃ SỬA: dùng counter riêng, không dùng index mập mờ

// ====================== INIT =========================
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const savedCourseType = localStorage.getItem(
      "creatingHomeworkForCourseType"
    );
    const savedCourseName = localStorage.getItem(
      "creatingHomeworkForCourseName"
    );

    if (
      courseSelect &&
      savedCourseType &&
      !localStorage.getItem("editingAssignmentId")
    ) {
      courseSelect.value = savedCourseType;
      courseSelect.dispatchEvent(new Event("change"));
    }

    if (savedCourseName && !localStorage.getItem("editingAssignmentId")) {
      title.placeholder = `Bài tập cho khóa: ${savedCourseName}`;
    }

    const editingId = localStorage.getItem("editingAssignmentId");
    if (editingId) {
      loadDraft(editingId);
    } else {
      resetForm();
      addNewQuestion(); // TỰ ĐỘNG THÊM 1 CÂU HỎI KHI MỚI VÀO
    }

    quizForm.addEventListener("submit", handleSubmit);
    typeSelect.addEventListener("change", () => {
      questionsContainer.innerHTML = "";
      questionCounter = 0;
      addNewQuestion();
    });
  }, 100);
});

// ====================== THÊM CÂU HỎI MỚI =======================
function addNewQuestion() {
  questionCounter++;
  const qDiv = document.createElement("div");
  qDiv.className = "question-builder";
  qDiv.dataset.qid = questionCounter;

  if (typeSelect.value === "Rewrite") {
    qDiv.classList.add("rewrite");
    qDiv.innerHTML = renderRewriteQuestion(questionCounter);
  } else {
    qDiv.innerHTML = renderMultipleChoiceQuestion(questionCounter);
  }

  questionsContainer.appendChild(qDiv);
}

// ====================== RENDER CÂU HỎI TRẮC NGHIỆM =======================
function renderMultipleChoiceQuestion(num) {
  return `
    <div class="question-header">
      <div class="question-title">Câu hỏi ${num}</div>
      <button type="button" class="btn-remove" onclick="removeQuestion(this)">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="form-group">
      <label class="form-label">Nội dung câu hỏi *</label>
      <textarea class="form-textarea question-content" required></textarea>
    </div>
    <div class="answer-list" data-qid="${num}">
      ${renderAnswerOption(0, num)}
      ${renderAnswerOption(1, num)}
      ${renderAnswerOption(2, num)}
      ${renderAnswerOption(3, num)}
    </div>
    <button type="button" class="btn-add-answer" onclick="addAnswer(this, ${num})">
      <i class="fas fa-plus"></i> Thêm đáp án
    </button>
    <hr style="margin: 2rem 0; border: none; border-top: 1px dashed #cbd5e1;">
  `;
}

// ====================== RENDER CÂU VIẾT LẠI =======================
function renderRewriteQuestion(num) {
  return `
    <div class="question-header">
      <div class="question-title">Câu ${num}</div>
      <button type="button" class="btn-remove" onclick="removeQuestion(this)">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="form-group">
      <label class="form-label">Câu gốc *</label>
      <textarea class="form-textarea rewrite-original" required></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Câu viết lại đúng *</label>
      <textarea class="form-textarea rewrite-answer" required></textarea>
    </div>
    <hr style="margin: 2rem 0; border: none; border-top: 1px dashed #cbd5e1;">
  `;
}

// ====================== RENDER ĐÁP ÁN =======================
function renderAnswerOption(idx, qNum, value = "", isCorrect = false) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  const canRemove = idx >= 4;
  return `
    <div class="answer-option">
      <input type="radio" name="correct-${qNum}" value="${idx}" ${
    isCorrect ? "checked" : ""
  }>
      <input type="text" class="answer-input" value="${value}" placeholder="Đáp án ${
    letters[idx]
  }" required>
      ${
        canRemove
          ? `<button type="button" class="btn-remove" onclick="removeAnswer(this)"><i class="fas fa-times"></i></button>`
          : ""
      }
    </div>
  `;
}

// ====================== THÊM / XÓA ĐÁP ÁN =======================
function addAnswer(btn, qNum) {
  const list = btn.previousElementSibling;
  if (list.children.length >= 6) return alert("Tối đa 6 đáp án!");
  list.insertAdjacentHTML(
    "beforeend",
    renderAnswerOption(list.children.length, qNum)
  );
}

function removeAnswer(btn) {
  btn.closest(".answer-option").remove();
}

// ====================== XÓA CÂU HỎI =======================
function removeQuestion(btn) {
  btn.closest(".question-builder").remove();
  updateQuestionNumbers();
}

function updateQuestionNumbers() {
  const questions = document.querySelectorAll(".question-builder");
  questions.forEach((q, idx) => {
    const newNum = idx + 1;
    q.dataset.qid = newNum;
    q.querySelector(".question-title").textContent =
      typeSelect.value === "Rewrite" ? `Câu ${newNum}` : `Câu hỏi ${newNum}`;

    // Cập nhật name của radio button
    q.querySelectorAll("input[type='radio']").forEach((radio) => {
      radio.name = `correct-${newNum}`;
    });
  });
  questionCounter = questions.length;
}

// ====================== SUBMIT (ĐÃ FIX 100%) =======================
function handleSubmit(e) {
  e.preventDefault();

  const questions = document.querySelectorAll(".question-builder");
  if (questions.length === 0) return alert("Vui lòng thêm ít nhất 1 câu hỏi!");

  if (typeSelect.value !== "Rewrite") {
    for (let q of questions) {
      if (!q.querySelector(`input[name^='correct-']:checked`)) {
        return alert(
          `Câu hỏi ${
            q.querySelector(".question-title").textContent
          } chưa chọn đáp án đúng!`
        );
      }
    }
  }

  const editingId = localStorage.getItem("editingAssignmentId");
  const finalCourseType =
    localStorage.getItem("creatingHomeworkForCourseType") ||
    courseSelect.value ||
    "TOEIC";

  const assignment = {
    id: editingId || Date.now().toString(),
    teacherId: currentUser.id,
    videoId: localStorage.getItem("creatingHomeworkForVideoId") || null,
    videoTitle:
      localStorage.getItem("creatingHomeworkForVideoTitle") || "Không có video",
    courseId: localStorage.getItem("creatingHomeworkForCourseId") || null,
    title: title.value.trim() || "Bài tập không có tiêu đề",
    course: finalCourseType,
    deadline: deadline.value,
    description: description.value.trim(),
    status: statusHW.value,
    type: typeSelect.value,
    duration: durationelect.value,
    createdAt: new Date().toISOString(),
    questions: [],
  };

  // Thu thập câu hỏi
  questions.forEach((q) => {
    if (typeSelect.value === "Rewrite") {
      assignment.questions.push({
        original: q.querySelector(".rewrite-original").value.trim(),
        rewritten: q.querySelector(".rewrite-answer").value.trim(),
      });
    } else {
      const content = q.querySelector(".question-content").value.trim();
      const answers = q.querySelectorAll(".answer-input");
      const correctIdx = q.querySelector(
        `input[name="correct-${q.dataset.qid}"]:checked`
      )?.value;

      assignment.questions.push({
        question: content,
        answers: Array.from(answers)
          .map((a) => a.value.trim())
          .filter((a) => a),
        correct: Number(correctIdx),
      });
    }
  });

  // Lưu vào localStorage
  let assignments = JSON.parse(localStorage.getItem("assignments") || "[]");
  if (editingId) {
    const idx = assignments.findIndex((a) => a.id === editingId);
    if (idx !== -1) assignments[idx] = assignment;
    localStorage.removeItem("editingAssignmentId");
  } else {
    assignments.push(assignment);
  }
  localStorage.setItem("assignments", JSON.stringify(assignments));

  // Gắn vào video (nếu có)
  const courseId = localStorage.getItem("creatingHomeworkForCourseId");
  const videoId = localStorage.getItem("creatingHomeworkForVideoId");
  if (courseId && videoId) {
    let courses = JSON.parse(localStorage.getItem("courses") || "[]");
    const course = courses.find((c) => String(c.id) === String(courseId));
    if (course?.videos) {
      const video = course.videos.find((v) => String(v.id) === String(videoId));
      if (video) {
        if (!video.assignments) video.assignments = [];
        if (!video.assignments.includes(assignment.id)) {
          video.assignments.push(assignment.id);
        }
        localStorage.setItem("courses", JSON.stringify(courses));
      }
    }
  }

  // Dọn dẹp
  [
    "creatingHomeworkForCourseId",
    "creatingHomeworkForVideoId",
    "creatingHomeworkForVideoTitle",
    "creatingHomeworkForCourseType",
    "creatingHomeworkForCourseName",
  ].forEach((key) => localStorage.removeItem(key));

  alert("Tạo bài tập thành công!");
  window.location.href = courseId
    ? "./detail-course.html"
    : "./manage-homework.html";
}

// ====================== LOAD DRAFT & RESET =======================
function loadDraft(id) {
  const assignments = JSON.parse(localStorage.getItem("assignments") || "[]");
  const draft = assignments.find((a) => a.id === id);
  if (!draft) return;

  title.value = draft.title || "";
  if (courseSelect) courseSelect.value = draft.course;
  deadline.value = draft.deadline || "";
  description.value = draft.description || "";
  statusHW.value = draft.status || "draft";
  typeSelect.value = draft.type || "Quizz";
  durationelect.value = draft.duration || "15";
  questionsContainer.innerHTML = "";
  questionCounter = 0;

  draft.questions.forEach((q) => {
    addNewQuestion();
    const lastQ = questionsContainer.lastElementChild;

    if (draft.type === "Rewrite") {
      lastQ.querySelector(".rewrite-original").value = q.original || "";
      lastQ.querySelector(".rewrite-answer").value = q.rewritten || "";
    } else {
      lastQ.querySelector(".question-content").value = q.question || "";
      const answerList = lastQ.querySelector(".answer-list");
      answerList.innerHTML = "";
      q.answers.forEach((ans, i) => {
        answerList.insertAdjacentHTML(
          "beforeend",
          renderAnswerOption(i, questionCounter, ans, i === q.correct)
        );
      });
    }
  });
}

function resetForm() {
  title.value = "";
  if (courseSelect) courseSelect.value = "TOEIC";
  deadline.value = "";
  description.value = "";
  statusHW.value = "draft";
  typeSelect.value = "Quizz";
  durationelect.value = "15";
  questionsContainer.innerHTML = "";
  questionCounter = 0;
}
