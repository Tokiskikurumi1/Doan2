// Hiển thị số liệu tổng
document.getElementById("userCount").textContent = stats.users;
document.getElementById("courseCount").textContent = stats.courses;
document.getElementById("sessionCount").textContent = stats.sessions;
document.getElementById("revenue").textContent = stats.revenue.toLocaleString();

function new_user(newUsers) {
  const tableBody = document.getElementById("userTable");
  let newuser = "";
  for (let i = 0; i < newUsers.length; i++) {
    newuser += `
      <tr>
        <td>${newUsers[i].name}</td>
        <td>${newUsers[i].email}</td>
        <td>${newUsers[i].date}</td>
      </tr>
    `;
  }
  tableBody.innerHTML = newuser;
}

new_user(newUsers);
// Vẽ biểu đồ doanh thu thuần JS
const canvas = document.getElementById("revenueChart");
const ctx = canvas.getContext("2d");
const maxRevenue = Math.max(...revenueData);
const barWidth = 25;
const gap = 15;
const startX = 40;
const baseY = 180;

revenueData.forEach((value, i) => {
  const barHeight = (value / maxRevenue) * 150;
  ctx.fillStyle = "#2b7bff";
  ctx.fillRect(
    startX + i * (barWidth + gap),
    baseY - barHeight,
    barWidth,
    barHeight
  );
  ctx.fillStyle = "#333";
  ctx.font = "12px Arial";
  ctx.fillText(value, startX + i * (barWidth + gap), baseY - barHeight - 5);
});

// Vẽ trục
ctx.strokeStyle = "#999";
ctx.beginPath();
ctx.moveTo(30, 10);
ctx.lineTo(30, baseY);
ctx.lineTo(420, baseY);
ctx.stroke();
