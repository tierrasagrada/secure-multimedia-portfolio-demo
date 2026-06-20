import { apiFetch } from "./api.js";

import { renderProtectedContent } from "./protectedContent.js";

import { getCSRFToken } from "./csrf.js";

import { imprimirError } from "./funcionesfronted.js";


/* =========================
   SESSION TIMEOUT
========================= */

let sessionTimeout;

let warningTimeout;

let sessionWarningActive = false;

let countdownInterval;

let sessionWatcherActive = false;

let sessionEndsAt = 0;

/* =========================
   SESSION DURATION
========================= */

const SESSION_LIMIT = 5 * 60 * 1000;

/* ==========================================
   EVENTS TO RESET WATCHER SESSION INACTIVE
============================================ */

const SESSION_EVENTS = [
  "click",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart"
];

/* =========================
   RESET SESSION TIMER
========================= */
export function resetSessionTimer() {

  if (!sessionWatcherActive) {
    return;
  }

  if (sessionWarningActive) {
    return;
  }

  clearTimeout(sessionTimeout);

  clearTimeout(warningTimeout);

  sessionEndsAt = Date.now() + SESSION_LIMIT;

  warningTimeout =
    setTimeout(() => {

      showSessionWarning();

    }, SESSION_LIMIT - 60000);

  sessionTimeout =
    setTimeout(() => {

      destroySession();

    }, SESSION_LIMIT);
}

/* =========================
   START SESSION WATCHER
========================= */

export function startSessionWatcher() { 
  console.log("startSessionWatcher ejecutado");
  if (sessionWatcherActive) { 
    return;
  }

  sessionWatcherActive = true;

  SESSION_EVENTS.forEach((event) => {

    document.addEventListener( 
      event, 
      resetSessionTimer
    );
  });

  resetSessionTimer();
}

/* =========================
   Activar modal SessionWarning
========================= */

function showSessionWarning() {
console.log("showSessionWarning ejecutado");
  const modal = document.getElementById("session-modal");

  const countdown = document.getElementById("session-countdown");

  if (!modal || !countdown) {
    return;
  }

  sessionWarningActive = true;

  modal.classList.add("active");

  clearInterval(countdownInterval);

  countdown.textContent = "60";
  countdownInterval =
    setInterval(() => {

    const remainingSeconds =
      Math.max(
        0,
        Math.ceil(
          (
            sessionEndsAt -
            Date.now()
          ) / 1000
        )
      );      

      countdown.textContent = remainingSeconds;

      if (remainingSeconds <= 0){
        clearInterval(countdownInterval);
      }

    }, 1000);
}

/* =========================
   CLEAN LISTENERS
========================= */
function stopSessionWatcher() {

  SESSION_EVENTS.forEach(event => {

    document.removeEventListener(
      event,
      resetSessionTimer
    );
  });

  sessionWatcherActive = false;
}

/* =========================
   DESTROY SESSION
========================= */

export async function destroySession() {

stopSessionWatcher();

clearTimeout(sessionTimeout);

clearTimeout(warningTimeout);

clearInterval(countdownInterval);  //Limpia el contador cuando expira la sesión

  try {
    const csrfToken = await getCSRFToken();

    await apiFetch(
      "/api/logout",
      {
        method: "POST",
        headers: {
          "X-CSRF-Token":
            csrfToken
        }
      }
    );

  } catch (error) {
    console.error("Logout failed",error);
  }

  const modal = document.getElementById("session-modal");

  if (modal) {
    modal.classList.remove("active");
  }

  sessionWarningActive = false;  

  /* =========================
     HIDE PROTECTED CONTENT
  ========================= */

  const protectedContent = document.getElementById("protected-content");

  if (protectedContent) {
    protectedContent.style.display = "none";

  /* =========================
      RESET DATASET
    ========================= */

    delete protectedContent.dataset.loaded;

    /* =========================
      DESTROY IFRAMES
    ========================= */

    const iframes =
      protectedContent.querySelectorAll(
        "iframe"
      );

    iframes.forEach(iframe => {

      iframe.src = "";

      iframe.remove();
    });

    /* =========================
      RESET SLIDER CONTENT
    ========================= */

    const sliker =
      document.getElementById(
        "sliker"
      );

    if (sliker) {
      sliker.innerHTML = "";
    }

    /* =========================
      RESET FIREWORKS
    ========================= */

    const wanderito =
      document.getElementById("wanderito");

    if (wanderito) {
      wanderito.innerHTML = "";
    }

    const wanderito2 =
      document.getElementById("wanderito2");

    if (wanderito2) {
      wanderito2.innerHTML = "";
    }      
  }

  /* =========================
     SHOW LOGIN
  ========================= */

  const securityContainer = document.getElementById("security-container");

  const securityFooter = document.getElementById("security-footer");

  if (securityContainer) {
    securityContainer.style.display = "block";
  }

  if (securityFooter) {
    securityFooter.style.display = "block";
  }

  /* =========================
     CLEAR INPUT
  ========================= */

  const answerInput = document.getElementById("answer");

  if (answerInput) {
    answerInput.value = "";
  }

  /* =========================
     USER MESSAGE
  ========================= */

  const errorDiv = document.getElementById("error");

  if (errorDiv) {
    errorDiv.textContent = "⚠ Session expired.";
    errorDiv.classList.add("active");
  }
}

/* =========================
   RESTORE SESSION
========================= */

export async function
restoreProtectedSession() {

  try {

    const restored =
      await renderProtectedContent();

    if (restored) {

      startSessionWatcher();
    }

  } catch (error) {

    console.error(error);

  } finally {

    /* =========================
       SHOW APPLICATION
    ========================= */

    document.body.classList.remove(
      "auth-loading"
    );
  }
}

/* =========================
   CONTINUE SESSION
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const continueButton =
      document.getElementById(
        "continue-session"
      );

    if (!continueButton) return;

    continueButton.addEventListener(
      "click",
      () => {

        sessionWarningActive = false;

        clearInterval(
          countdownInterval
        );   

        const modal =
          document.getElementById(
            "session-modal"
          );

        if (modal) {

          modal.classList.remove(
            "active"
          );
        }

        resetSessionTimer();
      }
    );
  }
);


imprimirError("estoy en la funcion imprimirError 1");
document.addEventListener("visibilitychange", function() {
  imprimirError("estoy en la funcion visibilitychange 2");
  if (document.visibilityState === "visible") {
   imprimirError("¡El usuario ha vuelto a la pestaña!");
    // Aquí puedes ejecutar tus funciones: pausar/reanudar videos, actualizar datos, etc.
  } else {
    imprimirError("La pestaña ha pasado a segundo plano.");
  }
});