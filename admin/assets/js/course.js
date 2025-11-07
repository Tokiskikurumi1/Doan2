// ======================= LẤY PHẦN TỬ HTML =======================
const courseTableBody = document.getElementById("courseTableBody");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");
const addCourseBtn = document.getElementById("addCourseBtn");
const addCourseModal = document.getElementById("addCourseModal");
const courseInput = document.getElementById("courseInput");
const courseDesc = document.getElementById("courseDesc");
const courseTeacher = document.getElementById("courseTeacher");
const roleInput = document.getElementById("roleInput");
const saveCourseBtn = document.getElementById("saveCourseBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

let editingCourseId = null;

// ======================= DỮ LIỆU GIẢ =======================
let courses = [
  {
    id: 1,
    namecourse: "T750+",
    desc: "Khóa học giúp nắm vững nền tảng TA",
    role: "TOEIC",
    teacher: "Nguyễn Minh",
  },
  {
    id: 2,
    namecourse: "IELTS Master",
    desc: "Rèn luyện kỹ năng IELTS",
    role: "IELTS",
    teacher: "Trần Anh",
  },
  {
    id: 3,
    namecourse: "TOEIC Foundation",
    desc: "Củng cố ngữ pháp TOEIC",
    role: "TOEIC",
    teacher: "Lê Hằng",
  },
];

// ======================= HIỂN THỊ DANH SÁCH =======================
function displayCourse(list) {
  courseTableBody.innerHTML = "";
  list.forEach((c) => {
    courseTableBody.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.namecourse}</td>
        <td>${c.desc}</td>
        <td>${c.role}</td>
        <td>${c.teacher}</td>
        <td class="actions">
          <button class="edit" onclick="editCourse(${c.id})">          <i class="fa-solid fa-pen"></i>
</button>
          <button class="delete" onclick="deleteCourse(${c.id})">                  <i class="fa-solid fa-trash"></i>
</button>
        </td>
      </tr>
    `;
  });
}

// ======================= LỌC & TÌM KIẾM =======================
function filterCourse() {
  const searchText = searchInput.value.toLowerCase();
  const selectedRole = roleFilter.value.toLowerCase();

  const filtered = courses.filter((course) => {
    const matchesSearch = course.namecourse.toLowerCase().includes(searchText);
    const matchesRole =
      selectedRole === "all" || course.role.toLowerCase() === selectedRole;
    return matchesSearch && matchesRole;
  });

  displayCourse(filtered);
}

// ======================= MỞ MODAL =======================
function openModal(course = null) {
  addCourseModal.style.display = "flex";
  if (course) {
    editingCourseId = course.id;
    courseInput.value = course.namecourse;
    courseDesc.value = course.desc;
    roleInput.value = course.role;
    courseTeacher.value = course.teacher;
  } else {
    editingCourseId = null;
    courseInput.value = "";
    courseDesc.value = "";
    roleInput.value = "TOEIC";
    courseTeacher.value = "";
  }
}

// ======================= LƯU KHÓA HỌC =======================
function saveCourse() {
  const newCourse = {
    id: editingCourseId || courses.length + 1,
    namecourse: courseInput.value,
    desc: courseDesc.value,
    role: roleInput.value,
    teacher: courseTeacher.value,
  };

  if (!newCourse.namecourse || !newCourse.desc || !newCourse.teacher) {
    alert("Vui lòng nhập đầy đủ thông tin khóa học!");
    return;
  }

  if (editingCourseId) {
    const index = courses.findIndex((course) => course.id === editingCourseId);
    courses[index] = newCourse;
  } else {
    courses.push(newCourse);
  }

  filterCourse();
  addCourseModal.style.display = "none";
}

// ======================= SỬA =======================
function editCourse(id) {
  const course = courses.find((course) => course.id === id);
  if (course) openModal(course);
}

// ======================= XÓA =======================
function deleteCourse(id) {
  if (confirm("Bạn có chắc muốn xóa khóa học này?")) {
    const index = courses.findIndex((course) => course.id === id);
    if (index !== -1) {
      courses.splice(index, 1);
      filterCourse();
    }
  }
}

// ======================= SỰ KIỆN =======================
addCourseBtn.addEventListener("click", () => openModal());
saveCourseBtn.addEventListener("click", saveCourse);
closeModalBtn.addEventListener("click", () => {
  addCourseModal.style.display = "none";
});
searchInput.addEventListener("input", filterCourse);
roleFilter.addEventListener("change", filterCourse);

// ======================= KHỞI TẠO =======================
displayCourse(courses);
