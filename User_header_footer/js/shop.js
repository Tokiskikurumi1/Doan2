// shop.js
import { CourseManager } from "./object"; // <-- chỉnh đường dẫn tới object.js

document.addEventListener("DOMContentLoaded", () => {
  const productCard = document.getElementById("productCard");
  const resultCount = document.getElementById("resultCount");
  const toggleBtn = document.getElementById("toggleFilter");
  const overlay = document.getElementById("filterOverlay");
  const closeBtn = document.getElementById("closeFilter");
  const applyFilterBtn = document.getElementById("applyFilter");
  const resetFilterBtn = document.getElementById("resetFilter");
  const filterForm = document.getElementById("filterForm");

  const detailModal = document.getElementById("detailModal");
  const detailBody = document.getElementById("detailBody");
  const closeDetail = document.getElementById("closeDetail");

    const allCOurse = JSON.parse(localStorage.getItem("courses"));
    
  // Lấy courses từ CourseManager
  let courses = CourseManager.getAllCourses();

  // Nếu chưa có courses trong storage, không làm gì (hoặc bạn có thể thêm mẫu)
  // Map course -> product item (dễ render)
  function mapCourseToProduct(c) {
    return {
      id: c.id,
      type: c.type || "course",
      title: c.name || "Không có tên",
      author: c.teacher || "Không rõ",
      duration: (c.videos && c.videos.length) ? `${c.videos.length} video` : "",
      rating: c.rating || 0,
      price: c.price || 0,
      level: c.level || "medium",
      img: c.img || "../img/img_GUI/096dabbf-65c6-4096-bc72-ddc405f6b795.jpg",
      detail: c.detail || ""
    };
  }

  const products = courses.map(mapCourseToProduct);

  // Render danh sách
  function render(list) {
    productCard.innerHTML = "";
    if (!list || list.length === 0) {
      productCard.innerHTML = `<p>Không tìm thấy sản phẩm.</p>`;
      resultCount.textContent = `Tìm được 0 sản phẩm:`;
      return;
    }
    resultCount.textContent = `Tìm được ${list.length} sản phẩm:`;
    list.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card-item";
      card.innerHTML = `
        <div class="product-card-item-img" style="background-image:url('${escapeHtml(p.img)}')"></div>
        <h3>${escapeHtml(p.title)}</h3>
        <span class="product-card-item-rating">${escapeHtml(p.author)}</span>
        <span class="product-card-item-duration">${escapeHtml(p.duration)}</span>
        <span class="product-card-item-rating">⭐ ${p.rating}</span>
        <div class="product-card-item-price">
          <span class="price">${formatPrice(p.price)}</span>
          <button class="btn-detail" data-id="${p.id}">Xem chi tiết</button>
        </div>
      `;
      productCard.appendChild(card);
    });
  }

  function escapeHtml(str = "") {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function formatPrice(num) {
    return new Intl.NumberFormat("vi-VN").format(num) + " VND";
  }

  // Hiển thị overlay bộ lọc
  toggleBtn.addEventListener("click", () => {
    overlay.style.display = "flex";
  });
  closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  // Áp dụng bộ lọc (lọc trên courses gốc)
  applyFilterBtn?.addEventListener("click", () => {
    const form = new FormData(filterForm);
    const type = form.get("type") || "all";
    const level = form.get("level") || "all";
    const rating = parseFloat(form.get("rating") || "0");

    const filtered = courses.filter(c => {
      if (type !== "all" && (c.type || "") !== type) return false;
      if (level !== "all" && (c.level || "medium") !== level) return false;
      if (rating > 0 && (c.rating || 0) < rating) return false;
      return true;
    }).map(mapCourseToProduct);

    render(filtered);
    overlay.style.display = "none";
  });

  // Reset bộ lọc
  resetFilterBtn?.addEventListener("click", () => {
    filterForm.reset();
    // đặt radio mặc định
    filterForm.querySelectorAll('input[name="type"]').forEach(i => { if (i.value === "all") i.checked = true; });
    filterForm.querySelectorAll('input[name="level"]').forEach(i => { if (i.value === "all") i.checked = true; });
    filterForm.querySelectorAll('input[name="rating"]').forEach(i => { if (i.value === "0") i.checked = true; });
    render(products);
  });

  // Delegation: bắt click xem chi tiết (chỉ hiển thị modal)
  productCard.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-detail");
    if (!btn) return;
    const id = btn.dataset.id;
    // Lấy course gốc từ CourseManager để hiển thị chi tiết đầy đủ
    const course = CourseManager.getCourseById(id);
    if (!course) return;
    openDetail(course);
  });

  function openDetail(course) {
    detailBody.innerHTML = `
      <img src="${course.img || '../img/img_GUI/096dabbf-65c6-4096-bc72-ddc405f6b795.jpg'}" alt="${escapeHtml(course.name)}" style="max-width:100%;border-radius:6px;margin-bottom:12px;" />
      <h3>${escapeHtml(course.name)}</h3>
      <p><strong>Giảng viên:</strong> ${escapeHtml(course.teacher || "")}</p>
      <p><strong>Loại:</strong> ${escapeHtml(course.type || "")} • <strong>Trình độ:</strong> ${escapeHtml(course.level || "")}</p>
      <p><strong>Ngày:</strong> ${escapeHtml(course.date || "")}</p>
      <p><strong>Giá:</strong> ${formatPrice(course.price || 0)}</p>
      <p>${escapeHtml(course.detail || "")}</p>
    `;
    detailModal.style.display = "flex";
  }

  function closeDetailModal() {
    detailModal.style.display = "none";
    detailBody.innerHTML = "";
  }

  closeDetail.addEventListener("click", closeDetailModal);
  detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) closeDetailModal();
  });

  // Khởi tạo hiển thị
  render(products);
});
