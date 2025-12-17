// ======================= DOM =======================
const paymentTableBody = document.getElementById("paymentTableBody");
const Total = document.getElementById("Total");
const totalTrade = document.getElementById("totalTrade");
const tradeSuccsess = document.getElementById("tradeSuccsess");

const searchPayment = document.getElementById("searchPayment");
const roleFilterCourse = document.getElementById("roleFilterCourse");
const dateFrom = document.getElementById("fromDate");
const dateTo = document.getElementById("toDate");
const applyDate = document.getElementById("applyDate");

// ======================= LOAD DATA =======================
function loadCoursesArray() {
  const raw = JSON.parse(localStorage.getItem("courses")) || [];
  return Array.isArray(raw) ? raw : Object.values(raw);
}

let allCourses = loadCoursesArray();

// ======================= TIỆN ÍCH =======================
function isSameDayLocal(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ======================= DOANH THU HÔM NAY =======================
function calculateTodayRevenue() {
  let total = 0;
  const today = new Date();

  allCourses.forEach((course) => {
    const price = Number(course.price) || 0;
    if (!Array.isArray(course.students)) return;

    course.students.forEach((student) => {
      if (!student.date) return;
      const d = new Date(student.date);
      if (isNaN(d)) return;

      if (isSameDayLocal(d, today)) {
        total += price;
      }
    });
  });

  return total;
}

// ======================= SỐ HỌC VIÊN HÔM NAY =======================
function calculateTodayStudentCount() {
  let count = 0;
  const today = new Date();

  allCourses.forEach((course) => {
    if (!Array.isArray(course.students)) return;

    course.students.forEach((student) => {
      if (!student.date) return;
      const d = new Date(student.date);
      if (isNaN(d)) return;

      if (isSameDayLocal(d, today)) {
        count++;
      }
    });
  });

  return count;
}

// ======================= BẢNG HỌC VIÊN =======================
const itemsPerPage = 10;
let currentPage = 1;
let currentList = [];

function getStudentsSortedByLatest() {
  let list = [];

  allCourses.forEach((course) => {
    const price = Number(course.price) || 0;
    const courseName = course.name || course.title || "Không rõ";

    if (!Array.isArray(course.students)) return;

    course.students.forEach((student) => {
      if (!student.date) return;

      list.push({
        student: student.name || student.email || "Không tên",
        course: courseName,
        price: price,
        date: student.date,
      });
    });
  });

  // mới nhất → cũ nhất
  list.sort((a, b) => new Date(b.date) - new Date(a.date));
  return list;
}

function renderPagination() {
  const totalItems = currentList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  document.getElementById("totalRecords").textContent = totalItems;
  document.getElementById("pageStart").textContent =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  document.getElementById("pageEnd").textContent = Math.min(
    currentPage * itemsPerPage,
    totalItems
  );

  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage >= totalPages;

  const pageNumbers = document.getElementById("pageNumbers");
  pageNumbers.innerHTML = "";

  const btn = document.createElement("div");
  btn.className = "page-number active";
  btn.textContent = currentPage;
  pageNumbers.appendChild(btn);
}

function displayStudentTable(list) {
  currentList = list;
  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = currentList.slice(start, start + itemsPerPage);

  paymentTableBody.innerHTML = "";

  if (pageItems.length === 0) {
    paymentTableBody.innerHTML = `
      <tr><td colspan="6" style="text-align:center;padding:40px">
        Không có học viên
      </td></tr>`;
    return;
  }

  pageItems.forEach((item) => {
    paymentTableBody.innerHTML += `
      <tr>
        <td>${item.student}</td>
        <td>${item.course}</td>
        <td>${item.price.toLocaleString("vi-VN")}đ</td>
        <td>Chuyển khoản</td>
        <td>${new Date(item.date).toLocaleString("vi-VN")}</td>
        <td><span class="status-paid">Đã đăng ký</span></td>
      </tr>
    `;
  });

  renderPagination();
}

function loadStudentTable() {
  currentPage = 1;
  displayStudentTable(getStudentsSortedByLatest());
}

function updateMonthlyRevenueChart() {
  const boxColumn = document.getElementById("monthlyChart");
  if (!boxColumn) return;

  const bars = boxColumn.querySelectorAll(".chart-serie");

  // Doanh thu theo tháng
  const monthlyRevenue = Array(12).fill(0);

  allCourses.forEach((course) => {
    const price = Number(course.price) || 0;

    if (!Array.isArray(course.students)) return;

    course.students.forEach((student) => {
      if (!student.date) return;

      const monthIndex = new Date(student.date).getMonth();
      monthlyRevenue[monthIndex] += price;
    });
  });

  // Chuẩn hiển thị: 100 triệu = 100%
  const MAX_REVENUE = 100000000;

  bars.forEach((bar, index) => {
    const revenue = monthlyRevenue[index];

    let percent = (revenue / MAX_REVENUE) * 100;
    percent = Math.min(percent, 100);

    bar.style.setProperty("--i", percent + "%");

    // Text hiển thị
    let displayText = "";
    if (revenue >= 1000000) {
      displayText = (revenue / 1000000).toFixed(1) + "tr";
    } else if (revenue >= 1000) {
      displayText = (revenue / 1000).toFixed(0) + "k";
    } else if (revenue > 0) {
      displayText = revenue + "đ";
    }

    const title = bar.querySelector(".column-title");
    if (title) {
      if (revenue > 0) {
        title.textContent = displayText;
        title.style.opacity = "1";
      } else {
        title.textContent = "";
        title.style.opacity = "0";
      }
    }
  });
}

// ======================= TÌM KIẾM  =======================

function filterStudentTable(applyDateFilter = false) {
  const keyword = searchPayment.value.toLowerCase().trim();
  const courseFilter = roleFilterCourse.value;

  const from = dateFrom.value ? new Date(dateFrom.value) : null;
  const to = dateTo.value ? new Date(dateTo.value) : null;

  let list = getStudentsSortedByLatest();

  const filtered = list.filter((item) => {
    // 🔍 tìm theo tên khóa học
    const matchKeyword = item.course.toLowerCase().includes(keyword);

    // 🎓 lọc theo select khóa học
    const matchCourse = courseFilter === "All" || item.course === courseFilter;

    // 📅 lọc theo ngày
    let matchDate = true;
    if (applyDateFilter && (from || to)) {
      const d = new Date(item.date);
      matchDate = (!from || d >= from) && (!to || d <= to);
    }

    return matchKeyword && matchCourse && matchDate;
  });

  currentPage = 1;
  displayStudentTable(filtered);
}

// ======================= INIT =======================
Total.textContent = calculateTodayRevenue().toLocaleString("vi-VN") + "đ";

const todayCount = calculateTodayStudentCount();
totalTrade.textContent = todayCount;
tradeSuccsess.textContent = todayCount;

updateMonthlyRevenueChart();
loadStudentTable();
