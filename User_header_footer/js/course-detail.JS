import { CourseManager } from "./object.js";
const courseId = String(localStorage.getItem("selectedCourseId"));
const course = CourseManager.getById(courseId);

// Nếu không tìm thấy khóa học → quay lại shop
if (!course) {
  alert("Không tìm thấy khóa học!");
  window.location.href = "./shop.html";
}

//HIỂN THỊ ẢNH

const imgEl = document.querySelector(".img");
imgEl.style.backgroundImage = `url('${course.image || ".\img\image_course\image-course.png"}')`;
imgEl.style.backgroundSize = "cover";
imgEl.style.backgroundPosition = "center";

//KHI DỮ LIỆU VÀO HTML

document.querySelector(".title").textContent = "Khóa học: " + (course.name || "Không có tên");
document.querySelector(".price").textContent = (course.price || 0) + " VND";
document.querySelector(".info-description p").textContent = course.detail || "Chưa có mô tả";
document.querySelector(".info-instructor .name").textContent = course.teacherName || "Không rõ";
document.querySelector(".info-level .level").textContent = course.type || "Không rõ";
document.querySelector(".info-duration .time").textContent = course.duration || "Không rõ";

//RENDER DANH SÁCH BÀI GIẢNG

const videoContainer = document.getElementById("video-container");
videoContainer.innerHTML = "";

if (Array.isArray(course.videos) && course.videos.length > 0) {
  course.videos.forEach((video, index) => {
    const item = document.createElement("div");
    item.className = "info-curriculum-item";

    item.innerHTML = `
      <div class="lesson">${index + 1}</div>
      <div class="title">${video.title || "Bài học không tên"}</div>
    `;

    videoContainer.appendChild(item);
  });
} else {
  videoContainer.innerHTML = "<p>Chưa có bài học nào</p>";
}

// NÚT THANH TOÁN

document.getElementById("btnbuy").addEventListener("click", () => {
  localStorage.setItem("paymentPrice", course.price);
  window.location.href = "./payment.html";
});
