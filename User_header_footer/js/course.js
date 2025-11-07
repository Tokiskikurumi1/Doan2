//===============================DỮ LIỆU GIẢ =================================
const courses = [
  {
    id: 1,
    name: "Luyện giải đề TOEIC 2025",
    category: "TOEIC",
    type: ["Video", "Livestream"],
    price: 850000,
    image_url: "./img/image_course/image-course.png",
    description:
      "Khóa học giúp luyện tập và phân tích các dạng đề TOEIC mới nhất, phù hợp cho người chuẩn bị thi năm 2025.",
    time: "120h",
  },
  {
    id: 2,
    name: "Khóa học IELTS Foundation",
    category: "IELTS",
    type: ["Video"],
    price: 980000,
    image_url: "./img/image_course/image-course.png",
    description:
      "Khóa học nền tảng giúp làm quen với cấu trúc đề thi IELTS và phát triển kỹ năng cơ bản.",
  },
  {
    id: 3,
    name: "Tiếng Anh căn bản cho người mới bắt đầu",
    category: "BEGINNER",
    type: ["Video"],
    price: 650000,
    image_url: "./img/image_course/image-course.png",
    description:
      "Khóa học phù hợp với người mới học tiếng Anh, bao gồm phát âm, ngữ pháp và từ vựng cơ bản.",
  },
  {
    id: 4,
    name: "Combo TOEIC 2 kỹ năng Nghe - Đọc",
    category: "COMBO-2",
    type: ["Video", "Livestream"],
    price: 1250000,
    image_url: "./img/image_course/image-course.png",
    description:
      "Tập trung vào luyện tập hai kỹ năng Listening và Reading cho kỳ thi TOEIC.",
  },
  {
    id: 5,
    name: "Combo TOEIC 4 kỹ năng Toàn diện",
    category: "COMBO-4",
    type: ["Video"],
    price: 1800000,
    image_url: "./img/image_course/image-course.png",
    description:
      "Khóa học bao gồm 4 kỹ năng Nghe, Nói, Đọc, Viết giúp ôn thi TOEIC toàn diện.",
  },
  {
    id: 6,
    name: "Khóa luyện nói IELTS Speaking Intensive",
    category: "IELTS",
    type: ["Livestream"],
    price: 1100000,
    image_url: "./img/image_course/image-course.png",
    description:
      "Luyện kỹ năng nói IELTS chuyên sâu cùng giảng viên trực tuyến.",
  },
  {
    id: 7,
    name: "Khóa học IELTS Writing Master",
    category: "IELTS",
    type: ["Video"],
    price: 1050000,
    image_url: "./img/image_course/image-course.png",
    description:
      "Giúp học viên làm chủ kỹ năng viết IELTS với các dạng bài Task 1 và Task 2.",
  },
  {
    id: 8,
    name: "Combo Lấy gốc tiếng Anh & TOEIC cấp tốc",
    category: "COMBO-4+2",
    type: ["Video", "Livestream"],
    price: 1950000,
    image_url: "./img/image_course/image-course.png",
    description:
      "Dành cho người mất gốc cần ôn thi TOEIC cấp tốc trong thời gian ngắn.",
  },
  {
    id: 9,
    name: "Luyện nghe hiểu TOEIC 2025",
    category: "TOEIC",
    type: ["Video"],
    price: 750000,
    image_url: "./img/image_course/image-course.png",
    description: "Cung cấp kỹ năng nghe và mẹo làm bài TOEIC hiệu quả.",
  },
  {
    id: 10,
    name: "Luyện nói tiếng Anh giao tiếp hằng ngày",
    category: "BEGINNER",
    type: ["Video"],
    price: 820000,
    image_url: "./img/image_course/image-course.png",
    description:
      "Khóa học giúp cải thiện phản xạ giao tiếp tự nhiên trong đời sống.",
  },
];

//=========================================KHAI BÁO PHẦN TỬ===================================
const btnMenuIcon = document.getElementById("menu-icon");
const Categorys = document.querySelector(".categorys");
const li_cate = document.querySelectorAll(".categorys ul li");
const searchInput = document.querySelector(".search input");
const listCourse = document.querySelector(".list-course");
const btnSearch = document.querySelector(".search button");

//===================KIỂM TRA ĐĂNG NHẬP ==========================
function isLoggedIn() {
  const user = localStorage.getItem("savedUsername");
  return !!user; // trả về true nếu có user
}
//=============== TOGGLE ĐỔ DANH MỤC =========================
btnMenuIcon.addEventListener("click", () => {
  Categorys.classList.toggle("active");
});

//================= ĐỔI MÀU LI + CẬP NHẬT KHÓA HỌC =======================
li_cate.forEach((item) => {
  item.addEventListener("click", () => {
    li_cate.forEach((el) => el.classList.remove("active"));
    item.classList.add("active");
    const type = item.getAttribute("data-type");
    if (type) {
      updateCourse(type);
    }
  });
});

//===================== LOAD SẢN PHẨM DỰA THEO DANH MỤC ==================
function updateCourse(type) {
  listCourse.innerHTML = "";

  const filteredCourses =
    type === "ALL" ? courses : courses.filter((c) => c.category === type);

  if (filteredCourses.length === 0) {
    listCourse.style.display = "block";
    listCourse.innerHTML = "<p>Không có khóa học nào trong danh mục này.</p>";
    return;
  } else {
    listCourse.style.display = "grid";
  }

  filteredCourses.forEach((course) => {
    let courseTagHTML = "";
    if (course.type.includes("Video")) {
      courseTagHTML += `
        <div class="course-tag-item">
          <i class="fa-solid fa-play"></i> <span>Video</span>
        </div>`;
    }
    if (course.type.includes("Livestream")) {
      courseTagHTML += `
        <div class="course-tag-item live">
          <span></span> <span>Livestream</span>
        </div>`;
    }

    listCourse.innerHTML += `
      <div class="item-course" data-id="${course.id}">
        <div class="item-course-panel">
          <div class="image-course">
            <img src="${course.image_url}" alt="${course.name}" />
          </div>
          <div class="course-info">
            <div class="name-course">${course.name}</div>
            <div class="course-tag">${courseTagHTML}</div>
            <hr />
            <div class="course-price">
              <div class="price">${course.price.toLocaleString()} VND</div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  // 👉 Gắn sự kiện click sau khi render
  addCourseClickEvents();
}

//==================== GẮN SỰ KIỆN CLICK CHI TIẾT ====================
function addCourseClickEvents() {
  const courseItems = document.querySelectorAll(".item-course");
  courseItems.forEach((item) => {
    item.addEventListener("click", () => {
      const id = parseInt(item.getAttribute("data-id"));
      const selectedCourse = courses.find((c) => c.id === id);

      if (selectedCourse) {
        // ✅ Lưu toàn bộ thông tin khóa học vào localStorage
        localStorage.setItem("selectedCourse", JSON.stringify(selectedCourse));

        // Chuyển sang trang chi tiết
        window.location.href = "course-detail.html";
      }
    });
  });
}

//==========================TÌM KIẾM KHÓA HỌC===================
btnSearch.addEventListener("click", () => {
  const searchText = searchInput.value.trim().toLowerCase();

  const filtered = courses.filter((course) =>
    course.name.toLowerCase().includes(searchText)
  );

  listCourse.innerHTML = "";

  if (filtered.length === 0) {
    listCourse.style.display = "block";
    listCourse.innerHTML = "<p>Không có khóa học nào phù hợp.</p>";
    return;
  } else {
    listCourse.style.display = "grid";
  }

  filtered.forEach((course) => {
    let courseTagHTML = "";
    if (course.type.includes("Video")) {
      courseTagHTML += `
        <div class="course-tag-item">
          <i class="fa-solid fa-play"></i> <span>Video</span>
        </div>`;
    }
    if (course.type.includes("Livestream")) {
      courseTagHTML += `
        <div class="course-tag-item live">
          <span></span> <span>Livestream</span>
        </div>`;
    }

    listCourse.innerHTML += `
      <div class="item-course" data-id="${course.id}">
        <div class="item-course-panel">
          <div class="image-course">
            <img src="${course.image_url}" alt="${course.name}" />
          </div>
          <div class="course-info">
            <div class="name-course">${course.name}</div>
            <div class="course-tag">${courseTagHTML}</div>
            <hr />
            <div class="course-price">
              <div class="price">${course.price.toLocaleString()} VND</div>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  // 👉 Gắn lại sự kiện click
  addCourseClickEvents();
});

updateCourse("ALL");
