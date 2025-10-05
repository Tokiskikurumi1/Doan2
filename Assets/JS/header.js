fetch("header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("main-header").innerHTML = data;
    /*toggle menu icon */
    const menuIcon = document.querySelector("#menu-icon");
    const navBarMenuIconActive = document.querySelector(
      ".nav-bar-menu-icon-active"
    );

    menuIcon.addEventListener("click", () => {
      navBarMenuIconActive.classList.toggle("active");
      menuIcon.classList.toggle("fa-bars");
      menuIcon.classList.toggle("fa-x");
    });
  });
