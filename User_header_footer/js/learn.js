import { UserManager, CourseManager, Comment, CommentManager } from "./object.js";


const currentUser = UserManager.getCurrentUserData();
if (!currentUser) {
    document.body.innerHTML = "<h2>Bạn cần đăng nhập để học.</h2>";
    throw new Error("Not logged in");
}


const courseId = localStorage.getItem("selectedCourseId");
const courses = CourseManager.getAll();
const course = courses[courseId];

if (!course) {
    document.body.innerHTML = "<h2>Không tìm thấy khóa học.</h2>";
    throw new Error("Course not found");
}

if (!course.students || !course.students.some(s => String(s.id) === String(currentUser.id))) {
    document.body.innerHTML = `
        <div style="padding:40px; text-align:center; font-size:20px;">
            <h2>Bạn chưa đăng ký khóa học này</h2>
            <a href="mycourse.html" style="color:blue;">Quay lại khóa học của tôi</a>
        </div>
    `;
    throw new Error("Not enrolled");
}


const sidebar = document.querySelector(".sidebar");
const videoFrame = document.getElementById("video-frame");
const lessonTitleEl = document.getElementById("lesson-title");
const lessonDescEl = document.getElementById("lesson-description");

const commentInput = document.getElementById("comment-input");
const commentSubmit = document.getElementById("comment-submit");
const commentList = document.getElementById("comment-list");

let currentVideoId = null;



function convertToEmbed(url) {
    if (!url) return "";

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


function renderSidebar() {
    sidebar.innerHTML = `<h2>Danh sách bài học</h2>`;

    if (!Array.isArray(course.videos) || course.videos.length === 0) {
        sidebar.innerHTML += `<p>Chưa có video nào trong khóa học.</p>`;
        return;
    }

    course.videos.forEach(video => {
        const totalAssignments = video.assignments?.length || 0;

        // Item bài học
        sidebar.innerHTML += `
            <div class="lesson-item" data-video="${video.id}">
                <div class="lesson-title">
                    <span class="lesson-icon">🎬</span>
                    <span>${video.title}</span>
                </div>
                <span class="progress">0/${totalAssignments}</span>
            </div>
        `;

        // Danh sách bài tập
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



function loadVideo(videoId) {
    const video = course.videos.find(v => String(v.id) === String(videoId));
    if (!video) return;

    currentVideoId = String(videoId);

    videoFrame.src = convertToEmbed(video.url);
    lessonTitleEl.textContent = video.title || "Bài học";
    lessonDescEl.textContent = video.description || course.detail || "Không có mô tả";

    // Ẩn toàn bộ danh sách bài tập, chỉ hiện bài tập của video hiện tại
    document.querySelectorAll(".exercise-list").forEach(el => {
        el.style.display = "none";
    });
    const currentExerciseList = document.getElementById("video-" + videoId);
    if (currentExerciseList) currentExerciseList.style.display = "block";

    // Load comment
    loadComments(videoId);

    // Đổi trạng thái active cho bài học
    document.querySelectorAll(".lesson-item").forEach(item => {
        item.classList.toggle("active", item.getAttribute("data-video") == videoId);
    });
}



function setupLessonClick() {
    document.querySelectorAll(".lesson-item").forEach(item => {
        item.addEventListener("click", () => {
            const videoId = item.getAttribute("data-video");
            loadVideo(videoId);
        });
    });
}


document.addEventListener("click", e => {
    if (e.target.classList.contains("exercise-btn")) {
        const id = e.target.getAttribute("data-assignment");
        if (!id) return;

        const video = course.videos.find(v =>
            Array.isArray(v.assignments) && v.assignments.some(a => String(a.id) === String(id))
        );
        if (!video) {
            alert("Không tìm thấy video chứa bài tập này.");
            return;
        }

        const assignment = video.assignments.find(a => String(a.id) === String(id));
        if (!assignment) {
            alert("Không tìm thấy bài tập.");
            return;
        }

        // LƯU ID BÀI TẬP ĐỂ QUIZZ.JS LẤY
        localStorage.setItem("doingAssignmentId", assignment.id);

        // CHUYỂN SANG TRANG QUIZZ
        window.location.href = "quizz.html";
    }
});


function loadComments(videoId) {
    commentList.innerHTML = "";

    const list = CommentManager.getByVideo(videoId);

    if (!Array.isArray(list) || list.length === 0) {
        commentList.innerHTML = `<p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>`;
        return;
    }

    list.forEach(c => {
        const isOwner = String(c.userId) === String(currentUser.id);

        const item = document.createElement("div");
        item.classList.add("comment-item");

        item.innerHTML = `
            <div class="comment-avatar">
                <img src="${c.avatar || "./img/img_GUI/user.png"}" alt="avatar">
            </div>

            <div class="comment-content">
                <div class="comment-text">
                    <strong>${c.name}</strong>
                    <p>${c.text}</p>
                    <span class="comment-time">${c.time}</span>
                </div>
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
    if (e.target.classList.contains("delete-comment")) {
        const id = Number(e.target.getAttribute("data-id"));
        if (!currentVideoId) return;

        CommentManager.deleteComment(currentVideoId, id);
        loadComments(currentVideoId);
    }

    if (e.target.classList.contains("report-comment")) {
        alert("Cảm ơn bạn! Bình luận đã được báo cáo.");
    }
});

if (commentSubmit) {
    commentSubmit.addEventListener("click", () => {
        const text = commentInput.value.trim();
        if (!text) return alert("Vui lòng nhập bình luận");

        if (!currentVideoId) return alert("Hãy chọn bài học trước");

        const newComment = new Comment({
            videoId: currentVideoId,
            userId: currentUser.id,
            name: currentUser.yourname,
            avatar: currentUser.avatar || "./img/img_GUI/user.png",
            text
        });

        CommentManager.addComment(newComment);

        commentInput.value = "";
        loadComments(currentVideoId);
    });
}
// khởi chạy

function init() {
    renderSidebar();
    setupLessonClick();

    if (Array.isArray(course.videos) && course.videos.length > 0) {
        loadVideo(course.videos[0].id);
    }
}

init();
