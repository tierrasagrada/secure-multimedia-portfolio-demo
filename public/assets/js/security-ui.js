const submitButton =
  document.getElementById(
    "submit"
  );

/* =========================
   SHOW ERROR
========================= */

export function mostrarError(message) {

  const errorDiv =
    document.getElementById(
      "error"
    );

  errorDiv.textContent =
    message;

  errorDiv.classList.add(
    "active"
  );
}

/* =========================
   CLEAR ERROR
========================= */

export function limpiarError() {

  const errorDiv =
    document.getElementById(
      "error"
    );

  errorDiv.textContent =
    "";

  errorDiv.classList.remove(
    "active"
  );
}

/* =========================
   DISABLE BUTTON
========================= */

export function bloquearBoton() {

  submitButton.disabled = true;

  submitButton.style.opacity =
    "0.6";

  submitButton.style.cursor =
    "not-allowed";
}

/* =========================
   ENABLE BUTTON
========================= */

export function desbloquearBoton() {

  submitButton.disabled = false;

  submitButton.style.opacity =
    "1";

  submitButton.style.cursor =
    "pointer";
}

export function showSessionExpiredMessage() {
alert("showSessionExpiredMessage llamada");
  const errorDiv = document.getElementById("error");

  if (!errorDiv) return;

  errorDiv.textContent = "⚠ Session expired.";
  errorDiv.classList.add("active");
}