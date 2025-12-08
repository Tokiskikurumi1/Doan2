// lấy dữ liệu từ localStorage
const courses = JSON.parse(localStorage.getItem("courses")) || [];
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const courseListEl = document.querySelector(".course-list");
const searchInput = document.querySelector(".search input");
const levelSelect = document.getElementById("level");
const sortSelect = document.getElementById("sort");

// Nếu chưa đăng nhập
if (!currentUser) {
    courseListEl.innerHTML = "<p>Bạn cần đăng nhập để xem khóa học.</p>";
    throw new Error("User not logged in");
}

//LỌC KHÓA HỌC USER ĐÃ ĐĂNG KÝ 
let myCourses = courses.filter(course =>
    Array.isArray(course.students) &&
    course.students.some(s => s.id === currentUser.id)
);

// render khóa học
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
            <div class="course-item-img" style="background-image: url('${course.image || "./img/course.png"}')"></div>
            <div class="course-item-info">
                <h3>${course.name}</h3>
                <span>${course.detail || "Không có mô tả"}</span>
                <button data-id="${course.id}">Bắt đầu học</button>
            </div>
        `;

        courseListEl.appendChild(item);
    });

    // Gán sự kiện cho nút Bắt đầu học
    document.querySelectorAll(".course-item button").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            localStorage.setItem("selectedCourseId", id);
            window.location.href = "./course-detail.html";
        });
    });
}

// Render lần đầu
renderCourses(myCourses);

// tìm kiếm
searchInput.addEventListener("input", () => {
    applyFilters();
});

// lọc theio trình độ
levelSelect.addEventListener("change", () => {
    applyFilters();
});

// sx
sortSelect.addEventListener("change", () => {
    applyFilters();
});

// lọc
function applyFilters() {
    let filtered = [...myCourses];

    // Tìm kiếm
    const keyword = searchInput.value.toLowerCase();
    filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(keyword) ||
        (c.detail && c.detail.toLowerCase().includes(keyword))
    );

    // Lọc theo trình độ
    const level = levelSelect.value;
    if (level !== "all") {
        filtered = filtered.filter(c => c.type.toLowerCase() === level);
    }

    // Sắp xếp
    const sort = sortSelect.value;
    if (sort === "az") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "za") {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "newest") {
        filtered.sort((a, b) => b.id - a.id);
    } else if (sort === "oldest") {
        filtered.sort((a, b) => a.id - b.id);
    }

    renderCourses(filtered);
}
