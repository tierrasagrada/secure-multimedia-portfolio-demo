import { login, restoreSession } from "./auth.js"
import { renderProtectedContent } from "./protectedContent.js";
import { mostrarError, limpiarError, bloquearBoton, desbloquearBoton } from "./security-ui.js";
import { restoreProtectedSession, startSessionWatcher } from "./session.js";

const submitButton = document.getElementById("submit");

let isSubmitting = false;

let delay = 1000;

/* =========================
   MAIN EVENT
========================= */

submitButton.addEventListener("click", async () => {

  /* =========================
     PREVENT MULTIPLE REQUESTS
  ========================= */

  if (isSubmitting) return;

  isSubmitting = true;

  bloquearBoton();

  try {

    const userAnswer =
      document.getElementById("answer")
      .value
      .trim();

    /* =========================
       VALIDATION
    ========================= */

    if (!userAnswer) {

      mostrarError("⚠ The answer cannot be empty.");

      return;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(userAnswer)) {

      mostrarError(
        "⚠ Invalid input. Use only letters and numbers."
      );

      return;
    }

    limpiarError();

    /* =========================
       VALIDATE ANSWER
    ========================= */
    const response1 = await login(userAnswer);

    /* =========================
       RATE LIMIT
    ========================= */

    if (response1.status === 429) {

      mostrarError(
        "⚠ Too many attempts. Please try again later."
      );

      return;
    }

    /* =========================
       WRONG ANSWER
    ========================= */

    if (response1.status === 401) {

      mostrarError(
        "⚠ Incorrect answer. Try again."
      );

      delay = Math.min(delay * 2, 30000);

      await new Promise(resolve =>
        setTimeout(resolve, delay)
      );

      return;
    }

    /* =========================
       SERVER ERROR
    ========================= */

    if (!response1.ok) {

      throw new Error("Server error");
    }

const data =
  await response1.json();

/* =========================
   SUCCESS
========================= */

if (!data.success) {

  mostrarError(

    "⚠ Invalid server response."
  );

  return;
}

/* =========================
   LOAD PROTECTED SESSION
========================= */

  const restored =
    await renderProtectedContent();

  if (restored) {

    startSessionWatcher();
  }

  } catch (error) {

    console.error(error);

    mostrarError(
      "⚠ An error occurred. Please try again later."
    );

  } finally {

    isSubmitting = false;

    desbloquearBoton();
  }
});

/* =========================
   IMAGE LOAD EFFECT
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const images =
      document.querySelectorAll("img");

    images.forEach((img) => {

      img.onload = () => {
        img.style.opacity = "1";
      };
    });
  }
);

document.addEventListener(

  "DOMContentLoaded",

  async () => {

    await restoreProtectedSession();
  }
);

     export function imprimirError(mensaje) {
            const cajaError = document.getElementById('error-box');
            cajaError.textContent = "Error: " + mensaje;
            cajaError.style.display = 'block'; // Muestra el mensaje en la pantalla
        }