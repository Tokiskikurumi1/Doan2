import { UserManager, CourseManager } from "./object.js";

//LẤY USER HIỆN TẠI

const currentUser = UserManager.getCurrentUserData();
const courseListEl = document.querySelector(".mycourse-page .course-list");

// Nếu chưa đăng nhập
if (!currentUser) {
    courseListEl.innerHTML = "<p>Bạn cần đăng nhập để xem khóa học.</p>";
    throw new Error("User not logged in");
}


//LẤY DANH SÁCH KHÓA HỌC

// Lấy courses từ CourseManager
const courses = Object.values(CourseManager.getAll()) || [];

// Lọc ra khóa học mà user đã mua
let myCourses = courses.filter(course =>
    Array.isArray(course.students) &&
    course.students.some(s => s.id === currentUser.id)
);


//RENDER KHÓA HỌC

function renderCourses(list) {
    courseListEl.innerHTML = "";

    if (list.length === 0) {
        courseListEl.innerHTML = "<p>Không có khóa học nào.</p>";
        return;
    }

    list.forEach(course => {
        const item = document.createElement("div");
        item.className = "course-item";

        item.innerHTML = `
            <div class="course-item-img" 
                 style="background-image: url('${course.image || "./img/course.png"}')">
            </div>

            <div class="course-item-info">
                <h3>${course.name}</h3>
                <span>${course.detail || "Không có mô tả"}</span>
                <button data-id="${course.id}">Bắt đầu học</button>
            </div>
        `;

        courseListEl.appendChild(item);
    });

    // Sự kiện nút Bắt đầu học
    document.querySelectorAll(".course-item button").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            localStorage.setItem("selectedCourseId", id);
            window.location.href = "./learn.html";
        });
    });
}


//RENDER LẦN ĐẦU

renderCourses(myCourses);


//LỌC & SẮP XẾP 
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
