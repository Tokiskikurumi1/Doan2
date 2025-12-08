const courses = JSON.parse(localStorage.getItem("courses")) || [];
const comments = JSON.parse(localStorage.getItem("forum_comments")) || [];
const totalView = JSON.parse(localStorage.getItem("forum_posts")) || [];

const totalCourse = document.getElementById("totalCourse");
const totalConmments = document.getElementById("totalComments");
const accessForum = document.getElementById("accessForum");

totalCourse.textContent = courses.length;
totalConmments.textContent = comments.length;
const totalViews = totalView.reduce(
  (sum, post) => sum + (post.viewCount || 0),
  0
);
accessForum.textContent = totalViews;
