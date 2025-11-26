// ======================= LẤY THÔNG TIN GIẢNG VIÊN ĐANG ĐĂNG NHẬP =======================
const currentUserId = localStorage.getItem("currentUser");
const allUsersData = JSON.parse(localStorage.getItem("listusers")) || {};
const currentUser = currentUserId ? allUsersData[currentUserId] : null;

// Bảo vệ trang
if (!currentUser || currentUser.role !== "teacher") {
  alert("Bạn không có quyền truy cập trang này!");
  window.location.href = "../User_header_footer/login.html";
}

// ======================= CREATE HOMEWORK =======================
const quizForm = document.querySelector(".quizForm");
const title = document.getElementById("homework-title");
const courseSelect = document.getElementById("homework-course-select"); // đổi tên cho rõ
const deadline = document.getElementById("deadline-input");
const description = document.querySelector(".form-textarea");
const statusHW = document.getElementById("status-select");
const typeSelect = document.getElementById("type-select");
const durationelect = document.getElementById("duration-select");
const questionsContainer = document.getElementById("questions-container");

let questionIndex = 0;

// ====================== INIT =========================
document.addEventListener("DOMContentLoaded", () => {
  // TỰ ĐỘNG ĐIỀN LOẠI KHÓA HỌC KHI TẠO TỪ VIDEO (ĐÃ FIX 100%)
  const savedCourseType = localStorage.getItem("creatingHomeworkForCourseType");
  const savedCourseName = localStorage.getItem("creatingHomeworkForCourseName");

  if (savedCourseType && !localStorage.getItem("editingAssignmentId")) {
    courseSelect.value = savedCourseType;
    // BẮT BUỘC KÍCH HOẠT EVENT ĐỂ TRÌNH DUYỆT CÔNG NHẬN GIÁ TRỊ MỚI
    courseSelect.dispatchEvent(new Event("change"));
    courseSelect.dispatchEvent(new Event("input"));
  }

  if (savedCourseName && !localStorage.getItem("editingAssignmentId")) {
    title.placeholder = `Bài tập cho khóa: ${savedCourseName}`;
  }

  const editingId = localStorage.getItem("editingAssignmentId");
  if (editingId) {
    loadDraft(editingId);
  } else {
    resetForm();
    handleTypeChange();
  }

  quizForm.addEventListener("submit", handleSubmit);
  typeSelect.addEventListener("change", handleTypeChange);
});

// ====================== HANDLE TYPE CHANGE =========================
function handleTypeChange() {
  questionsContainer.innerHTML = "";
  questionIndex = 0;
  if (typeSelect.value === "Rewrite") {
    addRewriteQuestion();
  } else {
    addQuestion();
  }
}

function addNewQuestion() {
  typeSelect.value === "Rewrite" ? addRewriteQuestion() : addQuestion();
}

// ====================== ADD QUESTIONS =========================
function addQuestion() {
  questionIndex++;
  const qDiv = document.createElement("div");
  qDiv.className = "question-builder";
  qDiv.dataset.qid = questionIndex;
  qDiv.innerHTML = renderQuestion(questionIndex);
  questionsContainer.appendChild(qDiv);
}

function addRewriteQuestion() {
  questionIndex++;
  const qDiv = document.createElement("div");
  qDiv.className = "question-builder rewrite";
  qDiv.dataset.qid = questionIndex;
  qDiv.innerHTML = renderRewrite(questionIndex);
  questionsContainer.appendChild(qDiv);
}

// ====================== RENDER QUESTIONS =========================
function renderQuestion(qIdx) {
  return `
    <div class="question-header">
      <div class="question-title">Câu hỏi ${qIdx}</div>
      <button type="button" class="btn-remove" onclick="removeQuestion(this)">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="form-group">
      <label class="form-label">Nội dung câu hỏi *</label>
      <textarea class="form-textarea question-content" required></textarea>
    </div>
    <div class="answer-list">
      ${[0, 1, 2, 3].map((i) => renderAnswer(i, qIdx)).join("")}
    </div>
    <button type="button" class="btn-add-answer" onclick="addAnswer(this, ${qIdx})">
      <i class="fas fa-plus"></i> Thêm đáp án
    </button>
  `;
}

function renderRewrite(idx) {
  return `
    <div class="question-header">
      <div class="question-title">Câu ${idx}</div>
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
  `;
}

function renderAnswer(idx, qIdx, value = "", correct = false) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  const canRemove = idx >= 4;
  return `
    <div class="answer-option">
      <input type="radio" name="correct-${qIdx}" value="${idx}" ${
    correct ? "checked" : ""
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

function addAnswer(btn, qIdx) {
  const list = btn.previousElementSibling;
  if (list.children.length >= 6) return alert("Tối đa 6 đáp án!");
  list.insertAdjacentHTML(
    "beforeend",
    renderAnswer(list.children.length, qIdx)
  );
}

function removeAnswer(btn) {
  const list = btn.closest(".answer-list");
  btn.closest(".answer-option").remove();
  updateAnswerIndices(list);
}

function updateAnswerIndices(list) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  list.querySelectorAll(".answer-option").forEach((opt, idx) => {
    const radio = opt.querySelector("input[type='radio']");
    const input = opt.querySelector(".answer-input");
    radio.value = idx;
    input.placeholder = `Đáp án ${letters[idx]}`;
    const removeBtn = opt.querySelector(".btn-remove");
    if (idx >= 4 && !removeBtn) {
      opt.insertAdjacentHTML(
        "beforeend",
        `<button type="button" class="btn-remove" onclick="removeAnswer(this)"><i class="fas fa-times"></i></button>`
      );
    } else if (idx < 4 && removeBtn) {
      removeBtn.remove();
    }
  });
}

function removeQuestion(btn) {
  btn.closest(".question-builder").remove();
  updateQuestionNumbers();
}

function updateQuestionNumbers() {
  const qs = document.querySelectorAll(".question-builder");
  qs.forEach((q, i) => {
    q.dataset.qid = i + 1;
    q.querySelector(".question-title").textContent =
      typeSelect.value === "Rewrite" ? `Câu ${i + 1}` : `Câu hỏi ${i + 1}`;
    q.querySelectorAll("input[type='radio']").forEach(
      (r) => (r.name = `correct-${i + 1}`)
    );
  });
  questionIndex = qs.length;
}

// ====================== SUBMIT (ĐÃ FIX LOẠI KHÓA HỌC) ======================
function handleSubmit(e) {
  e.preventDefault();

  const questions = document.querySelectorAll(".question-builder");
  if (questions.length === 0) return alert("Vui lòng thêm ít nhất 1 câu hỏi!");

  if (typeSelect.value !== "Rewrite") {
    for (let q of questions) {
      if (!q.querySelector("input[type='radio']:checked")) {
        return alert("Mỗi câu hỏi phải chọn ít nhất 1 đáp án đúng!");
      }
    }
  }

  const editingId = localStorage.getItem("editingAssignmentId");

  // ƯU TIÊN LẤY LOẠI KHÓA HỌC TỪ TEMP STORAGE (khi tạo từ video)
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
    title: title.value.trim(),
    course: finalCourseType, // ĐÃ FIX CHẮC CHẮN
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
      const answers = q.querySelectorAll(".answer-input");
      const correct = q.querySelector("input[type='radio']:checked").value;
      assignment.questions.push({
        question: q.querySelector(".question-content").value.trim(),
        answers: Array.from(answers).map((a) => a.value.trim()),
        correct: Number(correct),
      });
    }
  });

  // LƯU BÀI TẬP
  let assignments = JSON.parse(localStorage.getItem("assignments") || "[]");
  if (editingId) {
    const idx = assignments.findIndex((x) => x.id === editingId);
    if (idx !== -1) assignments[idx] = assignment;
    localStorage.removeItem("editingAssignmentId");
  } else {
    assignments.push(assignment);
  }
  localStorage.setItem("assignments", JSON.stringify(assignments));

  // GẮN BÀI TẬP VÀO VIDEO
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

  // DỌN DẸP TEMP DATA
  localStorage.removeItem("creatingHomeworkForCourseId");
  localStorage.removeItem("creatingHomeworkForVideoId");
  localStorage.removeItem("creatingHomeworkForVideoTitle");
  localStorage.removeItem("creatingHomeworkForCourseType");
  localStorage.removeItem("creatingHomeworkForCourseName");

  alert("Tạo bài tập thành công và đã gắn vào video!");

  if (courseId) {
    localStorage.setItem("selectedCourseId", courseId);
    window.location.href = "./detail-course.html";
  } else {
    window.location.href = "./manage-homework.html";
  }
}

// ====================== LOAD DRAFT & RESET ======================
function loadDraft(id) {
  const list = JSON.parse(localStorage.getItem("assignments") || "[]");
  const draft = list.find((x) => x.id === id);
  if (!draft) return;

  title.value = draft.title;
  courseSelect.value = draft.course;
  deadline.value = draft.deadline || "";
  description.value = draft.description || "";
  statusHW.value = draft.status;
  typeSelect.value = draft.type || "Quizz";
  durationelect.value = draft.duration || "15";
  questionsContainer.innerHTML = "";
  questionIndex = 0;

  draft.questions.forEach((q, idx) => {
    if (draft.type === "Rewrite") {
      addRewriteQuestion();
      const qDiv = questionsContainer.children[idx];
      qDiv.querySelector(".rewrite-original").value = q.original;
      qDiv.querySelector(".rewrite-answer").value = q.rewritten;
    } else {
      addQuestion();
      const qDiv = questionsContainer.children[idx];
      qDiv.querySelector(".question-content").value = q.question;
      const answerList = qDiv.querySelector(".answer-list");
      answerList.innerHTML = "";
      q.answers.forEach((ans, i) => {
        answerList.insertAdjacentHTML(
          "beforeend",
          renderAnswer(i, idx + 1, ans, i === q.correct)
        );
      });
    }
  });
  updateQuestionNumbers();
}

function resetForm() {
  title.value = "";
  courseSelect.value = "TOEIC";
  deadline.value = "";
  description.value = "";
  statusHW.value = "draft";
  typeSelect.value = "Quizz";
  durationelect.value = "15";
  questionsContainer.innerHTML = "";
  questionIndex = 0;
}
