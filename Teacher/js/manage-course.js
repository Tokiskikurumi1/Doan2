// ========================== LẤY THÔNG TIN GIẢNG VIÊN ĐANG ĐĂNG NHẬP ==========================
const currentUserId = localStorage.getItem("currentUser"); // chỉ là ID (chuỗi số)
const allUsersData = JSON.parse(localStorage.getItem("listusers")) || {};
const currentUser = currentUserId ? allUsersData[currentUserId] : null;

// === BẢO VỆ TRANG: Nếu chưa đăng nhập HOẶC không phải giáo viên → đá về login ===
if (!currentUser || currentUser.role !== "teacher") {
  alert("Bạn không có quyền truy cập trang này!");
  window.location.href = "../../User_header_footer/login.html";
}
// ========================== LOAD DATA ==========================
let courses = JSON.parse(localStorage.getItem("courses")) || [];

const courseListEl = document.getElementById("course-list");
const createModal = document.getElementById("create-course-modal");
const searchBar = document.querySelector(".search-bar");
const fromDateEl = document.getElementById("fromDate");
const toDateEl = document.getElementById("toDate");
const roleFilter = document.querySelector(".role_course");
const arrangeFilter = document.querySelector(".arrange");

// ========================== TẠO KHÓA HỌC ==========================
document.getElementById("new-course").onclick = () => {
  createModal.style.display = "flex";
};

document.getElementById("cancel-create").onclick = () => {
  createModal.style.display = "none";
};

// Upload ảnh
let uploadedImageBase64 = null;

document.getElementById("course-image").onchange = function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => (uploadedImageBase64 = reader.result);
  reader.readAsDataURL(file);
};

// ======================== THÊM khóa học ========================
document.getElementById("create-course-form").onsubmit = function (e) {
  e.preventDefault();

  const name = document.getElementById("course-name").value.trim();
  const type = document.getElementById("course-type").value;
  const status = document.getElementById("course-status").value;
  const price = document.getElementById("course-price").value;
  const detail = document.getElementById("course-detail").value;

  const course = {
    id: Date.now(),
    teacherId: currentUser.id,
    teacherName: currentUser.yourname,
    name,
    type,
    status,
    price,
    detail,
    date: new Date().toISOString().split("T")[0],
    image: uploadedImageBase64 || "./img/course.png",
    videos: [],
    students: [],
  };

  courses.push(course);
  localStorage.setItem("courses", JSON.stringify(courses));

  uploadedImageBase64 = null;
  renderCourses();
  createModal.style.display = "none";
  this.reset();
};

// ========================== RENDER COURSES  ==========================
function renderCourses() {
  courseListEl.innerHTML = "";

  // ← CHỈ LỌC KHÓA HỌC CỦA GIẢNG VIÊN ĐANG ĐĂNG NHẬP
  let filtered = courses.filter((c) => c.teacherId === currentUser.id);

  // --- SEARCH ---
  const keyword = searchBar.value.toLowerCase();
  if (keyword) {
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(keyword));
  }

  // --- DATE FILTER ---
  if (fromDateEl.value)
    filtered = filtered.filter((c) => c.date >= fromDateEl.value);
  if (toDateEl.value)
    filtered = filtered.filter((c) => c.date <= toDateEl.value);

  // --- ROLE FILTER (giữ nguyên logic cũ của mày) ---
  const role = roleFilter.value;
  if (role === "published")
    filtered = filtered.filter((c) => c.status === "completed");
  else if (role === "draft")
    filtered = filtered.filter((c) => c.status === "incomplete");
  else if (
    ["TOEIC", "IELTS", "Combo", "BEGINNER", "COMBO-4", "COMBO-2"].includes(role)
  )
    filtered = filtered.filter((c) => c.type === role);

  // --- ARRANGE ---
  const arrange = arrangeFilter.value;
  if (arrange === "new")
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  else if (arrange === "old")
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  else if (arrange === "AtoZ")
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (arrange === "ZtoA")
    filtered.sort((a, b) => b.name.localeCompare(a.name));

  if (filtered.length === 0) {
    courseListEl.style.display = "flex";
    courseListEl.style.justifyContent = "center";
    courseListEl.innerHTML = `
            <div class="no-course" style="padding:20px; font-size:20px; color:var(--grey);">
                Không có khóa học nào.
            </div>
        `;
    return;
  }

  courseListEl.style.display = "grid";

  // --- RENDER ---
  filtered.forEach((course) => {
    const div = document.createElement("div");
    div.className = "item-course";

    div.innerHTML = `
            <div class="item-course-panel">
                <div class="image-course">
                    <img src="${course.image}" alt="Khóa học" />
                </div>
                <div class="course-info">
                    <div class="name-course">${course.name}</div>

                    <div class="date-and-number">
                        <div class="date-make">Ngày tạo: ${course.date}</div>
                        <div class="number-of-student">0 học viên</div>
                    </div>

                    <hr />

                    <div class="status-course">
                        <div class="status">
                            ${
                              course.status === "completed"
                                ? "Đã hoàn thành"
                                : "Chưa hoàn thành"
                            }
                        </div>
                        <button class="delete-btn">Xóa</button>
                    </div>
                </div>
            </div>
        `;

    // Mở chi tiết
    div.querySelector(".item-course-panel").onclick = (e) => {
      if (e.target.classList.contains("delete-btn")) return;
      localStorage.setItem("selectedCourseId", course.id);
      window.location.href = "detail-course.html";
    };

    // XÓA
    div.querySelector(".delete-btn").onclick = () => {
      if (!confirm("Bạn có chắc muốn xóa khóa học này?")) return;
      courses = courses.filter((c) => c.id !== course.id);
      localStorage.setItem("courses", JSON.stringify(courses));
      renderCourses();
    };

    courseListEl.appendChild(div);
  });
}

// ========================== LISTENERS  ==========================
searchBar.oninput = renderCourses;
document.querySelector(".apply").onclick = renderCourses;
roleFilter.onchange = renderCourses;
arrangeFilter.onchange = renderCourses;

// Gọi lần đầu
renderCourses();
