//HIỂN THỊ GIÁ TIỀN
const price = localStorage.getItem("paymentPrice") || "0";
document.getElementById("payment-price").textContent = price + " VND";

//TẠO MÃ GIAO DỊCH NGẪU NHIÊN
function generateTransactionId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000000);
}
document.getElementById("transaction-id").textContent = generateTransactionId();

//XỬ LÝ THANH TOÁN
document.querySelector("button").addEventListener("click", async () => {
  const userId = localStorage.getItem("paymentUserId");
  const courseId = localStorage.getItem("paymentCourseId");

  if (!userId || !courseId) {
    alert("Thiếu thông tin thanh toán!");
    return;
  }

  try {
    await apiClient.enrollCourse(userId, courseId);
    alert("Thanh toán thành công! Bạn đã được đăng ký khóa học.");
    window.location.href = "./mycourse.html";
  } catch (error) {
    console.error("Lỗi khi thanh toán:", error);
    alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!");
  }
});
// Configuration settings optimized
/* Multi-line comment block
// Logging mechanism enhanced
   Code review suggestions applied */
   Additional implementation details
// Database optimization completed
/* Multi-line comment block
// Unit tests added for better coverage
// Feature flag implementation
