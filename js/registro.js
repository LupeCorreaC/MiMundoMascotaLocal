const registerForm = document.querySelector("#registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.querySelector("#registerName").value.trim();
    const email = document.querySelector("#registerEmail").value.trim();
    const phone = document.querySelector("#registerPhone").value.trim();
    const password = document.querySelector("#registerPassword").value.trim();
    const role = document.querySelector("#registerRole").value;

    if (!name || !email || !phone || !password || !role) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const users =
      JSON.parse(localStorage.getItem("mundoMascotaUsuarios")) || [];

    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      alert("Este correo ya está registrado.");
      return;
    }

    const newUser = {
      name,
      email,
      phone,
      password,
      role,
    };

    users.push(newUser);

    localStorage.setItem("mundoMascotaUsuarios", JSON.stringify(users));

    alert("Registro exitoso. Ahora puedes iniciar sesión.");

    window.location.href = "login.html";
  });
}