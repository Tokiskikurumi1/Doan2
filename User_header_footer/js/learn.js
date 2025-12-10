

// Lấy user
const currentUserId = localStorage.getItem("currentUser");
const users = JSON.parse(localStorage.getItem("listusers")) || {};
const currentUser = users[currentUserId];

// Lấy courses 
const coursesObj = JSON.parse(localStorage.getItem("courses")) || {};
const courses = Object.values(coursesObj);

// Lấy comment
let comments = JSON.parse(localStorage.getItem("comments")) || {};

// Lấy ID khóa học đang học
const courseId = localStorage.getItem("selectedCourseId");

// ktra đăng nhập

if (!currentUser) {
    document.body.innerHTML = "<h2>Bạn cần đăng nhập để học.</h2>";
    throw new Error("Not logged in");
}

// tìm khóa học

const course = courses.find(c => c.id == courseId);

if (!course) {
    document.body.innerHTML = "<h2>Không tìm thấy khóa học.</h2>";
    throw new Error("Course not found");
}

// ktra dki chưa

if (!course.students || !course.students.some(s => s.id === currentUser.id)) {
    document.body.innerHTML = `
        <div style="padding:40px; text-align:center; font-size:20px;">
            <h2>Bạn chưa đăng ký khóa học này</h2>
            <a href="mycourse.html" style="color:blue;">Quay lại khóa học của tôi</a>
        </div>
    `;
    throw new Error("Not enrolled");
}

// dom elements

const sidebar = document.querySelector(".sidebar");
const videoFrame = document.getElementById("video-frame");
const lessonTitleEl = document.getElementById("lesson-title");
const lessonDescEl = document.getElementById("lesson-description");

const commentInput = document.getElementById("comment-input");
const commentSubmit = document.getElementById("comment-submit");
const commentList = document.getElementById("comment-list");

let currentVideoId = null;

// chuyển link youtube thành embed

function convertToEmbed(url) {
    if (url.includes("youtu.be")) {
        const id = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${id}`;
    }

    if (url.includes("watch?v=")) {
        const id = url.split("watch?v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${id}`;
    }

    return url;
}

// tạo sidebar
function renderSidebar() {
    sidebar.innerHTML = `<h2>Danh sách bài học</h2>`;

    course.videos.forEach(video => {
        const totalAssignments = video.assignments?.length || 0;

        sidebar.innerHTML += `
            <div class="lesson-item" data-video="${video.id}">
                <div class="lesson-title">
                    <span class="lesson-icon">🎬</span>
                    <span>${video.title}</span>
                </div>
                <span class="progress">0/${totalAssignments}</span>
            </div>
        `;

        let exercisesHtml = "";

        if (video.assignments?.length > 0) {
            exercisesHtml = video.assignments.map(a => `
                <div class="exercise-item">
                    <div class="exercise-left">
                        <span>${a.title}</span>
                        <span class="exercise-time">${a.duration || 0} phút</span>
                    </div>
                    <button class="exercise-btn" data-assignment="${a.id}">Làm bài</button>
                </div>
            `).join("");
        }

        sidebar.innerHTML += `
            <div class="exercise-list" id="video-${video.id}" style="display:none;">
                ${exercisesHtml}
            </div>
        `;
    });
}

//load video

function loadVideo(videoId) {
    const video = course.videos.find(v => v.id == videoId);
    if (!video) return;

    currentVideoId = String(videoId);

    videoFrame.src = convertToEmbed(video.url);
    lessonTitleEl.textContent = video.title;
    lessonDescEl.textContent = video.description || course.detail || "Không có mô tả";

    // Hiện đúng bài tập
    document.querySelectorAll(".exercise-list").forEach(el => el.style.display = "none");
    document.getElementById("video-" + videoId).style.display = "block";

    // Load bình luận
    loadComments(videoId);

    // Active bài học
    document.querySelectorAll(".lesson-item").forEach(item => {
        item.classList.toggle("active", item.getAttribute("data-video") == videoId);
    });
}

// click bài học

function setupLessonClick() {
    document.querySelectorAll(".lesson-item").forEach(item => {
        item.addEventListener("click", () => {
            const videoId = item.getAttribute("data-video");
            loadVideo(videoId);
        });
    });
}

// click bài tập

document.addEventListener("click", e => {
    if (e.target.classList.contains("exercise-btn")) {
        const id = e.target.getAttribute("data-assignment");

        const video = course.videos.find(v => v.assignments.some(a => a.id == id));
        const assignment = video.assignments.find(a => a.id == id);

        alert("Đi đến bài tập: " + assignment.title);
    }
});

// load comments

function loadComments(videoId) {
    commentList.innerHTML = "";

    const list = comments[videoId] || [];

    list.forEach(c => {
        const isOwner = c.userId === currentUser.id;

        const item = document.createElement("div");
        item.classList.add("comment-item");

        item.innerHTML = `
            <div class="comment-avatar">
                <img src="${c.avatar}" alt="avatar">
            </div>

            <div class="comment-content">
                <strong>${c.name}</strong>
                <p>${c.text}</p>
                <span class="comment-time">${c.time}</span>

                <div class="comment-actions">
                    ${
                        isOwner
                        ? `<button class="delete-comment" data-id="${c.id}">Xóa</button>`
                        : `<button class="report-comment" data-id="${c.id}">Báo cáo</button>`
                    }
                </div>
            </div>
        `;

        commentList.appendChild(item);
    });
}


document.addEventListener("click", e => {
    // XÓA
    if (e.target.classList.contains("delete-comment")) {
        const id = Number(e.target.getAttribute("data-id"));

        comments[currentVideoId] = comments[currentVideoId].filter(c => c.id !== id);
        localStorage.setItem("comments", JSON.stringify(comments));

        loadComments(currentVideoId);
        return;
    }

    // BÁO CÁO
    if (e.target.classList.contains("report-comment")) {
        alert("Cảm ơn bạn! Bình luận đã được báo cáo.");
        return;
    }
});



commentSubmit.addEventListener("click", () => {
    const text = commentInput.value.trim();
    if (!text) return alert("Vui lòng nhập bình luận");

    if (!currentVideoId) return alert("Hãy chọn bài học trước");

    const newComment = {
        id: Date.now(),
        userId: currentUser.id,
        name: currentUser.yourname || "Người dùng",
        avatar: currentUser.avatar || "./img/img_GUI/user.png",
        text,
        time: new Date().toLocaleString("vi-VN")
    };

    if (!comments[currentVideoId]) comments[currentVideoId] = [];
    comments[currentVideoId].push(newComment);

    localStorage.setItem("comments", JSON.stringify(comments));

    commentInput.value = "";
    loadComments(currentVideoId);
});


function init() {
    renderSidebar();
    setupLessonClick();

    if (course.videos.length > 0) {
        loadVideo(course.videos[0].id);
    }
}

init();
