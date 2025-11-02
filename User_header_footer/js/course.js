const btnMenuIcon = document.getElementById("menu-icon");
const Categorys = document.querySelector(".categorys");

btnMenuIcon.addEventListener("click", () => {
  Categorys.classList.toggle("active");
});
