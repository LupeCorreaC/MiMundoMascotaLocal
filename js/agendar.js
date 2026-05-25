const appointmentForm = document.querySelector("#appointmentForm");
const serviceSelect = document.querySelector("#serviceSelect");
const summaryCard = document.querySelector("#summaryCard");
const bookingMessage = document.querySelector("#bookingMessage");
const appointmentTime = document.querySelector("#appointmentTime");
const appointmentDate = document.querySelector("#appointmentDate");

const availableTimes = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const serviceOptions = [
  {
    id: "veterinaria",
    label: "Consulta veterinaria",
    category: "Salud veterinaria",
    businessName: "Veterinaria Vida Animal",
    services: ["Consulta general", "Vacunación", "Control preventivo"],
    total: 120000,
  },
  {
    id: "peluqueria",
    label: "Peluquería y baño",
    category: "Higiene y estética",
    businessName: "Peluquería Canina Bella",
    services: ["Baño completo", "Corte de pelaje", "Limpieza de oídos"],
    total: 85000,
  },
  {
    id: "guarderia",
    label: "Guardería y estadía",
    category: "Cuidado y estadía",
    businessName: "Guardería Mascotas Felices",
    services: ["Cuidado diario", "Alojamiento nocturno", "Alimentación supervisada"],
    total: 150000,
  },
  {
    id: "examenes",
    label: "Exámenes básicos",
    category: "Apoyo diagnóstico",
    businessName: "Laboratorio Animal Plus",
    services: ["Examen de sangre", "Prueba fecal", "Revisión general"],
    total: 100000,
  },
];

const activeUser = JSON.parse(localStorage.getItem("mundoMascotaUsuarioActivo"));
const storedService = JSON.parse(localStorage.getItem("mundoMascotaCita"));
const storedAppointments = JSON.parse(localStorage.getItem("mundoMascotaCitas")) || [];

const today = new Date().toISOString().split("T")[0];

const loadTimeOptions = () => {
  appointmentTime.innerHTML = "<option value=\"\">Selecciona un horario</option>";
  availableTimes.forEach((time) => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;
    appointmentTime.appendChild(option);
  });
};

const populateServiceSelect = () => {
  serviceOptions.forEach((option) => {
    const element = document.createElement("option");
    element.value = option.id;
    element.textContent = `${option.label} — ${option.businessName}`;
    serviceSelect.appendChild(element);
  });
};

const renderSummary = (service) => {
  if (!service) {
    summaryCard.innerHTML = "<p class=\"muted\">Ningún servicio seleccionado aún. Elige uno para ver el resumen.</p>";
    return;
  }

  summaryCard.innerHTML = `
    <div class="service-summary">
      <span class="eyebrow">${service.category}</span>
      <h3>${service.label}</h3>
      <strong>${service.businessName}</strong>
      <p>${service.services.join(", ")}</p>
      <p><strong>Total estimado:</strong> ${new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(service.total)}</p>
    </div>
  `;
};

const getServiceById = (id) => serviceOptions.find((service) => service.id === id);

const startWithStoredService = () => {
  if (!storedService) return;
  const service = serviceOptions.find((item) => item.businessName === storedService.businessName);
  if (service) {
    serviceSelect.value = service.id;
    renderSummary(service);
  }
};

const validateBooking = (service, date, time) => {
  if (!service) return "Selecciona un servicio antes de continuar.";
  if (!date) return "Selecciona una fecha disponible.";
  if (!time) return "Selecciona un horario disponible.";
  if (date < today) return "La fecha debe ser igual o posterior a hoy.";

  const conflict = storedAppointments.some((appointment) => {
    return (
      appointment.date === date &&
      appointment.time === time &&
      appointment.businessName === service.businessName
    );
  });

  if (conflict) {
    return "El horario ya está ocupado. Por favor elige otro horario.";
  }

  return "";
};

const showMessage = (message, isError = true) => {
  bookingMessage.textContent = message;
  bookingMessage.style.color = isError ? "#b91c1c" : "#047857";
};

if (appointmentDate) {
  appointmentDate.min = today;
}

if (serviceSelect) {
  populateServiceSelect();
  loadTimeOptions();
  startWithStoredService();

  serviceSelect.addEventListener("change", () => {
    const selectedService = getServiceById(serviceSelect.value);
    renderSummary(selectedService);
  });
}

if (appointmentForm) {
  appointmentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const service = getServiceById(serviceSelect.value);
    const petName = document.querySelector("#petName").value.trim();
    const date = appointmentDate.value;
    const time = appointmentTime.value;

    if (!activeUser) {
      showMessage("Debes iniciar sesión para confirmar la cita.");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);
      return;
    }

    const validationMessage = validateBooking(service, date, time);
    if (validationMessage) {
      showMessage(validationMessage);
      return;
    }

    if (!petName) {
      showMessage("Ingresa el nombre de tu mascota.");
      return;
    }

    const appointment = {
      userEmail: activeUser.email,
      userName: activeUser.name,
      petName,
      category: service.category,
      serviceType: service.label,
      businessName: service.businessName,
      services: service.services,
      total: service.total,
      date,
      time,
      createdAt: new Date().toISOString(),
    };

    storedAppointments.push(appointment);
    localStorage.setItem("mundoMascotaCitas", JSON.stringify(storedAppointments));
    localStorage.removeItem("mundoMascotaCita");

    showMessage("Cita confirmada con éxito. Serás redirigido a Mis citas...", false);

    setTimeout(() => {
      window.location.href = "mis-citas.html";
    }, 1300);
  });
}
