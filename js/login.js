const loginForm = document.querySelector("#loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.querySelector("#loginEmail").value.trim();
    const password = document.querySelector("#loginPassword").value.trim();

    if (!email || !password) {
      alert("Por favor ingresa tu correo y contraseña.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("mundoMascotaUsuarios")) || [];
    const user = users.find((item) => item.email === email && item.password === password);

    if (!user) {
      alert("Correo o contraseña incorrectos.");
      return;
    }

    const activeUser = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    localStorage.setItem("mundoMascotaUsuarioActivo", JSON.stringify(activeUser));
    window.location.href = "index.html";
  });
}
