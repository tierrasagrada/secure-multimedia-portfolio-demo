import { login, restoreSession } from "./auth.js"
import { renderProtectedContent } from "./protectedContent.js";

const submitButton = document.getElementById("submit");

let isSubmitting = false;

let delay = 1000;

/* =========================
   GET CSRF TOKEN
========================= */

/*async function obtenerCSRFToken() {

  try {

    const response = await fetch("/api/csrf-token", {
      method: "GET",

      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("CSRF request failed");
    }

    const data = await response.json();

    return data.csrfToken;

  } catch (error) {

    console.error("CSRF Error:", error);

    return null;
  }
}*/

/* =========================
   ERROR UI
========================= */

function mostrarError(message) {

  const errorDiv = document.getElementById("error");

  errorDiv.style.opacity = "1";

  errorDiv.textContent = message;
}

/* =========================
   CLEAR ERROR
========================= */

function limpiarError() {

  const errorDiv = document.getElementById("error");

  errorDiv.style.opacity = "0";

  errorDiv.textContent = "";
}

/* =========================
   DISABLE BUTTON
========================= */

function bloquearBoton() {

  submitButton.disabled = true;

  submitButton.style.opacity = "0.6";

  submitButton.style.cursor = "not-allowed";
}

/* =========================
   ENABLE BUTTON
========================= */

function desbloquearBoton() {

  submitButton.disabled = false;

  submitButton.style.opacity = "1";

  submitButton.style.cursor = "pointer";
}

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
       GET CSRF TOKEN
    ========================= */

    //const csrfToken = await getCSRFToken();

    /*if (!csrfToken) {

      mostrarError(
        "⚠ Authentication error. Reload the page."
      );

      return;
    }*/

    /* =========================
       VALIDATE ANSWER
    ========================= */
    const response1 = await login(userAnswer);
    /*const response1 = await apiFetch(
      "/api/validarRespuesta",
      {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",

          "X-CSRF-Token": csrfToken,
        },

        body: JSON.stringify({
          respuesta: userAnswer,
        }),
      }
    );*/

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

await renderProtectedContent();

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

/* =========================
   AUTO RESTORE SESSION
========================= */

document.addEventListener(

  "DOMContentLoaded",

  async () => {

    await renderProtectedContent();

    /* =========================
      SHOW APP
    ========================= */

    document.body.classList.remove(
      "auth-loading"
    );
  }
);