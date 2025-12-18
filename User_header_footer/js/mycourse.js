import { UserManager, CourseManager } from "./object.js";
// LẤY USER HIỆN TẠI
const currentUser = UserManager.getCurrentUserData();
const courseListEl = document.querySelector(".mycourse-page .course-list");

if (!currentUser) {
    courseListEl.innerHTML = "<p>Bạn cần đăng nhập để xem khóa học.</p>";
    throw new Error("User not logged in");
}

// LẤY DANH SÁCH KHÓA HỌC
const courses = Object.values(CourseManager.getAll()) || [];

// Lọc khóa học mà user đã mua
let myCourses = courses.filter(course =>
    Array.isArray(course.students) &&
    course.students.some(s => s.id === currentUser.id)
);

// TÍNH TIẾN ĐỘ KHÓA HỌC
function getCourseProgress(course) {
    if (!Array.isArray(course.videos) || course.videos.length === 0) return 0;

    const done = course.videos.filter(v => v.status === "Hoàn thành").length;
    return Math.round((done / course.videos.length) * 100);
}

// RENDER KHÓA HỌC (UI MỚI)
function renderCourses(list) {
    courseListEl.innerHTML = "";

    if (list.length === 0) {
        courseListEl.innerHTML = "<p>Không có khóa học nào.</p>";
        return;
    }

    list.forEach(course => {
        const progress = getCourseProgress(course);

        const item = document.createElement("div");
        item.className = "course-card";

        item.innerHTML = `
            <div class="course-thumb" 
                 style="background-image: url('${course.image || "../img/image_course/imagecourse.png"}')">
            </div>

            <div class="course-content">
                <h3 class="course-title">Khóa học: ${course.name}</h3>
                <p class="course-author">Giảng viên: ${course.teacherName}</p>


                <div class="progress-box">
                    <div class="progress-label">Tiến độ: ${progress}%</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>

                <div class="course-footer">
                    <span class="course-status">Đang học</span>
                    <button class="btn-start btnwhite" data-id="${course.id}">Tiếp tục</button>
                </div>
            </div>
        `;
        courseListEl.appendChild(item);
    });

    // Sự kiện nút Tiếp tục
    document.querySelectorAll(".btn-start").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            localStorage.setItem("selectedCourseId", id);
            window.location.href = "./learn.html";
        });
    });
}

// RENDER LẦN ĐẦU
renderCourses(myCourses);

// LỌC & SẮP XẾP
const levelSelect = document.querySelector(".mycourse-page #level");
const sortSelect = document.querySelector(".mycourse-page #sort");

levelSelect.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

function applyFilters() {
    let filtered = [...myCourses];

    // Lọc theo trình độ
    const level = levelSelect.value;
    if (level !== "all") {
        filtered = filtered.filter(c => c.type.toLowerCase() === level);
    }

    // Sắp xếp
    const sort = sortSelect.value;
    if (sort === "az") filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") filtered.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === "newest") filtered.sort((a, b) => Number(b.id) - Number(a.id));
    if (sort === "oldest") filtered.sort((a, b) => Number(a.id) - Number(b.id));

    renderCourses(filtered);
}