// ========================== LOAD COURSE ==========================
function loadCoursesArray() {
  const raw = JSON.parse(localStorage.getItem("courses")) || [];
  return Array.isArray(raw) ? raw : Object.values(raw);
}

let courses = loadCoursesArray();
const courseId = localStorage.getItem("selectedCourseId");
const course = courses.find((c) => String(c.id) === String(courseId));

if (!course) {
  alert("Không tìm thấy khóa học!");
  window.location.href = "Teacher/manage-course.html";
}

// ========================== ELEMENTS ==========================
const titleInput = document.getElementById("course-title");
const typeSelect = document.getElementById("course-select");
const dateInput = document.getElementById("date-input");
const courseDetail = document.getElementById("course-detail");
const priceInput = document.getElementById("number-price");
const videoListEl = document.getElementById("video-list");
// const nameInput = document.querySelector(".name-teacher");
const statusSelect = document.getElementById("course-status");
const numberStudent = document.getElementById("numberStudent");
const name_teacher = document.getElementById("nameTeacher");

// ========================== HIỂN THỊ ==========================
name_teacher.textContent = course.teacherName;
dateInput.value = course.date;
titleInput.value = course.name;
typeSelect.value = course.type;
statusSelect.value = course.status;
courseDetail.value = course.detail;
priceInput.value = course.price;
numberStudent.textContent = `Số học viên: ` + course.students.length;
renderVideos();

// ========================== RENDER VIDEO ==========================
function renderVideos() {
  videoListEl.innerHTML = "";

  if (!course.videos || course.videos.length === 0) {
    videoListEl.innerHTML = "<p>Chưa có video nào</p>";
    return;
  }

  course.videos.forEach((video) => {
    const div = document.createElement("div");
    div.className = "video-item";

    const hasHomework = video.assignments && video.assignments.length > 0;
    const homeworkBtnText = hasHomework ? "Sửa bài tập" : "Tạo bài tập";
    const homeworkBtnClass = hasHomework
      ? "edit-homework-btn"
      : "create-homework-btn";
    const homeworkIcon = hasHomework
      ? '<i class="fas fa-edit"></i>'
      : '<i class="fas fa-tasks"></i>';

    div.innerHTML = `
      <div class="video-info">
        <p><strong>${video.title}</strong></p>
        <a href="${video.url}" target="_blank">Video bài giảng</a>
        
      </div>
      <div class="video-actions">
        <button type="button" class="edit-video-btn" title="Sửa video">
          <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="${homeworkBtnClass} homework-btn" title="${homeworkBtnText}">
          ${homeworkIcon} ${homeworkBtnText}
        </button>
        <button type="button" class="delete-video" title="Xóa video">Xóa</button>
      </div>
    `;

    // === CLICK TOÀN BỘ ITEM ĐỂ SỬA VIDEO ===
    div.addEventListener("click", (e) => {
      if (e.target.closest(".delete-video, .homework-btn, .edit-video-btn"))
        return;
      openEditVideoModal(video);
    });

    // === SỬA VIDEO ===
    div.querySelector(".edit-video-btn").onclick = (e) => {
      e.stopPropagation();
      openEditVideoModal(video);
    };

    // === TẠO / SỬA BÀI TẬP ===
    div.querySelector(".homework-btn").onclick = (e) => {
      e.stopPropagation();

      // Lưu thông tin cần thiết
      localStorage.setItem("creatingHomeworkForCourseId", course.id);
      localStorage.setItem("creatingHomeworkForVideoId", video.id);
      localStorage.setItem("creatingHomeworkForVideoTitle", video.title);
      localStorage.setItem("creatingHomeworkForCourseName", course.name);
      localStorage.setItem("creatingHomeworkForCourseType", course.type);
      localStorage.setItem("creatingHomeworkForCoursePrice", course.price);

      if (hasHomework && video.assignments[0]) {
        const assignment = video.assignments[0];
        const assignmentId =
          assignment.id ?? assignment.id?.toString() ?? Date.now().toString();
        localStorage.setItem("editingAssignmentId", String(assignmentId));
        console.log("Đang sửa bài tập ID:", String(assignmentId)); // để debug
      } else {
        localStorage.removeItem("editingAssignmentId");
      }

      // Chuyển trang – dùng location.href trực tiếp, không cần setTimeout
      window.location.href = "./create-homework.html";
    };

    // === XÓA VIDEO ===
    div.querySelector(".delete-video").onclick = (e) => {
      e.stopPropagation();
      if (confirm("Bạn có chắc chắn muốn xóa video này không?")) {
        course.videos = course.videos.filter((v) => v.id !== video.id);
        saveCoursesData(); // ← chỉ lưu
        renderVideos(); // ← ở lại trang và render lại danh sách
        alert("Xóa video thành công!");
      }
    };

    // Thêm vào DOM
    videoListEl.appendChild(div);
  });
}

// ========================== ADD VIDEO ==========================
document.getElementById("add-video-btn").onclick = (e) => {
  e.preventDefault();
  document.getElementById("add-video-modal").style.display = "flex";
};

document.getElementById("cancel-video").onclick = () => {
  document.getElementById("add-video-modal").style.display = "none";
};

document.getElementById("add-video-form").onsubmit = function (e) {
  e.preventDefault();

  const title = document.getElementById("video-title").value;
  const url = document.getElementById("video-url").value;

  course.videos.push({
    id: Date.now(),
    title,
    url,
    status: "Chưa hoàn thành",
    assignments: [],
  });

  saveVideo(false);
  renderVideos();

  this.reset();
  document.getElementById("add-video-modal").style.display = "none";
};

// ========================== LƯU VIDEO VÀ CHỈNH SỬA VIDEO ==========================
document.getElementById("save-course").onclick = saveCourse;

function saveCourse() {
  course.name = titleInput.value;
  course.type = typeSelect.value;
  course.date = dateInput.value;
  course.price = priceInput.value;
  course.detail = courseDetail.value;
  course.status = statusSelect.value;
  const index = courses.findIndex((c) => c.id === course.id);
  courses[index] = course;

  localStorage.setItem("courses", JSON.stringify(courses));

  alert("Lưu thông tin thay đổi!");

  setTimeout(() => {
    window.location.href = "../Teacher/manage-course.html";
  }, 10);
}

// 1. Hàm chỉ lưu (không chuyển trang)
function saveCoursesData() {
  const index = courses.findIndex((c) => c.id === course.id);
  courses[index] = course;
  localStorage.setItem("courses", JSON.stringify(courses));
}

// 2. Hàm lưu + chuyển trang
function saveCourseAndRedirect() {
  saveCoursesData();
  alert("Lưu thông tin thay đổi!");
  setTimeout(() => {
    window.location.href = "../Teacher/manage-course.html";
  }, 10);
}

function saveVideo(isEdit = false) {
  course.name = titleInput.value;
  course.type = typeSelect.value;
  course.date = dateInput.value;
  course.price = priceInput.value;

  const index = courses.findIndex((c) => c.id === course.id);
  courses[index] = course;

  localStorage.setItem("courses", JSON.stringify(courses));

  alert(isEdit ? "Sửa video thành công!" : "Thêm video thành công!");
}

// ========================== HỦY ==========================
document.getElementById("cancel-course").onclick = () => {
  setTimeout(() => {
    window.location.href = "../Teacher/manage-course.html";
  }, 10);
};

// ========================== LÁY VIDEO ==========================

let currentEditingVideo = null;

function openEditVideoModal(video) {
  currentEditingVideo = video;

  document.getElementById("edit-video-title").value = video.title;
  document.getElementById("edit-video-url").value = video.url;

  document.getElementById("edit-video-modal").style.display = "flex";
}

document.getElementById("edit-video-form").onsubmit = function (e) {
  e.preventDefault();

  currentEditingVideo.title = document.getElementById("edit-video-title").value;
  currentEditingVideo.url = document.getElementById("edit-video-url").value;

  saveVideo(true);
  renderVideos();

  document.getElementById("edit-video-modal").style.display = "none";
};

document.getElementById("cancel-edit-video").onclick = () => {
  document.getElementById("edit-video-modal").style.display = "none";
};
