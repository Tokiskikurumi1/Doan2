let courses = JSON.parse(localStorage.getItem("courses")) || [];
const courseId = localStorage.getItem("selectedCourseId");

const course = courses.find((c) => String(c.id) === String(courseId));

if (!course) {
  alert("Không tìm thấy khóa học!");
  window.location.href = "manage_course.html";
}

// HTML elements
const titleInput = document.getElementById("course-title");
const typeSelect = document.getElementById("course-select");
const dateInput = document.getElementById("date-input");
const videoListEl = document.getElementById("video-list");

// HIỂN THỊ
titleInput.value = course.name;
typeSelect.value = course.type;
dateInput.value = course.date;

renderVideos();

function renderVideos() {
  videoListEl.innerHTML = "";

  course.videos.forEach((video) => {
    const div = document.createElement("div");
    div.className = "video-item";

    div.innerHTML = `
      <p><strong>${video.title}</strong></p>
      <a href="${video.url}" target="_blank">${video.url}</a>
      <button class="delete-video">Xóa</button>
    `;

    div.querySelector(".delete-video").onclick = () => {
      course.videos = course.videos.filter((v) => v.id !== video.id);
      saveCourse();
      renderVideos();
    };

    videoListEl.appendChild(div);
  });
}

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
  });

  saveCourse();
  renderVideos();
  this.reset();
  document.getElementById("add-video-modal").style.display = "none";
};

document.getElementById("save-course").onclick = saveCourse;

function saveCourse() {
  course.name = titleInput.value;
  course.type = typeSelect.value;
  course.date = dateInput.value;

  const index = courses.findIndex((c) => c.id === course.id);
  courses[index] = course;

  localStorage.setItem("courses", JSON.stringify(courses));
  alert("Đã lưu!");
}

document.getElementById("cancel-course").onclick = () => {
  window.location.href = "manage_course.html";
};
