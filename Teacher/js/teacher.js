const user = JSON.parse(localStorage.getItem("currentUser"));

const titleComback = document.querySelector(".title-comback");

function render() {
  // BẮT BUỘC PHẢI KIỂM TRA USER CÓ TỒN TẠI KHÔNG
  if (!user) {
    titleComback.innerHTML = "<h2>Đang tải...</h2>";
    // Nếu không có user → quay lại login sau 1 giây
    setTimeout(() => {
      window.location.href = "../Auth/login.html";
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
