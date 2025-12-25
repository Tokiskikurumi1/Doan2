import { apiClient } from "./object.js";

(async () => {
  const courseId = String(localStorage.getItem("selectedCourseId"));

  try {
    const courseData = await apiClient.getCourseDetails(courseId);

    if (!courseData) {
      alert("Không tìm thấy khóa học!");
      window.location.href = "./shop.html";
      return;
    }

    // HIỂN THỊ ẢNH
    const imgEl = document.querySelector(".img");
    imgEl.style.backgroundImage = `url('${courseData.courseImage || "../img/image_course/image-course.png"}')`;
    imgEl.style.backgroundSize = "cover";
    imgEl.style.backgroundPosition = "center";

    // KHI DỮ LIỆU VÀO HTML
    document.querySelector(".title").textContent = "Khóa học: " + (courseData.courseName || "Không có tên");
    document.querySelector(".price").textContent = (courseData.coursePrice || 0) + " VND";
    document.querySelector(".info-description p").textContent = courseData.courseDes || "Chưa có mô tả";
    document.querySelector(".info-instructor .name").textContent = courseData.teacherName || "Không rõ";
    document.querySelector(".info-level .level").textContent = courseData.courseType || "Không rõ";
    document.querySelector(".info-duration .time").textContent = courseData.courseDate || "Không rõ";

    // RENDER DANH SÁCH BÀI GIẢNG
    const videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = "";

    const videos = courseData.videos || [];
    if (videos.length > 0) {
      videos.forEach((video, index) => {
        const item = document.createElement("div");
        item.className = "info-curriculum-item";

        item.innerHTML = `
          <div class="lesson">${index + 1}</div>
          <div class="title">${video.videoName || "Bài học không tên"}</div>
        `;

        videoContainer.appendChild(item);
      });
    } else {
      videoContainer.innerHTML = "<p>Chưa có bài học nào</p>";
    }

    // NÚT THANH TOÁN
    document.getElementById("btnbuy").addEventListener("click", () => {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser) {
        alert("Bạn cần đăng nhập trước khi thanh toán!");
        window.location.href = "./login.html";
        return;
      }

      localStorage.setItem("paymentPrice", courseData.coursePrice);
      localStorage.setItem("paymentUserId", currentUser.userID);
      localStorage.setItem("paymentCourseId", courseId);
      window.location.href = "./payment.html";
    });

  } catch (error) {
    console.error("Failed to load course details:", error);
    alert("Lỗi khi tải thông tin khóa học!");
    window.location.href = "./shop.html";
  }
})();
