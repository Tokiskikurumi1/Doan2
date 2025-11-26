// lấy user từ ID
const currentUserId = localStorage.getItem("currentUser");
const usersObject = JSON.parse(localStorage.getItem("listusers")) || {};
const user = currentUserId ? usersObject[currentUserId] : null;

// lấy số liệu
const courses = JSON.parse(localStorage.getItem("courses")) || [];
const assignments = JSON.parse(localStorage.getItem("assignments")) || [];
const totalCourses = document.getElementById("total-courses");
const totalExercises = document.getElementById("total-exercises");
const titleComback = document.querySelector(".title-comback");

totalCourses.textContent = courses.length;
totalExercises.textContent = assignments.length;
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
