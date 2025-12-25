import { apiClient, UserManager } from "./object.js";

// Lấy user hiện tại
const currentUser = UserManager.getCurrentUserData();

// Lấy danh sách khóa học chưa đăng ký từ API
let courses = [];

const productContainer = document.querySelector(".product");
const pagination = document.querySelector(".pagination");

let currentPage = 1;
const itemsPerPage = 8;

// Danh sách khóa học sau khi lọc
let filteredCourses = [];

// Lọc theo trạng thái đăng ký
async function filterByEnrollStatus(status) {
  try {
    if (!currentUser) {
      // Nếu chưa đăng nhập, hiển thị tất cả khóa học
      const all = await apiClient.getAllCourses();
      filteredCourses = all || [];
      return;
    }

    if (status === "Đã đăng kí") {
      const enrolled = await apiClient.getEnrolledCourses(currentUser.userID);
      filteredCourses = enrolled || [];
    } else if (status === "Chưa đăng kí") {
      const unenrolled = await apiClient.getUnenrolledCourses(currentUser.userID);
      filteredCourses = unenrolled || [];
    } else {
      // Tất cả khóa học
      const all = await apiClient.getAllCourses();
      filteredCourses = all || [];
    }
  } catch (error) {
    console.error("Failed to load courses", error);
    filteredCourses = [];
  }
}

// Lọc theo loại khóa học
function filterByType(type) {
  if (type === "all") return;

  filteredCourses = filteredCourses.filter(c =>
    (c.courseType || "").toLowerCase().includes(type.toLowerCase())
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
            style="background-image:url('${course.courseImage || "../img/image_course/image-course.png"}');
                   background-size:cover;
                   background-position:center;">
        </div>

        <h3>${course.courseName}</h3>
        <span>Tác Giả: ${course.teacherName || "Không rõ"}</span>
        <span>Loại: ${course.courseType}</span>

        <div class="product-card-item-price">
          <span class="price">${course.coursePrice} VND</span>
          <button class="btn-detail btnwhite" data-id="${course.courseID}">Xem chi tiết</button>
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
  radio.addEventListener("change", async () => {
    const type = radio.value; // lấy từ value: TOEIC, IELTS,...

    const statusRadio = document.querySelector('input[name="enroll-status"]:checked');
    const status = statusRadio ? statusRadio.value : "Chưa đăng kí";

    // Nếu chưa đăng nhập, chỉ hiển thị tất cả khóa học
    if (!currentUser) {
      await filterByEnrollStatus("all");
    } else {
      await filterByEnrollStatus(status);
    }
    filterByType(type);

    currentPage = 1;
    renderCourses(currentPage);
  });
});

// Gắn sự kiện lọc theo trạng thái đăng ký
document.querySelectorAll('input[name="enroll-status"]').forEach(radio => {
  radio.addEventListener("change", async () => {
    const status = radio.value; // Đã đăng kí / Chưa đăng kí

    const typeRadio = document.querySelector('input[name="course-type"]:checked');
    const type = typeRadio ? typeRadio.value : "all";

    // Nếu chưa đăng nhập, chỉ hiển thị tất cả khóa học
    if (!currentUser) {
      await filterByEnrollStatus("all");
    } else {
      await filterByEnrollStatus(status);
    }
    filterByType(type);

    currentPage = 1;
    renderCourses(currentPage);
  });
});

// Khởi tạo mặc định: hiển thị khóa học chưa đăng ký
(async () => {
  console.log("Initializing shop.js...");
  console.log("Current user:", currentUser);
  await filterByEnrollStatus("Chưa đăng kí");
  console.log("Filtered courses:", filteredCourses);
  renderCourses(currentPage);
})();
