// ======================= DOM =======================
const selectType = document.querySelector("select");
const statsContainer = document.querySelector(".stats");
const reportTableContainer = document.querySelector(".reportTable");
const exportDiv = document.querySelector(".export");

const dateInputs = document.querySelectorAll(".actions input[type='date']");
const fromDateInput = dateInputs[0] || null;
const toDateInput = dateInputs[1] || null;
const applyButton = document.querySelector(".actions button");

// ======================= HELPERS =======================
function parseDateYMD(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d));
}

function parseAnyDate(v) {
  if (!v) return null;

  // yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) {
    const d = new Date(v);
    return isNaN(d) ? null : d;
  }

  // dd/mm/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
    const [d, m, y] = v.split("/");
    return new Date(Number(y), Number(m) - 1, Number(d));
  }

  // fallback
  const d = new Date(v);
  return isNaN(d) ? null : d;
}

function parseVND(str) {
  if (!str) return 0;
  return Number(str.replace(/[^\d]/g, "")) || 0;
}

function formatVND(num) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(num);
}

// ======================= MAIN ROUTER =======================
function renderContent(type, from = null, to = null) {
  statsContainer.innerHTML = "";
  reportTableContainer.innerHTML = "";
  exportDiv.innerHTML = "";

  if (type === "course") renderCourseStats(from, to);
  else if (type === "revenue") renderRevenueStats(from, to);
  else renderUserStats(from, to);
}

// ======================= USERS =======================
function renderUserStats(from, to) {
  const raw = localStorage.getItem("listusers");
  let users = [];

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const arr = Array.isArray(parsed) ? parsed : Object.values(parsed);

      users = arr.map((u) => ({
        name: u.yourname || u.name || "Chưa tên",
        email: u.email || "",
        role: u.role || "student",
        date: u.created || u.date || null,
      }));
    } catch (e) {
      console.error("listusers lỗi:", e);
    }
  }

  const totalUsers = users.length;
  const students = users.filter((u) => u.role === "student").length;
  const teachers = users.filter((u) => u.role === "teacher").length;

  // lọc ngày
  if (from && to) {
    const f = parseDateYMD(from);
    const t = parseDateYMD(to);
    users = users.filter((u) => {
      const d = parseAnyDate(u.date);
      return d && d >= f && d <= t;
    });
  }

  statsContainer.innerHTML = `
    <div class="card"><h3>Tổng người dùng</h3><p>${totalUsers}</p></div>
    <div class="card"><h3>Học viên</h3><p>${students}</p></div>
    <div class="card"><h3>Giảng viên</h3><p>${teachers}</p></div>
  `;

  reportTableContainer.innerHTML = `
    <h3>Bảng người dùng</h3>
    <table>
      <thead>
        <tr><th>STT</th><th>Tên</th><th>Email</th><th>Vai trò</th><th>Ngày</th></tr>
      </thead>
      <tbody>
        ${
          users.length === 0
            ? `<tr><td colspan="5" style="text-align:center">Không có dữ liệu</td></tr>`
            : users
                .map(
                  (u, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.role === "teacher" ? "Giảng viên" : "Học viên"}</td>
               <td>${
                 parseAnyDate(u.date)
                   ? parseAnyDate(u.date).toLocaleDateString("vi-VN")
                   : "Chưa có ngày"
               }</td>


              </tr>
            `
                )
                .join("")
        }
      </tbody>
    </table>
  `;

  exportDiv.innerHTML = `<button onclick="window.print()">Xuất PDF</button>`;
}

// ======================= COURSES =======================
function renderCourseStats(from, to) {
  const raw = localStorage.getItem("courses");
  let courses = [];

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      courses = Array.isArray(parsed) ? parsed : Object.values(parsed);
    } catch (e) {
      console.error("courses lỗi:", e);
    }
  }

  if (from && to) {
    const f = parseDateYMD(from);
    const t = parseDateYMD(to);
    courses = courses.filter((c) => {
      const d = parseAnyDate(c.date);
      return !d || (d >= f && d <= t);
    });
  }

  const totalCourses = courses.length;
  const totalRevenue = courses.reduce((sum, c) => {
    const price = Number(c.price) || 0;
    const count = Array.isArray(c.students) ? c.students.length : 0;
    return sum + price * count;
  }, 0);

  statsContainer.innerHTML = `
    <div class="card"><h3>Tổng khóa học</h3><p>${totalCourses}</p></div>
    <div class="card"><h3>Doanh thu</h3><p>${formatVND(totalRevenue)}</p></div>
  `;

  reportTableContainer.innerHTML = `
    <h3>Bảng khóa học</h3>
    <table>
      <thead>
        <tr><th>STT</th><th>Tên</th><th>Tổng học viên</th><th>Giá</th><th>Doanh thu</th></tr>
      </thead>
      <tbody>
        ${
          courses.length === 0
            ? `<tr><td colspan="5" style="text-align:center">Không có khóa học</td></tr>`
            : courses
                .map((c, i) => {
                  const price = Number(c.price) || 0;
                  const count = Array.isArray(c.students)
                    ? c.students.length
                    : 0;
                  return `
                    <tr>
                      <td>${i + 1}</td>
                      <td>${c.name || "Không tên"}</td>
                      <td>${count}</td>
                      <td>${formatVND(price)}</td>
                      <td>${formatVND(price * count)}</td>
                    </tr>
                  `;
                })
                .join("")
        }
      </tbody>
    </table>
  `;

  exportDiv.innerHTML = `<button onclick="window.print()">Xuất PDF</button>`;
}

// ======================= REVENUE =======================
function renderRevenueStats(from, to) {
  const raw = localStorage.getItem("courses");
  let courses = [];

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      courses = Array.isArray(parsed) ? parsed : Object.values(parsed);
    } catch (e) {
      console.error("courses lỗi:", e);
    }
  }

  let transactions = [];

  courses.forEach((course) => {
    const price = Number(course.price) || 0;

    if (!Array.isArray(course.students)) return;

    course.students.forEach((s) => {
      const d = parseAnyDate(s.date);
      if (!d) return;

      // lọc theo ngày
      if (from && to) {
        const f = parseDateYMD(from);
        const t = parseDateYMD(to);
        if (d < f || d > t) return;
      }

      transactions.push({
        student: s.name || s.email || "Không tên",
        course: course.name || "Không rõ",
        amount: price,
        date: d,
        status: "Đã thanh toán",
      });
    });
  });

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

  statsContainer.innerHTML = `
    <div class="card"><h3>Tổng doanh thu</h3><p>${formatVND(
      totalRevenue
    )}</p></div>
    <div class="card"><h3>Tổng giao dịch</h3><p>${transactions.length}</p></div>
  `;

  reportTableContainer.innerHTML = `
    <h3>Bảng doanh thu</h3>
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Học viên</th>
          <th>Khóa học</th>
          <th>Số tiền</th>
          <th>Ngày</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        ${
          transactions.length === 0
            ? `<tr><td colspan="6" style="text-align:center">Không có giao dịch</td></tr>`
            : transactions
                .map(
                  (t, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${t.student}</td>
                <td>${t.course}</td>
                <td>${formatVND(t.amount)}</td>
                <td>${t.date.toLocaleDateString("vi-VN")}</td>
                <td>${t.status}</td>
              </tr>
            `
                )
                .join("")
        }
      </tbody>
    </table>
  `;

  exportDiv.innerHTML = `<button onclick="window.print()">Xuất PDF</button>`;
}

// ======================= EVENTS =======================
selectType.addEventListener("change", () => {
  renderContent(
    selectType.value,
    fromDateInput?.value || null,
    toDateInput?.value || null
  );
});

applyButton?.addEventListener("click", () => {
  if (
    fromDateInput?.value &&
    toDateInput?.value &&
    parseDateYMD(fromDateInput.value) > parseDateYMD(toDateInput.value)
  ) {
    alert("Từ ngày không được lớn hơn Đến ngày");
    return;
  }
  renderContent(selectType.value, fromDateInput.value, toDateInput.value);
});

// ======================= INIT =======================
renderContent("user");
# Database optimization
# UI/UX improvements
# Database optimization
# API improvements
