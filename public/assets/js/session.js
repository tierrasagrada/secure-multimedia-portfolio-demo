import { apiFetch } from "./api.js";

import { renderProtectedContent } from "./protectedContent.js";

import { getCSRFToken } from "./csrf.js";

import { mostrarError } from "./security-ui.js";

/* =========================
   SESSION TIMEOUT
========================= */

let sessionTimeout;

let warningTimeout;

let sessionWarningActive = false;

let countdownInterval;

let sessionWatcherActive = false;

let sessionEndsAt = 0;

let pageShowInitialized = false;

let sessionClosing = false;

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
  if (sessionWatcherActive) { 
    return;
  }

  sessionClosing = false;

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

  mostrarError(
    "⚠ Session expired."
  );
  
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

    delete protectedContent.dataset.imagesLoaded;
    
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

  document.getElementById('security-container') && (document.getElementById('security-container').style.display = 'block');

  document.getElementById('security-footer') && (document.getElementById('security-footer').style.display = 'block');

  /* =========================
     CLEAR INPUT
  ========================= */
  const answerElement = document.getElementById("answer");
  if (answerElement) {
      answerElement.value = "";
  }

}

/* =========================
   RESTORE SESSION
========================= */
let restoreInProgress = false;

export async function restoreProtectedSession() {

  if (restoreInProgress) {
    return;
  }

  restoreInProgress = true;

  try {

    const result = await renderProtectedContent();

    /* =========================
       OK → sesión válida
    ========================= */

    if (result.ok) {
      startSessionWatcher();
      return;
    }

    /* =========================
       SESSION EXPIRED REAL
    ========================= */

    if (result.status === 401) {

      localStorage.removeItem(
        "hadValidSession"
      );      

      await destroySession();
      return;
    }

    /* =========================
       NETWORK / UNKNOWN ERROR
       → RETRY CONTROLADO
    ========================= */

    if (result.status === "network_error") {

      if (localStorage.getItem("hadValidSession") === "true") {
            localStorage.removeItem(
              "hadValidSession"
            );

          await destroySession();

          return;
      }

      mostrarError(
        "⚠ Connection error"
      );

      return;
    }

  } catch (error) {

    console.error(error);


  } finally {
    restoreInProgress = false;
    document.body.classList.remove("auth-loading");
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

/*function imprimirError(mensaje) {

  const cajaError =
    document.getElementById(
      "error-box"
    );

  if (!cajaError) {
    return;
  }

  cajaError.textContent =
    mensaje;

  cajaError.style.display =
    "block";
}*/

window.addEventListener(
  "pageshow",
  async () => {

    if (!pageShowInitialized) {

      pageShowInitialized = true;

      return;
    }

    await restoreProtectedSession();
  }
);

document.addEventListener(
  "visibilitychange",
  async () => {

    if (
      document.visibilityState ===
      "visible"
    ) {

      await restoreProtectedSession();
    }
  }
);