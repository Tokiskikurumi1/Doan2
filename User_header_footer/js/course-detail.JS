// Lấy dữ liệu từ localStorage
const courses = JSON.parse(localStorage.getItem("courses")) || [];
const courseId = localStorage.getItem("selectedCourseId");

// Tìm khóa học theo id
const course = courses.find(c => String(c.id) === String(courseId));

if (!course) {
  alert("Không tìm thấy khóa học!");
  window.location.href = "./shop.html"; // quay lại shop nếu lỗi
}

// ====== Ảnh mặc định ======
const imgEl = document.querySelector(".img");
imgEl.style.backgroundImage = `url('${course.imageUrl || "./img/image_course/image-course.png"}')`;
imgEl.style.backgroundSize = "cover";
imgEl.style.backgroundPosition = "center";

// Ghi dữ liệu vào HTML
document.querySelector(".title").textContent = course.name;
document.querySelector(".price").textContent = course.price + " VND";
document.querySelector(".info-description p").textContent = course.detail || "Chưa có mô tả";
document.querySelector(".info-instructor .name").textContent = course.teacherName || "Không rõ";
document.querySelector(".info-level .level").textContent = course.type || "Không rõ";
document.querySelector(".info-duration .time").textContent = course.duration || "Không rõ";

// Nếu có video thì render
const videoContainer = document.getElementById("video-container");

videoContainer.innerHTML = "";
if (course.videos && course.videos.length > 0) {
  course.videos.forEach(video => {
    const item = document.createElement("div");
    item.className = "info-curriculum-item";
    item.innerHTML = `
      <p><strong>${video.title}</strong></p>
      <a href="${video.url}" target="_blank">${video.url}</a>
    `;
    videoContainer.appendChild(item);
  });
} else {
  videoContainer.innerHTML = "<p>Chưa có video nào</p>";
}
// Nút thanh toán
document.getElementById("btnwhite").addEventListener("click", () => {
  // Lưu giá tiền vào localStorage để payment.html lấy lại
  localStorage.setItem("paymentPrice", course.price);

  // Chuyển hướng sang trang thanh toán
  window.location.href = "./payment.html";
});
