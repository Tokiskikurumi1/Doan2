const btnPay = document.querySelector(".info-price button");

//================HÀM KIỂM TRA LOGIN=========================
function isLoggedIn() {
  const user = localStorage.getItem("savedUsername");
  return !!user; // trả về true nếu có user
}
// Lấy dữ liệu khóa học đã được lưu trong localStorage
const data = localStorage.getItem("selectedCourse");

if (data) {
  const course = JSON.parse(data);

  // --- ĐỔ DỮ LIỆU RA GIAO DIỆN ---

  // Tên khóa học
  const title = document.querySelector(".title");
  title.textContent = course.name;

  // Ảnh khóa học
  const imgDiv = document.querySelector(".img");
  imgDiv.innerHTML = `<img src="${course.image_url}" alt="${course.name}" />`;

  // Giá tiền
  const price = document.querySelector(".price");
  price.textContent = course.price.toLocaleString() + "đ";

  // Mô tả
  const desc = document.querySelector(".info-description p");
  desc.textContent = course.description;

  // Các phần còn lại
  const instructor = document.querySelector(".info-instructor .name");
  if (instructor) instructor.textContent = "Giảng viên: Đang cập nhật";

  const level = document.querySelector(".info-level .level");
  if (level) level.textContent = "Tất cả trình độ";

  const time = document.querySelector(".info-duration .time");
  if (time) time.textContent = "Tùy theo tiến độ học viên";
} else {
  console.warn("Không có dữ liệu khóa học trong localStorage!");
}

btnPay.addEventListener("click", () => {
  if (!isLoggedIn()) {
    alert("Bạn chưa đăng nhập!");
  } else {
  }
});
