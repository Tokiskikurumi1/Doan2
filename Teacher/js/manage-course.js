let courses = JSON.parse(localStorage.getItem("courses")) || [];

const courseListEl = document.getElementById("course-list");
const createModal = document.getElementById("create-course-modal");

document.getElementById("new-course").onclick = () => {
  createModal.style.display = "flex";
};

document.getElementById("cancel-create").onclick = () => {
  createModal.style.display = "none";
};

document.getElementById("create-course-form").onsubmit = function (e) {
  e.preventDefault();

  const name = document.getElementById("course-name").value.trim();
  const type = document.getElementById("course-type").value;
  const status = document.getElementById("course-status").value;

  const course = {
    id: Date.now(),
    name,
    type,
    date: new Date().toISOString().split("T")[0],
    status,
    videos: [],
  };

  courses.push(course);
  localStorage.setItem("courses", JSON.stringify(courses));
  renderCourses();
  createModal.style.display = "none";
  this.reset();
};

function renderCourses() {
  courseListEl.innerHTML = "";

  courses.forEach((course) => {
    const div = document.createElement("div");
    div.className = "item-course";

    div.innerHTML = `
      <div class="item-course-panel">
        <div class="image-course">
            <img src="./img/course.png" alt="Khóa học cơ bản" />
        </div>
        <div class="course-info">
                <div class="name-course">${course.name}</div>
                <div class="date-and-number">
                  <div class="date-make">Ngày tạo: ${course.date}</div>
                  <div class="number-of-student">456 học viên</div>
                </div>
                <hr />
                <div class="status-course">
                  <div class="price">Đã hoàn thành</div>
                  <button class="delete-btn">Xóa</button>
                </div>
              </div>
      </div>
    `;

    // Nhấn để xem chi tiết
    div.querySelector(".item-course-panel").onclick = (e) => {
      if (e.target.classList.contains("delete-btn")) return;
      localStorage.setItem("selectedCourseId", course.id);
      window.location.href = "detail-course.html";
    };

    // Xóa khóa học
    div.querySelector(".delete-btn").onclick = () => {
      courses = courses.filter((c) => c.id !== course.id);
      localStorage.setItem("courses", JSON.stringify(courses));
      renderCourses();
    };

    courseListEl.appendChild(div);
  });
}

// Load ban đầu
renderCourses();
