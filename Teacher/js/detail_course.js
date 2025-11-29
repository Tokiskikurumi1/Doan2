// ========================== LOAD COURSE ==========================
let courses = JSON.parse(localStorage.getItem("courses")) || [];
const courseId = localStorage.getItem("selectedCourseId");
const nameTeacher = localStorage.getItem("savedUsername");

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
const nameInput = document.querySelector(".name-teacher");
const statusSelect = document.getElementById("course-status");
// ========================== HIỂN THỊ ==========================
nameInput.innerHTML = nameTeacher;
dateInput.value = course.date;
titleInput.value = course.name;
typeSelect.value = course.type;
statusSelect.value = course.status;
courseDetail.value = course.detail;
priceInput.value = course.price;

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

    div.innerHTML = `
        <div class="video-info">
          <p><strong>${video.title}</strong></p>
          <a href="${video.url}" target="_blank">${video.url}</a>
        </div>
        <div class="video-actions">
          <button class="edit-video-btn" title="Sửa video">
            <i class="fas fa-edit"></i>
          </button>
          <button class="create-homework-btn" title="Tạo bài tập cho video này">
            <i class="fas fa-tasks"></i> Tạo bài tập
          </button>
          <button class="delete-video" title="Xóa video">Xóa</button>
        </div>
      `;

    // Click toàn bộ video-item để sửa (trừ các nút)
    div.addEventListener("click", (e) => {
      if (
        e.target.closest(".delete-video") ||
        e.target.closest(".create-homework-btn") ||
        e.target.closest(".edit-video-btn")
      )
        return;

      openEditVideoModal(video);
    });

    // Nút sửa video
    div.querySelector(".edit-video-btn").onclick = (e) => {
      e.stopPropagation();
      openEditVideoModal(video);
    };

    // Nút tạo bài tập
    div.querySelector(".create-homework-btn").onclick = (e) => {
      e.stopPropagation();

      // Lưu thông tin để quay lại đúng chỗ
      localStorage.setItem("creatingHomeworkForCourseId", course.id);
      localStorage.setItem("creatingHomeworkForVideoId", video.id);
      localStorage.setItem("creatingHomeworkForVideoTitle", video.title);

      // MỚI: LƯU THÊM THÔNG TIN KHÓA HỌC ĐỂ TỰ ĐỘNG ĐIỀN FORM
      localStorage.setItem("creatingHomeworkForCourseName", course.name);
      localStorage.setItem("creatingHomeworkForCourseType", course.type);
      localStorage.setItem("creatingHomeworkForCoursePrice", course.price);

      setTimeout(() => {
        window.location.href = "./create-homework.html";
      }, 1);
    };

    // Nút xóa video
    div.querySelector(".delete-video").onclick = (e) => {
      e.stopPropagation();
      if (confirm("Bạn có chắc muốn xóa video này?")) {
        course.videos = course.videos.filter((v) => v.id !== video.id);
        saveCourse();
        renderVideos();
      }
    };

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
    assignments: [], // ← THÊM DÒNG NÀY
  });

  saveVideo();
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

function saveVideo() {
  course.name = titleInput.value;
  course.type = typeSelect.value;
  course.date = dateInput.value;
  course.price = priceInput.value;

  const index = courses.findIndex((c) => c.id === course.id);
  courses[index] = course;

  localStorage.setItem("courses", JSON.stringify(courses));

  alert("Thêm video thành công!");
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

  saveVideo();
  renderVideos();

  document.getElementById("edit-video-modal").style.display = "none";
};

document.getElementById("cancel-edit-video").onclick = () => {
  document.getElementById("edit-video-modal").style.display = "none";
};
