    document.addEventListener("DOMContentLoaded", function () {
        const toggleBtn = document.getElementById("toggleFilter");
        const overlay = document.getElementById("filterOverlay");
        const closeBtn = document.getElementById("closeFilter");

        toggleBtn.addEventListener("click", () => {
            overlay.style.display = "flex"; // hiện overlay
        });

        closeBtn.addEventListener("click", () => {
            overlay.style.display = "none"; // ẩn overlay
        });
    });
// shop.js (không dùng innerHTML, không tạo nút "Xem chi tiết")
document.addEventListener("DOMContentLoaded", () => {
  const headerCountEl = document.querySelector(".product-header h2");
  const productCardContainer = document.querySelector(".product-card");

  // CourseReader đã có trong scope
  const reader = new CourseReader();

  function escapeText(str) {
    return str == null ? "" : String(str);
  }

  function createProductCardElement(product) {
    // product: { id, name, author, duration, rating, price, imageUrl }
    const card = document.createElement("div");
    card.className = "product-card-item";

    // image container
    const imgDiv = document.createElement("div");
    imgDiv.className = "product-card-item-img";
    const imageUrl = escapeText(product.imageUrl || "../img/img_GUI/096dabbf-65c6-4096-bc72-ddc405f6b795.jpg");
    imgDiv.style.backgroundImage = `url('${imageUrl}')`;
    imgDiv.style.backgroundPosition = "center";
    imgDiv.style.backgroundRepeat = "no-repeat";
    imgDiv.style.backgroundSize = "cover";

    // title
    const h3 = document.createElement("h3");
    h3.textContent = escapeText(product.name || "Tên sản phẩm");

    // author
    const authorSpan = document.createElement("span");
    authorSpan.className = "product-card-item-rating";
    authorSpan.textContent = escapeText(product.author || "Tên tác giả");

    // duration
    const durationSpan = document.createElement("span");
    durationSpan.className = "product-card-item-duration";
    durationSpan.textContent = escapeText(product.duration || "");

    // rating
    const ratingSpan = document.createElement("span");
    ratingSpan.className = "product-card-item-rating";
    ratingSpan.textContent = escapeText(product.rating || "");

    // price container
    const priceContainer = document.createElement("div");
    priceContainer.className = "product-card-item-price";

    const priceSpan = document.createElement("span");
    priceSpan.className = "price";
    priceSpan.textContent = escapeText(product.price || "Liên hệ");

    // gắn các phần vào card (không có nút)
    priceContainer.appendChild(priceSpan);

    card.appendChild(imgDiv);
    card.appendChild(h3);
    card.appendChild(authorSpan);
    card.appendChild(durationSpan);
    card.appendChild(ratingSpan);
    card.appendChild(priceContainer);

    return card;
  }

  function renderProductsFromCourses() {
    const courses = reader.getAllCourses(); // clone mảng
    const count = courses.length;
    if (headerCountEl) headerCountEl.textContent = `Tìm được ${count} sản phẩm:`;

    if (!productCardContainer) return;
    // clear children safely
    while (productCardContainer.firstChild) {
      productCardContainer.removeChild(productCardContainer.firstChild);
    }

    if (count === 0) {
      const p = document.createElement("p");
      p.textContent = "Không tìm thấy sản phẩm nào.";
      productCardContainer.appendChild(p);
      return;
    }

    courses.forEach((course) => {
      const product = {
        id: course.id,
        name: course.name,
        author: course.teacher || "",
        duration: course.date || "",
        rating: course.rating || "",
        price: (course.price !== undefined && course.price !== null) ? `${course.price} VND` : "Liên hệ",
        imageUrl: course.imageUrl || course.thumbnail || "../img/img_GUI/096dabbf-65c6-4096-bc72-ddc405f6b795.jpg"
      };
      const cardEl = createProductCardElement(product);
      productCardContainer.appendChild(cardEl);
    });
  }

  // fallback: nếu không có courses, thử key "products"
  function renderProductsFallback() {
    const raw = localStorage.getItem("products");
    if (!raw) return false;
    try {
      const parsed = JSON.parse(raw);
      const arr = Array.isArray(parsed) ? parsed : (typeof parsed === "object" ? Object.values(parsed) : []);
      if (!arr.length) return false;

      if (headerCountEl) headerCountEl.textContent = `Tìm được ${arr.length} sản phẩm:`;

      while (productCardContainer.firstChild) {
        productCardContainer.removeChild(productCardContainer.firstChild);
      }

      arr.forEach((p) => {
        const product = {
          id: p.id,
          name: p.name || p.title,
          author: p.author || p.teacher,
          duration: p.duration,
          rating: p.rating,
          price: p.price || "Liên hệ",
          imageUrl: p.imageUrl || p.thumbnail || "../img/img_GUI/096dabbf-65c6-4096-bc72-ddc405f6b795.jpg"
        };
        const cardEl = createProductCardElement(product);
        productCardContainer.appendChild(cardEl);
      });
      return true;
    } catch (e) {
      console.error("Không parse được products:", e);
      return false;
    }
  }

  // thực thi render
  if (reader.getAllCourses().length > 0) {
    renderProductsFromCourses();
  } else if (!renderProductsFallback()) {
    if (headerCountEl) headerCountEl.textContent = `Tìm được 0 sản phẩm:`;
    if (productCardContainer) {
      while (productCardContainer.firstChild) productCardContainer.removeChild(productCardContainer.firstChild);
      const p = document.createElement("p");
      p.textContent = "Không có dữ liệu sản phẩm để hiển thị.";
      productCardContainer.appendChild(p);
    }
  }

  // lắng nghe storage thay đổi từ tab khác
  window.addEventListener("storage", (e) => {
    if (e.key === reader.coursesKey || e.key === "products") {
      reader.reload();
      if (reader.getAllCourses().length > 0) renderProductsFromCourses();
      else renderProductsFallback();
    }
  });
});
