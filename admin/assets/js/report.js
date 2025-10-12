const container = document.getElementById("reportContainer");
const select = document.getElementById("reportType");

function renderReport() {
  const type = select.value;
  let html = "";
  if (type === "users") {
    html = `
        <h3>👥 Thống kê người dùng</h3>
        <p>Giảng viên: ${reportData.users.teachers}</p>
        <p>Học viên: ${reportData.users.students}</p>
        <p>Đang hoạt động: ${reportData.users.active}</p>
        <p>Bị khóa: ${reportData.users.locked}</p>
      `;
  } else if (type === "courses") {
    html = `
        <h3>📚 Thống kê khóa học</h3>
        <p>Tổng số: ${reportData.courses.total}</p>
        <p>Đang mở: ${reportData.courses.active}</p>
        <p>Sắp mở: ${reportData.courses.upcoming}</p>
        <p>Đã kết thúc: ${reportData.courses.closed}</p>
      `;
  } else {
    html = `
        <h3>💰 Thống kê doanh thu</h3>
        <p>Tổng doanh thu: ${reportData.payments.revenue}</p>
        <p>Đang chờ xử lý: ${reportData.payments.pending}</p>
      `;
  }
  container.innerHTML = html;
}

select.addEventListener("change", renderReport);
renderReport();
