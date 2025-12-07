// Lấy dữ liệu từ localStorage
const courses = JSON.parse(localStorage.getItem("courses")) || [];
const productContainer = document.querySelector(".product");
const pagination = document.querySelector(".pagination");

let currentPage = 1;
const itemsPerPage = 8;
let filteredCourses = courses; 

// Hàm render sản phẩm theo trang
function renderCourses(page) {
  productContainer.innerHTML = "";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageCourses = filteredCourses.slice(start, end);

  pageCourses.forEach(course => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
  <div class="product-card-item">
    <div class="product-card-item-img"
         style="background-image:url('${course.imageUrl || "./img/image_course/image-course.png"}');
                background-size:cover;
                background-position:center;"></div>
    <h3>${course.name}</h3>
    <span>Tác Giả: ${course.teacherName || "Không rõ"}</span>
    <span>Loại: ${course.type}</span>
    <div class="product-card-item-price">
      <span class="price">${course.price} VND</span>
      <button class="btn-detail" data-id="${course.id}" id="btnblue">Xem chi tiết</button>
    </div>
  </div>
`;

    productContainer.appendChild(card);
  });

  productContainer.appendChild(pagination);
  renderPagination();

  // Gắn sự kiện cho nút chi tiết
  document.querySelectorAll(".btn-detail").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      localStorage.setItem("selectedCourseId", id);
      window.location.href = "./course-detail.html";
    });
  });
}

// Hàm render phân trang
function renderPagination() {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderCourses(currentPage);
    }
  });
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    if (i === currentPage) pageBtn.classList.add("active");
    pageBtn.addEventListener("click", () => {
      currentPage = i;
      renderCourses(currentPage);
    });
    pagination.appendChild(pageBtn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderCourses(currentPage);
    }
  });
  pagination.appendChild(nextBtn);
}

// Hàm lọc theo loại/trình độ
function applyFilter(type) {
  if (type === "all") {
    filteredCourses = courses;
  } else {
    filteredCourses = courses.filter(c => c.type.toLowerCase().includes(type.toLowerCase()));
  }
  currentPage = 1; // reset về trang đầu
  renderCourses(currentPage);
}

// Bắt sự kiện radio filter
document.querySelectorAll('input[name="level"]').forEach(radio => {
  radio.addEventListener("change", () => {
    const selectedText = radio.parentElement.textContent.trim(); // lấy text hiển thị
    applyFilter(selectedText);
  });
});

// Khởi chạy lần đầu
renderCourses(currentPage);
