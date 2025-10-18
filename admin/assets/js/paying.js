// ======================= DỮ LIỆU GIẢ =======================
const payments = [
  {
    id: "TX001",
    student: "Nguyễn Văn A",
    course: "IELTS",
    amount: 1500000,
    method: "Chuyển khoản",
    date: "2025-10-10",
    status: "Đã thanh toán",
  },
  {
    id: "TX002",
    student: "Trần Thị B",
    course: "TOEIC",
    amount: 1200000,
    method: "Tiền mặt",
    date: "2025-10-11",
    status: "Chưa thanh toán",
  },
  {
    id: "TX003",
    student: "Lê Minh C",
    course: "IELTS",
    amount: 2000000,
    method: "Ví Momo",
    date: "2025-10-12",
    status: "Chờ xác nhận",
  },
  {
    id: "TX003",
    student: "Lê Minh C",
    course: "IELTS",
    amount: 2000000,
    method: "Ví Momo",
    date: "2025-10-12",
    status: "Chờ xác nhận",
  },
];

// ======================= LẤY PHẦN TỬ HTML =======================
const paymentTableBody = document.getElementById("paymentTableBody");
const searchPayment = document.getElementById("searchPayment");
const roleFilter = document.getElementById("roleFilter");
const roleFilterCourse = document.getElementById("roleFilterCourse");
const dateFrom = document.getElementById("fromDate");
const dateTo = document.getElementById("toDate");
const applyDate = document.getElementById("applyDate");
const paymentModal = document.getElementById("paymentModal");

//==========HIỂN THỊ DỮ LIỆU HEADER===============
const Total = document.getElementById("Total");
const totalTrade = document.getElementById("totalTrade");
const tradeSuccsess = document.getElementById("tradeSuccsess");
const tradeFail = document.getElementById("tradeFail");

function displayTotal(payments) {
  var total = 0;
  var trade = 0;
  var succsess = 0;
  var fail = 0;
  for (var i = 0; i < payments.length; i++) {
    if (payments[i].status === "Đã thanh toán") {
      total += payments[i].amount;
      succsess += 1;
    } else {
      fail += 1;
    }
    trade += 1;
  }
  Total.textContent = total.toLocaleString() + "đ";
  totalTrade.textContent = trade;
  tradeSuccsess.textContent = succsess;
  tradeFaild.textContent = fail;
}

displayTotal(payments);

// ======================= HIỂN THỊ DỮ LIỆU =======================
function displayPayment(list_payment) {
  paymentTableBody.innerHTML = "";

  if (list_payment.length === 0) {
    paymentTableBody.innerHTML = `
      <tr><td colspan="8" style="text-align:center;">Không có dữ liệu phù hợp</td></tr>`;
    return;
  }

  list_payment.forEach((p) => {
    paymentTableBody.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.student}</td>
        <td>${p.course}</td>
        <td>${p.amount.toLocaleString()}đ</td>
        <td>${p.method}</td>
        <td>${p.date}</td>
        <td>${p.status}</td>
        <td class="actions">
          <button class="view-btn" onclick="View('${
            p.id
          }')">Xem chi tiết</button>
          ${
            p.status === "Chờ xác nhận"
              ? `<button class="confirm-btn" onclick="confirmPayment('${p.id}')">Xác nhận thủ công</button>`
              : ""
          }
          ${
            p.status === "Đã thanh toán"
              ? `<button class="refund-btn" onclick="refundPayment('${p.id}')">Hoàn tiền</button>`
              : ""
          }
          <button class="delete-btn" onclick="deletePayment('${
            p.id
          }')">Xóa</button>
        </td>
      </tr>
    `;
  });
}

// ======================= LỌC THANH TOÁN =======================
function filterPayments() {
  const keyword = searchPayment.value.toLowerCase();
  const status = roleFilter.value;
  const course = roleFilterCourse.value;
  const fromDate = dateFrom.value ? new Date(dateFrom.value) : null;
  const toDate = dateTo.value ? new Date(dateTo.value) : null;

  const filtered = payments.filter((p) => {
    const matchKeyword =
      p.id.toLowerCase().includes(keyword) ||
      p.student.toLowerCase().includes(keyword);

    const matchStatus =
      status === "all" ||
      (status === "paid" && p.status === "Đã thanh toán") ||
      (status === "unpaid" && p.status === "Chưa thanh toán") ||
      (status === "confirm" && p.status === "Chờ xác nhận");

    const matchCourse = course === "all" || p.course.toLowerCase() === course;

    const paymentDate = new Date(p.date);
    let matchDate = true;
    if (fromDate && paymentDate < fromDate) matchDate = false;
    if (toDate && paymentDate > toDate) matchDate = false;

    return matchKeyword && matchStatus && matchCourse && matchDate;
  });

  displayPayment(filtered);
}

// ======================= XEM CHI TIẾT =======================
function View(id) {
  const pay = payments.find((p) => p.id === id);
  if (!pay) return alert("Không tìm thấy giao dịch này!");

  paymentModal.style.display = "flex";
  paymentModal.innerHTML = `
    <div class="modal-content">
      <h3>Thông tin hóa đơn</h3>
      <p><b>Mã giao dịch:</b> ${pay.id}</p>
      <p><b>Học viên:</b> ${pay.student}</p>
      <p><b>Khóa học:</b> ${pay.course}</p>
      <p><b>Số tiền:</b> ${pay.amount.toLocaleString()}đ</p>
      <p><b>Phương thức:</b> ${pay.method}</p>
      <p><b>Ngày:</b> ${pay.date}</p>
      <p><b>Trạng thái:</b> ${pay.status}</p>
      <button id="closeModalBtn">Đóng</button>
    </div>
  `;

  document.getElementById("closeModalBtn").addEventListener("click", () => {
    paymentModal.style.display = "none";
  });
}

// ======================= XÓA GIAO DỊCH =======================
function deletePayment(id) {
  const index = payments.findIndex((p) => p.id === id);
  if (index === -1) return alert("Không tìm thấy giao dịch!");
  if (confirm("Bạn có chắc muốn xóa giao dịch này không?")) {
    payments.splice(index, 1);
    filterPayments();
  }
}

// ======================= XÁC NHẬN THỦ CÔNG =======================
function confirmPayment(id) {
  const pay = payments.find((p) => p.id === id);
  if (!pay) return alert("Không tìm thấy giao dịch!");
  pay.status = "Đã thanh toán";
  alert("Đã xác nhận thanh toán thủ công!");
  filterPayments();
}

// ======================= HOÀN TIỀN =======================
function refundPayment(id) {
  const pay = payments.find((p) => p.id === id);
  if (!pay) return alert("Không tìm thấy giao dịch!");
  pay.status = "Đã hoàn tiền";
  alert("Đã hoàn tiền cho học viên!");
  filterPayments();
}

// ======================= SỰ KIỆN =======================
searchPayment.addEventListener("input", filterPayments);
roleFilter.addEventListener("change", filterPayments);
roleFilterCourse.addEventListener("change", filterPayments);
applyDate.addEventListener("click", filterPayments);

// ======================= HIỂN THỊ MẶC ĐỊNH =======================
displayPayment(payments);
