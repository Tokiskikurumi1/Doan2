// Lấy giá tiền từ localStorage
const price = localStorage.getItem("paymentPrice") || "0";
document.getElementById("payment-price").textContent = price + " VND";

// Tạo mã giao dịch random
function generateTransactionId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000000);
}
document.getElementById("transaction-id").textContent = generateTransactionId();


// Xử lý thanh toán
document.querySelector("button").addEventListener("click", () => {
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const courseId = localStorage.getItem("selectedCourseId");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    alert("Bạn cần đăng nhập trước khi thanh toán");
    return;
  }

  const courseIndex = courses.findIndex(c => String(c.id) === String(courseId));
  if (courseIndex === -1) {
    alert("Không tìm thấy khóa học!");
    return;
  }

  const course = courses[courseIndex];

  if (!Array.isArray(course.students)) {
    course.students = [];
  }

  // Kiểm tra user đã mua chưa
  const alreadyBought = course.students.some(s => s.id === currentUser.id);

  if (!alreadyBought) {
    course.students.push({
      id: currentUser.id,
      name: currentUser.yourname,
      date: new Date().toISOString()
    });
  }

  // Lưu lại
  courses[courseIndex] = course;
  localStorage.setItem("courses", JSON.stringify(courses));

  alert("Thanh toán thành công!");
  window.location.href = "./course-detail.html";
});
