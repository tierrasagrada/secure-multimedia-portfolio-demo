const submitButton =
  document.getElementById(
    "submit"
  );

/* =========================
   SHOW ERROR
========================= */

export function mostrarError(
  message
) {

  const errorDiv =
    document.getElementById(
      "error"
    );

  errorDiv.style.opacity = "1";

  errorDiv.textContent =
    message;
}

/* =========================
   CLEAR ERROR
========================= */

export function limpiarError() {

  const errorDiv =
    document.getElementById(
      "error"
    );

  errorDiv.style.opacity = "0";

  errorDiv.textContent = "";
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