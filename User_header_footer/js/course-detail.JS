// course-detail.js
document.addEventListener("DOMContentLoaded", () => {
  const courseData = localStorage.getItem("selectedCourse");
  if (!courseData) {
    alert("Không tìm thấy khóa học!");
    return;
  }

  let course;
  try {
    course = JSON.parse(courseData);
  } catch (e) {
    alert("Dữ liệu khóa học lỗi!");
    return;
  }

  // Điền thông tin cơ bản
  document.querySelector(".title").textContent = course.name || "Khóa học";
  document.querySelector(".info-description p").textContent =
    course.detail || "Chưa có mô tả.";
  document.querySelector(".info-instructor .name").textContent =
    course.teacherName || "Giảng viên";
  document.querySelector(".price").textContent =
    Number(course.price) === 0
      ? "Miễn phí"
      : Number(course.price).toLocaleString("vi-VN") + " đ";

  // Ảnh
  const imgDiv = document.querySelector(".img");
  const imgSrc =
    course.image_url || course.image || "../img/image_course/image-course.png";
  imgDiv.innerHTML = `<img src="${imgSrc}" alt="${course.name}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;" onerror="this.src='../img/image_course/image-course.png'">`;

  // ====================== HIỂN THỊ VIDEO  ======================
  const container = document.getElementById("video-container");
  const videos = Array.isArray(course.videos) ? course.videos : [];

  if (videos.length === 0) {
    container.innerHTML = `<div class="info-curriculum-item" style="text-align:center; color:#999; padding:20px; font-style:italic;">Chưa có bài giảng nào</div>`;
    return;
  }

  videos.forEach((video, i) => {
    const div = document.createElement("div");
    div.className = "info-curriculum-item";

    // Xử lý YouTube
    let playUrl = video.url || "#";
    let isYoutube = false;
    if (
      video.url &&
      (video.url.includes("youtube.com") || video.url.includes("youtu.be"))
    ) {
      isYoutube = true;
      const match = video.url.match(/(?:v=|\/|embed\/)([a-zA-Z0-9_-]{11})/);
      if (match)
        playUrl = `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }

    div.innerHTML = `
      <span class="lesson">${i + 1}</span>
      <span class="title">${video.title || "Bài " + (i + 1)}</span>
    `;

    container.appendChild(div);
  });

  // Nút thanh toán
  document.getElementById("btnwhite")?.addEventListener("click", () => {
    if (!localStorage.getItem("currentUser")) {
      alert("Vui lòng đăng nhập!");
      localStorage.setItem("afterLoginRedirect", location.href);
      location.href = "../../User_header_footer/login.html";
      return;
    }
    localStorage.setItem("checkoutCourse", JSON.stringify(course));
    location.href = "checkout.html";
  });
});
