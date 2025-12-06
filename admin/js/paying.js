// ======================= LẤY PHẦN TỬ HTML =======================
const paymentTableBody = document.getElementById("paymentTableBody");
const searchPayment = document.getElementById("searchPayment");
const roleFilterCourse = document.getElementById("roleFilterCourse");
const dateFrom = document.getElementById("fromDate");
const dateTo = document.getElementById("toDate");
const applyDate = document.getElementById("applyDate");
const paymentModal = document.getElementById("paymentModal");
const payId = document.getElementById("payId");
const payName = document.getElementById("payName");
const payCourse = document.getElementById("payCourse");
const payAmount = document.getElementById("payAmount");
const payMethod = document.getElementById("payMethod");
const payDate = document.getElementById("payDate");
const payStatus = document.getElementById("payStatus");

// Header thống kê
const Total = document.getElementById("Total");
const totalTrade = document.getElementById("totalTrade");
const tradeSuccsess = document.getElementById("tradeSuccsess");

// ======================= CÀI ĐẶT PHÂN TRANG =======================
const itemsPerPage = 10;
let currentPage = 1;
let currentList = []; // Danh sách sau khi lọc

// ======================= HIỂN THỊ TỔNG TIỀN & THỐNG KÊ =======================
function displayTotal(list) {
  const totalAmount = list.reduce((sum, p) => sum + p.amount, 0);
  Total.textContent = totalAmount.toLocaleString() + "đ";
  totalTrade.textContent = list.length;
  tradeSuccsess.textContent = list.length;
}

// ======================= HIỂN THỊ DANH SÁCH + PHÂN TRANG =======================
function displayPayment(list_payment) {
  currentList = list_payment;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = currentList.slice(start, end);

  paymentTableBody.innerHTML = "";

  if (currentList.length === 0) {
    paymentTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 40px 0;">Không có dữ liệu phù hợp</td></tr>`;
  } else {
    paginatedItems.forEach((p) => {
      paymentTableBody.innerHTML += `
        <tr>
          <td>${p.id}</td>
          <td>${p.student}</td>
          <td>${p.course}</td>
          <td>${p.amount.toLocaleString()}đ</td>
          <td>${p.method}</td>
          <td>${p.date}</td>
          <td><span class="status-paid">Đã thanh toán</span></td>
          <td class="actionsTable">
            <button class="view-btn" onclick="View('${
              p.id
            }')"><i class="fas fa-eye"></i></button>
            <button class="delete-btn" onclick="deletePayment('${p.id}')">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
  }

  renderPagination();
  displayTotal(currentList); // Cập nhật thống kê theo dữ liệu đang hiển thị
}

// ======================= LỌC DỮ LIỆU =======================
function filterPayments() {
  const keyword = searchPayment.value.toLowerCase().trim();
  const course = roleFilterCourse.value;
  const from = dateFrom.value ? new Date(dateFrom.value) : null;
  const to = dateTo.value ? new Date(dateTo.value) : null;

  let filtered = payments.filter((p) => {
    const matchKeyword =
      p.id.toLowerCase().includes(keyword) ||
      p.student.toLowerCase().includes(keyword);

    const matchCourse = course === "All" || p.course === course;

    const pDate = new Date(p.date);
    const matchDate = (!from || pDate >= from) && (!to || pDate <= to);

    return matchKeyword && matchCourse && matchDate;
  });

  currentPage = 1; // Reset về trang 1 khi lọc
  displayPayment(filtered);
}

// ======================= PHÂN TRANG =======================
function renderPagination() {
  const totalItems = currentList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Cập nhật thông tin hiển thị
  document.getElementById("totalRecords").textContent = totalItems;
  document.getElementById("pageStart").textContent =
    totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  document.getElementById("pageEnd").textContent = Math.min(
    currentPage * itemsPerPage,
    totalItems
  );

  // Ẩn/Hiện nút Prev - Next
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage >= totalPages;

  // CHỈ HIỆN DUY NHẤT 1 SỐ: TRANG HIỆN TẠI
  const pageNumbers = document.getElementById("pageNumbers");
  pageNumbers.innerHTML = ""; // Xóa hết

  const currentBtn = document.createElement("div");
  currentBtn.className = "page-number active";
  currentBtn.textContent = currentPage;
  pageNumbers.appendChild(currentBtn);
}

function addPageButton(page) {
  const btn = document.createElement("div");
  btn.className = "page-number" + (page === currentPage ? " active" : "");
  btn.textContent = page;
  btn.onclick = () => {
    currentPage = page;
    displayPayment(currentList);
  };
  document.getElementById("pageNumbers").appendChild(btn);
}

document.getElementById("prevPage").onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    displayPayment(currentList);
  }
};

document.getElementById("nextPage").onclick = () => {
  if (currentPage < Math.ceil(currentList.length / itemsPerPage)) {
    currentPage++;
    displayPayment(currentList);
  }
};

// ======================= XEM CHI TIẾT & XÓA =======================
function View(id) {
  const pay = payments.find((p) => p.id === id);
  if (!pay) return alert("Không tìm thấy giao dịch!");

  paymentModal.style.display = "flex";
  payId.textContent = pay.id;
  payName.textContent = pay.student;
  payCourse.textContent = pay.course;
  payAmount.textContent = pay.amount.toLocaleString() + "đ";
  payMethod.textContent = pay.method;
  payDate.textContent = pay.date;
  payStatus.textContent = pay.status;

  document.getElementById("closeModalBtn").onclick = () => {
    paymentModal.style.display = "none";
  };
}

function deletePayment(id) {
  if (confirm("Bạn có chắc chắn muốn xóa giao dịch này không?")) {
    const index = payments.findIndex((p) => p.id === id);
    if (index !== -1) {
      payments.splice(index, 1);
      filterPayments(); // Tự động reload + phân trang
      alert("Đã xóa thành công!");
    }
  }
}

// ======================= SỰ KIỆN =======================
searchPayment.addEventListener("input", filterPayments);
roleFilterCourse.addEventListener("change", filterPayments);
applyDate.addEventListener("click", filterPayments);
dateFrom.addEventListener("change", filterPayments);
dateTo.addEventListener("change", filterPayments);

// ======================= BIỂU ĐỒ DOANH THU =======================
function updateMonthlyRevenueChart() {
  const boxColumn = document.getElementById("monthlyChart");
  if (!boxColumn) return;

  const bars = boxColumn.querySelectorAll(".chart-serie");
  const monthlyRevenue = Array(12).fill(0);

  payments.forEach((p) => {
    if (p.status === "Đã thanh toán") {
      const monthIndex = new Date(p.date).getMonth();
      monthlyRevenue[monthIndex] += p.amount;
    }
  });

  const MAX_REVENUE = 100000000; // 100 triệu = 100%

  bars.forEach((bar, index) => {
    const revenue = monthlyRevenue[index];
    let percent = (revenue / MAX_REVENUE) * 100;
    percent = Math.min(percent, 100);

    bar.style.setProperty("--i", percent + "%");

    let displayText = "";
    if (revenue >= 1000000) displayText = (revenue / 1000000).toFixed(1) + "tr";
    else if (revenue >= 1000) displayText = (revenue / 1000).toFixed(0) + "k";
    else if (revenue > 0) displayText = revenue.toLocaleString() + "đ";

    const title = bar.querySelector(".column-title");
    if (title) {
      title.textContent = revenue > 0 ? displayText : "";
      title.style.opacity = revenue > 0 ? "1" : "0";
    }
  });
}
updateMonthlyRevenueChart();

// ======================= KHỞI TẠO TRANG =======================
filterPayments(); // Load lần đầu + phân trang + thống kê đúng
