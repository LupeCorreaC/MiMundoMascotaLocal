const appointmentsList = document.querySelector("#appointmentsList");
const activeUser = JSON.parse(localStorage.getItem("mundoMascotaUsuarioActivo"));

const renderAppointmentCard = (appointment) => {
  const card = document.createElement("article");
  card.className = "appointment-card";
  card.innerHTML = `
    <div class="appointment-card__header">
      <span class="eyebrow">${appointment.category}</span>
      <h3>${appointment.serviceType}</h3>
      <strong>${appointment.businessName}</strong>
    </div>
    <div class="appointment-card__body">
      <p><strong>Mascota:</strong> ${appointment.petName}</p>
      <p><strong>Fecha:</strong> ${appointment.date}</p>
      <p><strong>Horario:</strong> ${appointment.time}</p>
      <p><strong>Total:</strong> ${new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(appointment.total)}</p>
    </div>
  `;
  appointmentsList.appendChild(card);
};

if (!activeUser) {
  appointmentsList.innerHTML = `
    <div class="empty-state">
      <h2>Debes iniciar sesión</h2>
      <p>Ingresa a tu cuenta para ver tus citas programadas y realizar nuevas reservas.</p>
      <a class="btn btn--primary" href="login.html">Ingresar</a>
    </div>
  `;
} else {
  const allAppointments = JSON.parse(localStorage.getItem("mundoMascotaCitas")) || [];
  const userAppointments = allAppointments.filter((appointment) => appointment.userEmail === activeUser.email);

  if (!userAppointments.length) {
    appointmentsList.innerHTML = `
      <div class="empty-state">
        <h2>No tienes citas agendadas</h2>
        <p>Aún no has confirmado ninguna cita. Agenda un servicio para tu mascota.</p>
        <a class="btn btn--primary" href="agendar.html">Agendar cita</a>
      </div>
    `;
  } else {
    userAppointments.forEach((appointment) => renderAppointmentCard(appointment));
  }
}
