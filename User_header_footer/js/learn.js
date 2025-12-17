import { UserManager, CourseManager, Comment, CommentManager } from "./object.js";

//LẤY USER HIỆN TẠI

const currentUser = UserManager.getCurrentUserData();
if (!currentUser) {
    document.body.innerHTML = "<h2>Bạn cần đăng nhập để học.</h2>";
    throw new Error("Not logged in");
}

//LẤY KHÓA HỌC

const courseId = localStorage.getItem("selectedCourseId");
const courses = CourseManager.getAll();
const course = courses[courseId];

if (!course) {
    document.body.innerHTML = "<h2>Không tìm thấy khóa học.</h2>";
    throw new Error("Course not found");
}

//KIỂM TRA ĐÃ MUA CHƯA

if (!course.students || !course.students.some(s => s.id === currentUser.id)) {
    document.body.innerHTML = `
        <div style="padding:40px; text-align:center; font-size:20px;">
            <h2>Bạn chưa đăng ký khóa học này</h2>
            <a href="mycourse.html" style="color:blue;">Quay lại khóa học của tôi</a>
        </div>
    `;
    throw new Error("Not enrolled");
}


//DOM ELEMENTS

const sidebar = document.querySelector(".sidebar");
const videoFrame = document.getElementById("video-frame");
const lessonTitleEl = document.getElementById("lesson-title");
const lessonDescEl = document.getElementById("lesson-description");

const commentInput = document.getElementById("comment-input");
const commentSubmit = document.getElementById("comment-submit");
const commentList = document.getElementById("comment-list");

let currentVideoId = null;


//CHUYỂN LINK YOUTUBE

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


//TẠO SIDEBAR

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



//LOAD VIDEO

function loadVideo(videoId) {
    const video = course.videos.find(v => v.id == videoId);
    if (!video) return;

    currentVideoId = String(videoId);

    videoFrame.src = convertToEmbed(video.url);
    lessonTitleEl.textContent = video.title;
    lessonDescEl.textContent = video.description || course.detail || "Không có mô tả";

    document.querySelectorAll(".exercise-list").forEach(el => el.style.display = "none");
    document.getElementById("video-" + videoId).style.display = "block";

    loadComments(videoId);

    document.querySelectorAll(".lesson-item").forEach(item => {
        item.classList.toggle("active", item.getAttribute("data-video") == videoId);
    });
}


//CLICK BÀI HỌC

function setupLessonClick() {
    document.querySelectorAll(".lesson-item").forEach(item => {
        item.addEventListener("click", () => {
            const videoId = item.getAttribute("data-video");
            loadVideo(videoId);
        });
    });
}


//CLICK BÀI TẬP

document.addEventListener("click", e => {
    if (e.target.classList.contains("exercise-btn")) {
        const id = e.target.getAttribute("data-assignment");

        const video = course.videos.find(v => v.assignments.some(a => a.id == id));
        const assignment = video.assignments.find(a => a.id == id);

        alert("Đi đến bài tập: " + assignment.title);
    }
});


//LOAD COMMENT

function loadComments(videoId) {
    commentList.innerHTML = "";

    const list = CommentManager.getByVideo(videoId);

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


//XÓA / BÁO CÁO COMMENT

document.addEventListener("click", e => {
    if (e.target.classList.contains("delete-comment")) {
        const id = Number(e.target.getAttribute("data-id"));
        CommentManager.deleteComment(currentVideoId, id);
        loadComments(currentVideoId);
    }

    if (e.target.classList.contains("report-comment")) {
        alert("Cảm ơn bạn! Bình luận đã được báo cáo.");
    }
});


//THÊM COMMENT

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


// KHỞI CHẠY

function init() {
    renderSidebar();
    setupLessonClick();

    if (course.videos.length > 0) {
        loadVideo(course.videos[0].id);
    }
}

init();
