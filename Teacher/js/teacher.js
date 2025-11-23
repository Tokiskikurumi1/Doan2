// SỬA TẠI ĐÂY – lấy user từ ID
const currentUserId = localStorage.getItem("currentUser");
const usersObject = JSON.parse(localStorage.getItem("listusers")) || {};
const user = currentUserId ? usersObject[currentUserId] : null;

const titleComback = document.querySelector(".title-comback");

function render() {
  if (!user) {
    titleComback.innerHTML = "<h2>Đang tải...</h2>";
    setTimeout(() => {
      window.location.href = "../User_header_footer/login.html";
    }, 1000);
    return;
  }

  const hoTen = user.yourname || user.name || "Bạn";
  const prefix = user.role === "teacher" ? "GV." : "HV.";

  titleComback.innerHTML = `
    <h2>
      Chào mừng trở lại,
      <span style="color: var(--blue-)">${prefix} ${hoTen}</span>!
    </h2>
    <p style="color: var(--grey)">
      Hôm nay: ${new Date().toLocaleDateString("vi-VN")}
    </p>
  `;
}

render();
