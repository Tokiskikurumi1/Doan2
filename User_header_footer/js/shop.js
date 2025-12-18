import { CourseManager, UserManager } from "./object.js";

// Lấy user hiện tại
const currentUser = UserManager.getCurrentUserData();

// Lấy toàn bộ khóa học
let courses = Object.values(CourseManager.getAll()) || [];

const productContainer = document.querySelector(".product");
const pagination = document.querySelector(".pagination");

let currentPage = 1;
const itemsPerPage = 8;

// Danh sách khóa học sau khi lọc
let filteredCourses = [];

// Kiểm tra user đã đăng ký khóa học chưa
function isEnrolled(course) {
  if (!currentUser) return false;
  if (!course.students) return false;
  return course.students.some(s => String(s.id) === String(currentUser.id));
}

// Lọc theo trạng thái đăng ký
function filterByEnrollStatus(status) {
  if (status === "Đã đăng kí") {
    filteredCourses = courses.filter(c => isEnrolled(c));
  } else if (status === "Chưa đăng kí") {
    filteredCourses = courses.filter(c => !isEnrolled(c));
  } else {
    filteredCourses = courses;
  }
}

// Lọc theo loại khóa học
function filterByType(type) {
  if (type === "all") return;

  filteredCourses = filteredCourses.filter(c =>
    (c.type || "").toLowerCase().includes(type.toLowerCase())
  );
}

// Render danh sách khóa học
function renderCourses(page) {
  productContainer.innerHTML = "";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageCourses = filteredCourses.slice(start, end);

  if (pageCourses.length === 0) {
    productContainer.innerHTML = `<p>Không tìm thấy khóa học phù hợp.</p>`;
    pagination.innerHTML = "";
    return;
  }

  pageCourses.forEach(course => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-card-item">
        <div class="product-card-item-img"
            style="background-image:url('${course.image || "./img/image_course/image-course.png"}');
                   background-size:cover;
                   background-position:center;">
        </div>

        <h3>${course.name}</h3>
        <span>Tác Giả: ${course.teacherName || "Không rõ"}</span>
        <span>Loại: ${course.type}</span>

        <div class="product-card-item-price">
          <span class="price">${course.price} VND</span>
          <button class="btn-detail btnwhite" data-id="${course.id}">Xem chi tiết</button>
        </div>
      </div>
    `;

    productContainer.appendChild(card);
  });

  renderPagination();

  // Gắn sự kiện xem chi tiết khóa học
  document.querySelectorAll(".btn-detail").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      localStorage.setItem("selectedCourseId", id);
      window.location.href = "./course-detail.html";
    });
  });
}

// Render phân trang
function renderPagination() {
  pagination.innerHTML = "";

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  if (totalPages <= 1) return;

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderCourses(currentPage);
    }
  };
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;

    if (i === currentPage) pageBtn.classList.add("active");

    pageBtn.onclick = () => {
      currentPage = i;
      renderCourses(currentPage);
    };

    pagination.appendChild(pageBtn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderCourses(currentPage);
    }
  };
  pagination.appendChild(nextBtn);
}

// Gắn sự kiện lọc theo loại khóa học
document.querySelectorAll('input[name="course-type"]').forEach(radio => {
  radio.addEventListener("change", () => {
    const type = radio.value; // lấy từ value: TOEIC, IELTS,...

    const statusRadio = document.querySelector('input[name="enroll-status"]:checked');
    const status = statusRadio ? statusRadio.value : "Chưa đăng kí";

    filterByEnrollStatus(status);
    filterByType(type);

    currentPage = 1;
    renderCourses(currentPage);
  });
});

// Gắn sự kiện lọc theo trạng thái đăng ký
document.querySelectorAll('input[name="enroll-status"]').forEach(radio => {
  radio.addEventListener("change", () => {
    const status = radio.value; // Đã đăng kí / Chưa đăng kí

    const typeRadio = document.querySelector('input[name="course-type"]:checked');
    const type = typeRadio ? typeRadio.value : "all";

    filterByEnrollStatus(status);
    filterByType(type);

    currentPage = 1;
    renderCourses(currentPage);
  });
});

// Khởi tạo mặc định: hiển thị khóa học chưa đăng ký
filterByEnrollStatus("Chưa đăng kí");
renderCourses(currentPage);
