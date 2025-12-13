import { UserManager, CourseManager } from "./object.js";

//HIỂN THỊ GIÁ TIỀN
const price = localStorage.getItem("paymentPrice") || "0";
document.getElementById("payment-price").textContent = price + " VND";

//TẠO MÃ GIAO DỊCH NGẪU NHIÊN

function generateTransactionId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000000);
}
document.getElementById("transaction-id").textContent = generateTransactionId();


//XỬ LÝ THANH TOÁN
document.querySelector("button").addEventListener("click", () => {

  //Lấy user từ currentUserData
  const currentUser = UserManager.getCurrentUserData();
  if (!currentUser) {
    alert("Bạn cần đăng nhập trước khi thanh toán");
    return;
  }

  //Lấy danh sách khóa học từ CourseManager
  const courses = CourseManager.getAll();
  const courseId = localStorage.getItem("selectedCourseId");

  if (!courses[courseId]) {
    alert("Không tìm thấy khóa học!");
    return;
  }

  const course = courses[courseId];

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

  // Lưu lại khóa học
  courses[courseId] = course;
  CourseManager.saveAll(courses);

  alert("Thanh toán thành công!");
  window.location.href = "./course-detail.html";
});
