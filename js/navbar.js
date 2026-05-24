document.addEventListener("DOMContentLoaded", () => {
  const navbarToggle = document.querySelector(".navbar__toggle");
  const navbarMenu = document.querySelector(".navbar__menu");

  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener("click", () => {
      navbarMenu.classList.toggle("is-open");
    });

    navbarMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navbarMenu.classList.remove("is-open");
      });
    });
  }

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".navbar__link").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === currentPage);
  });

  const activeUser = JSON.parse(
    localStorage.getItem("mundoMascotaUsuarioActivo"),
  );

  if (navbarMenu && activeUser) {
    navbarMenu
      .querySelectorAll('a[href="login.html"], a[href="registro.html"]')
      .forEach((el) => el.parentElement.remove());

    const alreadyHasCitas = navbarMenu.querySelector(
      'a[href="mis-citas.html"]',
    );

    if (!alreadyHasCitas) {
      const citasItem = document.createElement("li");
      citasItem.innerHTML = `<a href="mis-citas.html" class="navbar__link">Mis citas</a>`;
      navbarMenu.appendChild(citasItem);
    }

    const userItem = document.createElement("li");
    userItem.innerHTML = `
      <div class="navbar-user">
        <span>👤 ${activeUser.name}</span>
        <button class="logout-btn">Salir</button>
      </div>
    `;
    navbarMenu.appendChild(userItem);
  }

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("logout-btn")) {
      localStorage.removeItem("mundoMascotaUsuarioActivo");
      window.location.href = "index.html";
    }
  });
});