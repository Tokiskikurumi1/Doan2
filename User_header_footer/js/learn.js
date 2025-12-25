import { apiClient, UserManager, CourseManager, Comment, CommentManager } from "./object.js";


const currentUser = UserManager.getCurrentUserData();
if (!currentUser) {
    document.body.innerHTML = "<h2>Bạn cần đăng nhập để học.</h2>";
    throw new Error("Not logged in");
}


const courseId = localStorage.getItem("selectedCourseId");
let course = null;

(async () => {
  try {
    course = await apiClient.getCourseDetails(courseId);
    if (!course) {
      document.body.innerHTML = "<h2>Không tìm thấy khóa học.</h2>";
      throw new Error("Course not found");
    }

    // Check if user is enrolled
    const enrolledCourses = await apiClient.getEnrolledCourses(currentUser.userID);
    const isEnrolled = enrolledCourses.some(c => String(c.courseID) === String(courseId));

    if (!isEnrolled) {
      document.body.innerHTML = `
        <div style="padding:40px; text-align:center; font-size:20px;">
          <h2>Bạn chưa đăng ký khóa học này</h2>
          <a href="mycourse.html" style="color:blue;">Quay lại khóa học của tôi</a>
        </div>
      `;
      throw new Error("Not enrolled");
    }

    // Initialize the learning interface after course data is loaded
    init();

  } catch (error) {
    console.error("Failed to load course:", error);
    document.body.innerHTML = "<h2>Lỗi khi tải khóa học.</h2>";
  }
})();


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

    if (!course || !Array.isArray(course.videos) || course.videos.length === 0) {
        sidebar.innerHTML += `<p>Chưa có video nào trong khóa học.</p>`;
        return;
    }

    course.videos.forEach(video => {
        // Get assignments for this video
        const videoAssignments = course.assignments?.filter(a => a.videoID === video.videoID) || [];
        const totalAssignments = videoAssignments.length;

        // Item bài học
        sidebar.innerHTML += `
            <div class="lesson-item" data-video="${video.videoID}">
                <div class="lesson-title">
                    <span class="lesson-icon">🎬</span>
                    <span>${video.videoName}</span>
                </div>
                <span class="progress">0/${totalAssignments}</span>
            </div>
        `;

        // Danh sách bài tập
        let exercisesHtml = "";

        if (videoAssignments.length > 0) {
            exercisesHtml = videoAssignments.map(a => {
                return `
                <div class="exercise-item">
                    <div class="exercise-left">
                        <span>${a.assignmentName}</span>
                        <span class="exercise-time">${a.assignmentDuration || 0} phút</span>
                    </div>
                    <button class="exercise-btn" data-assignment="${a.assignmentID}">Làm bài</button>
                </div>
            `;
            }).join("");
        }

        sidebar.innerHTML += `
            <div class="exercise-list" id="video-${video.videoID}" style="display:none;">
                ${exercisesHtml}
            </div>
        `;
    });
}



function loadVideo(videoId) {
    const video = course.videos.find(v => String(v.videoID) === String(videoId));
    if (!video) return;

    currentVideoId = String(videoId);

    videoFrame.src = convertToEmbed(video.videoURL);
    lessonTitleEl.textContent = video.videoName || "Bài học";
    lessonDescEl.textContent = course.courseDes || "Không có mô tả";

    // Ẩn toàn bộ danh sách bài tập, chỉ hiện bài tập của video hiện tại
    document.querySelectorAll(".exercise-list").forEach(el => {
        el.style.display = "none";
    });
    const currentExerciseList = document.getElementById("video-" + videoId);
    if (currentExerciseList) currentExerciseList.style.display = "block";

    // Load comment
    loadComments(videoId);

    // Load submission history
    loadSubmissionHistory(videoId);

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

        const assignment = course.assignments?.find(a => String(a.assignmentID) === String(id));
        if (!assignment) {
            alert("Không tìm thấy bài tập.");
            return;
        }

        // LƯU ID BÀI TẬP ĐỂ QUIZZ.JS LẤY
        localStorage.setItem("doingAssignmentId", assignment.assignmentID);

        // CHUYỂN SANG TRANG QUIZZ
        window.location.href = "quizz.html";
    }
});


async function loadComments(videoId) {
    commentList.innerHTML = "";

    try {
        const response = await apiClient.request(`/api/student/comments/video/${videoId}`);
        console.log("API response:", response);
        const list = response || [];

        if (!Array.isArray(list) || list.length === 0) {
            commentList.innerHTML = `<p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>`;
            return;
        }

        list.forEach(c => {
            console.log("Comment object:", c);
            const isOwner = String(c.userID) === String(currentUser.userID);

            const item = document.createElement("div");
            item.classList.add("comment-item");

            item.innerHTML = `
                <div class="comment-avatar">
                    <img src="./img/img_GUI/user.png" alt="avatar">
                </div>

                <div class="comment-content">
                    <div class="comment-text">
                        <strong>${c.userName || 'undefined'}</strong>
                        <p>${c.commentText || 'undefined'}</p>
                        <span class="comment-time">${c.commentTime ? new Date(c.commentTime).toLocaleString('vi-VN') : 'Invalid Date'}</span>
                    </div>
                    <div class="comment-actions">
                        ${
                            isOwner
                            ? `<button class="delete-comment" data-id="${c.commentID}">Xóa</button>`
                            : `<button class="report-comment" data-id="${c.commentID}">Báo cáo</button>`
                        }
                    </div>
                </div>
            `;

            commentList.appendChild(item);
        });
    } catch (error) {
        console.error("Failed to load comments:", error);
        commentList.innerHTML = `<p>Lỗi khi tải bình luận.</p>`;
    }
}


document.addEventListener("click", async e => {
    if (e.target.classList.contains("delete-comment")) {
        const id = e.target.getAttribute("data-id");
        if (!currentVideoId) return;

        try {
            await apiClient.deleteComment(id, currentUser.userID);

            // Reload course to get updated comments
            course = await apiClient.getCourseDetails(courseId);

            loadComments(currentVideoId);
        } catch (error) {
            console.error("Failed to delete comment:", error);
            alert("Lỗi khi xóa bình luận");
        }
    }

    if (e.target.classList.contains("report-comment")) {
        alert("Cảm ơn bạn! Bình luận đã được báo cáo.");
    }
});


if (commentSubmit) {
    commentSubmit.addEventListener("click", async () => {
        const text = commentInput.value.trim();
        if (!text) return alert("Vui lòng nhập bình luận");

        if (!currentVideoId) return alert("Hãy chọn bài học trước");

        try {
            await apiClient.addComment({
                VideoId: currentVideoId,
                UserId: currentUser.userID,
                CommentText: text
            });

            commentInput.value = "";
            loadComments(currentVideoId);
        } catch (error) {
            console.error("Failed to add comment:", error);
            alert("Lỗi khi thêm bình luận");
        }
    });
}

async function loadSubmissionHistory(videoId) {
    const submissionBody = document.getElementById("submissionBody");
    submissionBody.innerHTML = "";

    try {
        // Get scores for current user
        const scores = await apiClient.request(`/api/student/scores/${currentUser.userID}`);

        // Get assignments for current video
        const videoAssignments = course.assignments?.filter(a => String(a.videoID) === String(videoId)) || [];

        // Filter scores by assignments in current video
        const videoScores = scores.filter(score =>
            videoAssignments.some(assignment => String(assignment.assignmentID) === String(score.assignmentID))
        );

        if (videoScores.length === 0) {
            submissionBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Chưa có lịch sử nộp bài</td></tr>`;
            return;
        }

        // Sort by submission time (newest first)
        videoScores.sort((a, b) => new Date(b.date) - new Date(a.date));

        videoScores.forEach((score, index) => {
            const assignment = videoAssignments.find(a => String(a.assignmentID) === String(score.assignmentID));
            const submissionTime = new Date(score.date).toLocaleString('vi-VN');

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${assignment?.assignmentName || 'N/A'}</td>
                <td>${submissionTime}</td>
                <td><strong style="color: ${score.score >= 50 ? 'var(--green)' : 'var(--red)'}">${score.score}</strong></td>
            `;
            submissionBody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to load submission history:", error);
        submissionBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Lỗi khi tải lịch sử nộp bài</td></tr>`;
    }
}
// khởi chạy

function init() {
    renderSidebar();
    setupLessonClick();

    if (Array.isArray(course.videos) && course.videos.length > 0) {
        loadVideo(course.videos[0].videoID);
    }
}
