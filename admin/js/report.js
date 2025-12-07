const data = {
  users: {
    summary: {
      totalUsers: 1254,
      students: 1100,
      teachers: 154,
      newRegistrations: 32,
    },
    table: [
      { id: 1, name: "Nguyễn Văn A", role: "Học viên", joinDate: "2025-10-01" },
      { id: 2, name: "Trần Thị B", role: "Giảng viên", joinDate: "2025-09-12" },
      { id: 3, name: "Lê C", role: "Học viên", joinDate: "2025-09-20" },
    ],
  },

  courses: {
    summary: {
      totalCourses: 36,
      activeCourses: 29,
      completedCourses: 7,
      totalRevenue: "56,200,000đ",
    },
    table: [
      {
        id: 1,
        name: "IELTS Writing Advanced",
        teacher: "Nguyễn Văn A",
        students: 320,
        percent: "85%",
        revenue: "12,000,000đ",
      },
      {
        id: 2,
        name: "TOEIC Listening 600+",
        teacher: "Trần Thị B",
        students: 280,
        percent: "78%",
        revenue: "10,500,000đ",
      },
      {
        id: 3,
        name: "English for Beginners",
        teacher: "Lê Bình",
        students: 250,
        percent: "91%",
        revenue: "9,200,000đ",
      },
    ],
  },

  revenue: {
    summary: {
      totalMonth: "56,200,000đ",
      totalYear: "620,000,000đ",
      avgPerStudent: "505,000đ",
      transactions: 324,
    },
    // mặc định chart (triệu đồng)
    chart: [42, 48, 53, 61, 68, 74, 80, 77, 65, 72, 79, 85],
    table: [
      {
        id: "TX001",
        student: "Nguyễn Văn A",
        course: "IELTS",
        amount: "1,500,000đ",
        method: "Chuyển khoản",
        date: "2025-10-10",
        status: "Đã thanh toán",
      },
      {
        id: "TX002",
        student: "Trần Thị B",
        course: "TOEIC",
        amount: "1,200,000đ",
        method: "Momo",
        date: "2025-10-09",
        status: "Đã thanh toán",
      },
      {
        id: "TX003",
        student: "Phạm Văn C",
        course: "Giao tiếp",
        amount: "900,000đ",
        method: "Thẻ",
        date: "2025-10-08",
        status: "Thất bại",
      },
    ],
  },

  violations: {
    reports: [
      {
        id: 1,
        username: "user123",
        reason: "Spam trong khóa học",
        status: "Đang bị khóa",
      },
      {
        id: 2,
        username: "teacherX",
        reason: "Nội dung không phù hợp",
        status: "Đang bị khóa",
      },
      {
        id: 3,
        username: "learnerZ",
        reason: "Báo cáo sai phạm",
        status: "Đã gỡ khóa",
      },
    ],
  },
};

const listUsers = JSON.parse(localStorage.getItem("listusers")) || {};
const courses = JSON.parse(localStorage.getItem("courses")) || [];

// --- DOM references
const selectType = document.querySelector("select");
const statsContainer = document.querySelector(".stats");
const reportTableContainer = document.querySelector(".reportTable");
const exportDiv = document.querySelector(".export");

// LẤY ID THEO ACTION
const dateInputs = document.querySelectorAll(".actions input[type='date']");
const fromDateInput = dateInputs[0] || null;
const toDateInput = dateInputs[1] || null;
const applyButton = document.querySelector(".actions button");

// helper: parse yyyy-mm-dd to Date (local)
function parseDateYMD(s) {
  if (!s) return null;
  const parts = s.split("-");
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

// helper: parse money string like "1,500,000đ" -> number (VND)
function parseVND(str) {
  if (!str) return 0;
  return Number(str.replace(/[^\d]/g, "")) || 0;
}

// === renderContent accepts optional date filter (from/to as yyyy-mm-dd strings)
function renderContent(type, from = null, to = null) {
  statsContainer.innerHTML = "";
  reportTableContainer.innerHTML = "";
  exportDiv.innerHTML = "";

  switch (type) {
    case "user":
      renderUserStats(from, to);
      break;

    case "course":
      renderCourseStats(from, to);
      break;

    case "revenue":
      renderRevenueStats(from, to);
      break;

    default:
      renderUserStats(from, to);
      break;
  }
}

// ================== USERS ==================
function renderUserStats(from, to) {
  const rawData = localStorage.getItem("listusers");
  let realUsers = [];

  if (rawData) {
    try {
      const usersObj = JSON.parse(rawData);
      realUsers = Object.values(usersObj).map((user) => ({
        id: String(user.id || Date.now()),
        name: user.yourname || user.name || "Chưa đặt tên",
        email: user.email || "",
        role: user.role || "student", // "student" hoặc "teacher"
        created: user.created || new Date().toLocaleDateString("vi-VN"),
      }));
    } catch (e) {
      console.error("Lỗi parse listusers:", e);
    }
  }

  // Tính toán thống kê
  const totalUsers = realUsers.length;

  const students = realUsers.filter((u) => u.role === "student").length;
  const teachers = realUsers.filter((u) => u.role === "teacher").length;

  // Đăng ký gần đây: trong 7 ngày qua
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const newRegistrations = realUsers.filter((u) => {
    // created có dạng "dd/mm/yyyy"
    if (!u.created) return false;
    const parts = u.created.split("/");
    if (parts.length !== 3) return false;
    const userDate = new Date(
      Number(parts[2]),
      Number(parts[1]) - 1,
      Number(parts[0])
    );
    return userDate >= sevenDaysAgo;
  }).length;

  // Lọc theo khoảng ngày
  let filteredUsers = realUsers;
  if (from && to) {
    const f = parseDateYMD(from);
    const t = parseDateYMD(to);
    if (f && t) {
      filteredUsers = realUsers.filter((u) => {
        if (!u.created) return false;
        const parts = u.created.split("/");
        if (parts.length !== 3) return false;
        const userDate = new Date(
          Number(parts[2]),
          Number(parts[1]) - 1,
          Number(parts[0])
        );
        return userDate >= f && userDate <= t;
      });
    }
  }

  // Render 4 card thống kê
  statsContainer.innerHTML = `
    <div class="card"><h3>Tổng người dùng</h3><p>${totalUsers}</p></div>
    <div class="card"><h3>Tổng học viên</h3><p>${students}</p></div>
    <div class="card"><h3>Tổng giảng viên</h3><p>${teachers}</p></div>
    <div class="card"><h3>Người dùng đăng ký gần đây</h3><p>${newRegistrations}</p></div>
  `;

  // Render bảng danh sách người dùng
  reportTableContainer.innerHTML = `
    <h3>Bảng tổng hợp người dùng</h3>
    <table>
      <thead>
        <tr><th>STT</th><th>Họ tên</th><th>Vai trò</th><th>Ngày tham gia</th></tr>
      </thead>
      <tbody>
        ${
          filteredUsers.length === 0
            ? `<tr><td colspan="4" style="text-align:center; padding:20px;">Không có dữ liệu</td></tr>`
            : filteredUsers
                .map(
                  (u, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${u.name}</td>
                  <td>${u.role === "teacher" ? "Giảng viên" : "Học viên"}</td>
                  <td>${u.created}</td>
                </tr>
              `
                )
                .join("")
        }
      </tbody>
    </table>
  `;

  exportDiv.innerHTML = `<button onclick="exportToPDF()">Xuất PDF</button>`;
}

// ================== KHÓA HỌC ==================
function renderCourseStats(from = null, to = null) {
  let courses = JSON.parse(localStorage.getItem("courses") || "[]");

  // Lọc theo ngày nếu có
  if (from && to) {
    const fromDate = parseDateYMD(from);
    const toDate = parseDateYMD(to);
    if (fromDate && toDate) {
      courses = courses.filter((c) => {
        const courseDate = parseDateYMD(c.date);
        return courseDate && courseDate >= fromDate && courseDate <= toDate;
      });
    }
  }

  // Tính toán thống kê
  const totalCourses = courses.length;
  const completedCourses = courses.filter(
    (c) => c.status === "completed"
  ).length;
  const activeCourses = totalCourses - completedCourses;

  // Tổng doanh thu: sum giá tiền tất cả khóa học
  const totalRevenue = courses.reduce((sum, c) => {
    const price = parseFloat(c.price) || 0;
    return sum + price;
  }, 0);

  // Format tiền VND đẹp
  const formatVND = (num) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Tính % hoàn thành trung bình (nếu có dữ liệu tiến độ học viên)
  const studentProgress = JSON.parse(
    localStorage.getItem("studentProgress") || "[]"
  );
  const progressByCourse = {};

  studentProgress.forEach((p) => {
    if (!progressByCourse[p.courseId]) {
      progressByCourse[p.courseId] = { watched: 0, total: 0, students: 0 };
    }
    const course = courses.find((c) => String(c.id) === String(p.courseId));
    const totalVideos = course?.videos?.length || 1;
    const watched = p.progress?.watchedVideos?.length || 0;
    progressByCourse[p.courseId].watched += watched;
    progressByCourse[p.courseId].total += totalVideos;
    progressByCourse[p.courseId].students += 1;
  });

  // Render 4 card thống kê
  statsContainer.innerHTML = `
    <div class="card"><h3>Tổng khóa học</h3><p class="big-number">${totalCourses}</p></div>
    <div class="card"><h3>Chưa hoàn thành</h3><p class="big-number warning">${activeCourses}</p></div>
    <div class="card"><h3>Đã hoàn thành</h3><p class="big-number success">${completedCourses}</p></div>
    <div class="card"><h3>Tổng doanh thu</h3><p class="big-number revenue">${formatVND(
      totalRevenue
    )}</p></div>
  `;

  // Render bảng chi tiết khóa học
  const tableRows = courses
    .map((c, index) => {
      const progressInfo = progressByCourse[c.id] || {
        watched: 0,
        total: 0,
        students: 0,
      };
      const percentComplete =
        progressInfo.total > 0
          ? Math.round((progressInfo.watched / progressInfo.total) * 100)
          : 0;

      const teacherName = c.teacherName || "Chưa có";

      return `
      <tr>
        <td>${index + 1}</td>
        <td>${c.name}</td>
        <td>${teacherName}</td>
        <td>${progressInfo.students}</td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="flex:1; height:8px; background:#eee; border-radius:4px; overflow:hidden;">
              <div style="width:${percentComplete}%; height:100%; background:#4caf50;"></div>
            </div>
            <span>${percentComplete}%</span>
          </div>
        </td>
        <td>${formatVND(parseFloat(c.price) || 0)}</td>
      </tr>
    `;
    })
    .join("");

  reportTableContainer.innerHTML = `
    <h3>Bảng tổng hợp khóa học (${totalCourses} khóa)</h3>
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên khóa học</th>
          <th>Giảng viên</th>
          <th>Học viên</th>
          <th>Tiến độ hoàn thành</th>
          <th>Giá khóa học</th>
        </tr>
      </thead>
      <tbody>
        ${
          tableRows ||
          `<tr><td colspan="6" style="text-align:center; padding:30px; color:#999;">Chưa có khóa học nào</td></tr>`
        }
      </tbody>
    </table>
  `;

  exportDiv.innerHTML = `<button onclick="exportToPDF()">Xuất PDF</button>`;
}

// ================== DOANH THU ==================
function renderRevenueStats(from, to) {
  const s = data.revenue.summary;

  statsContainer.innerHTML = `
    <div class="card"><h3>Doanh thu tháng</h3><p>${s.totalMonth}</p></div>
    <div class="card"><h3>Doanh thu năm</h3><p>${s.totalYear}</p></div>
    <div class="card"><h3>Trung bình / học viên</h3><p>${s.avgPerStudent}</p></div>
    <div class="card"><h3>Tổng giao dịch</h3><p>${s.transactions}</p></div>
  `;

  let transactions = data.revenue.table.slice();

  if (from && to) {
    const f = parseDateYMD(from);
    const t = parseDateYMD(to);

    transactions = transactions.filter((r) => {
      const d = parseDateYMD(r.date);
      return d && d >= f && d <= t;
    });
  }

  reportTableContainer.innerHTML = `
    <h3>Bảng giao dịch chi tiết</h3>
    <table>
      <thead>
        <tr><th>Mã GD</th><th>Học viên</th><th>Khóa học</th><th>Số tiền</th><th>Phương thức</th><th>Ngày</th><th>Trạng thái</th></tr>
      </thead>
      <tbody>
        ${transactions
          .map(
            (r) =>
              `<tr><td>${r.id}</td><td>${r.student}</td><td>${r.course}</td><td>${r.amount}</td><td>${r.method}</td><td>${r.date}</td><td>${r.status}</td></tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;

  exportDiv.innerHTML = `<button onclick="exportToPDF()">📄 Xuất PDF</button>`;
}

// ================== EXPORT ==================
function exportToPDF() {
  window.print();
}

// ================== SỰ KIỆN UI ==================
selectType.addEventListener("change", () => {
  const selectedValue = selectType.value;
  renderContent(
    selectedValue,
    fromDateInput ? fromDateInput.value : null,
    toDateInput ? toDateInput.value : null
  );
});

if (applyButton) {
  applyButton.addEventListener("click", () => {
    const selectedValue = selectType.value;
    const from = fromDateInput ? fromDateInput.value : null;
    const to = toDateInput ? toDateInput.value : null;

    if ((from && !to) || (!from && to)) {
      alert("Vui lòng chọn cả Từ ngày và Đến ngày hoặc bỏ cả hai.");
      return;
    }
    if (from && to && parseDateYMD(from) > parseDateYMD(to)) {
      alert("Từ ngày không được lớn hơn Đến ngày.");
      return;
    }

    renderContent(selectedValue, from, to);
  });
}

renderContent("user");
