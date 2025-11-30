// CỐT LÕI: Đọc dữ liệu dạng OBJECT → chuyển thành MẢNG để dùng như cũ
let usersObject = JSON.parse(localStorage.getItem("listusers")) || {};
let allUsers = Object.values(usersObject); // ← Dòng quan trọng nhất!

let allCourses = JSON.parse(localStorage.getItem("courses")) || [];

// Hiển thị số liệu tổng
document.getElementById("userCount").textContent = allUsers.length;
document.getElementById("courseCount").textContent = allCourses.length;

// ... phần còn lại giữ nguyên 100%
function new_user(newUsers) {
  const tableBody = document.getElementById("userTable");
  let html = "";
  for (let i = 0; i < newUsers.length; i++) {
    html += `
      <tr>
        <td>${newUsers[i].yourname || newUsers[i].name || "Chưa có tên"}</td>
        <td>${newUsers[i].email}</td>
        <td>${newUsers[i].created || newUsers[i].date || "Chưa có ngày"}</td>
      </tr>`;
  }
  tableBody.innerHTML = html;
}

// ======================= BIỂU ĐỒ DOANH THU THEO THÁNG  =======================
function updateMonthlyRevenueChart() {
  const boxColumn = document.getElementById("monthlyChart");
  if (!boxColumn) return;

  const bars = boxColumn.querySelectorAll(".chart-serie");

  // Tính doanh thu từng tháng
  const monthlyRevenue = Array(12).fill(0);
  payments.forEach((p) => {
    if (p.status === "Đã thanh toán") {
      const monthIndex = new Date(p.date).getMonth(); // 0 = tháng 1
      monthlyRevenue[monthIndex] += p.amount;
    }
  });

  // Chuẩn cố định: 100 triệu = 100% → 1 triệu = 1%
  const MAX_REVENUE = 100000000; // 100 triệu

  bars.forEach((bar, index) => {
    const revenue = monthlyRevenue[index];

    // Tính %: (doanh thu / 100tr) * 100
    let percent = (revenue / MAX_REVENUE) * 100;

    // Không vượt quá 100%
    percent = Math.min(percent, 100);

    // Áp dụng vào --i (giữ nguyên CSS cũ của mày)
    bar.style.setProperty("--i", percent + "%");

    // Hiển thị số tiền (chỉ khi có doanh thu)
    let displayText = "";
    if (revenue >= 1000000) {
      displayText = (revenue / 1000000).toFixed(1) + "tr";
    } else if (revenue >= 1000) {
      displayText = (revenue / 1000).toFixed(0) + "k";
    } else if (revenue > 0) {
      displayText = revenue.toLocaleString() + "đ";
    }

    const title = bar.querySelector(".column-title");
    if (title) {
      if (revenue > 0) {
        title.textContent = displayText;
        title.style.opacity = "1";
      } else {
        title.textContent = "";
        title.style.opacity = "0";
      }
    }
  });
}

updateMonthlyRevenueChart();

// Hiển thị (mới nhất lên đầu)
new_user(allUsers.slice().reverse());
