const searchBox = document.getElementById("searchBox");
const searchInput = searchBox.querySelector("input");
const searchIcon = document.getElementById("searchIcon");
const resultsContainer = document.getElementById("search-results-container");
const searchWrapper = document.querySelector(".header-search");
const searchResults = document.querySelector(".header-search-results");

let searchOpened = false;

searchResults.style.display = "none";

searchIcon.addEventListener("click", function () {
  if (!searchOpened) {
    searchWrapper.classList.add("active");
    searchInput.focus();
    searchOpened = true;
  } else {
    window.location.href = "/search";
  }
});


searchInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase().trim();
  resultsContainer.innerHTML = "";

  if (keyword === "") {
    searchResults.style.display = "none";
    return;
  }

  const filtered = ["a", "b", "c", "d", "e"].filter(item =>
    item.toLowerCase().includes(keyword)
  );

  if (filtered.length > 0) {
    searchResults.style.display = "block";
    filtered.forEach(item => {
      const div = document.createElement("div");
      div.className = "header-search-results-item";
      div.textContent = item;
      resultsContainer.appendChild(div);
    });
  } else {
    searchResults.style.display = "none";
  }
});

document.addEventListener("click", function (e) {
  const isClickInside = searchWrapper.contains(e.target);
  if (!isClickInside) {
    searchWrapper.classList.remove("active");
    searchResults.style.display = "none";
    searchOpened = false;
  }
});




