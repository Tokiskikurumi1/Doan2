// Lấy giá tiền từ localStorage
const price = localStorage.getItem("paymentPrice") || "0";

// Hiển thị giá tiền
document.getElementById("payment-price").textContent = price + " VND";

// Tạo mã giao dịch random
function generateTransactionId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000000);
}

const transactionId = generateTransactionId();

// Hiển thị mã giao dịch
document.getElementById("transaction-id").textContent = transactionId;


document.querySelector("button").addEventListener("click", () => {
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const courseId = localStorage.getItem("selectedCourseId");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    alert("Bạn cần đăng nhập trước khi thanh toán");
    return;
  }

  // Tìm khóa học
  const courseIndex = courses.findIndex(c => String(c.id) === String(courseId));

  if (courseIndex === -1) {
    alert("Không tìm thấy khóa học!");
    return;
  }

  const course = courses[courseIndex];

  // Nếu chưa có students thì tạo mảng
  if (!Array.isArray(course.students)) {
    course.students = [];
  }

  // Kiểm tra xem user đã mua chưa
  const alreadyBought = course.students.some(s => s.id === currentUser.id);

  if (!alreadyBought) {
    course.students.push({
      id: currentUser.id,
      name: currentUser.name,
      date: new Date().toISOString()
    });
  }

  // Lưu lại vào localStorage
  courses[courseIndex] = course;
  localStorage.setItem("courses", JSON.stringify(courses));

  alert("Thanh toán thành công!");
  window.location.href = "./course-detail.html";
});
