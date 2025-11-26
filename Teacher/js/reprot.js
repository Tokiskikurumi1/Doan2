const courses = JSON.parse(localStorage.getItem("courses")) || [];

const totalCourse = document.getElementById("totalCourse");

totalCourse.textContent = courses.length;
