        const btn = document.getElementById("toggleMenu");
        const menu = document.getElementById("questionMenu");

        btn.addEventListener("click", () => {
            menu.classList.toggle("show");
        });