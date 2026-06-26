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

export async function destroySession(reload = false) {

  stopSessionWatcher();

  clearTimeout(sessionTimeout);

  clearTimeout(warningTimeout);

  clearInterval(countdownInterval);

  try {

    const csrfToken = await getCSRFToken();

    await apiFetch(
      "/api/logout",
      {
        method: "POST",
        headers: {
          "X-CSRF-Token": csrfToken
        }
      }
    );

  } catch (error) {

    console.error("Logout failed", error);

  }

  /* =========================
     RELOAD CLEAN PAGE
  ========================= */

  if (reload) {

    window.location.replace(
      window.location.pathname
    );

    return;
  }

  const modal =
    document.getElementById(
      "session-modal"
    );

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

  const protectedContent =
    document.getElementById(
      "protected-content"
    );

  if (protectedContent) {

    protectedContent.style.display =
      "none";

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
   REDIRECT TO LOGIN
========================= */

function redirectToLogin() {

  stopSessionWatcher();

  clearTimeout(sessionTimeout);

  clearTimeout(warningTimeout);

  clearInterval(countdownInterval);

  localStorage.removeItem(
    "hadValidSession"
  );

  sessionClosing = true;

  window.location.replace("/");
}    

    /* =========================
       RESET SLIDER
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
      document.getElementById(
        "wanderito"
      );

    if (wanderito) {
      wanderito.innerHTML = "";
    }

    const wanderito2 =
      document.getElementById(
        "wanderito2"
      );

    if (wanderito2) {
      wanderito2.innerHTML = "";
    }
  }

  /* =========================
     SHOW LOGIN
  ========================= */

  const securityContainer =
    document.getElementById(
      "security-container"
    );

  if (securityContainer) {
    securityContainer.style.display =
      "block";
  }

  const securityFooter =
    document.getElementById(
      "security-footer"
    );

  if (securityFooter) {
    securityFooter.style.display =
      "block";
  }

  /* =========================
     CLEAR INPUT
  ========================= */

  const answerElement =
    document.getElementById(
      "answer"
    );

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

    return {
      ok: false
    };
  }

  restoreInProgress = true;

  try {

    const result =
      await renderProtectedContent();

    /* =========================
       SESSION OK
    ========================= */

    if (result.ok) {

      if (sessionWatcherActive) {

        resetSessionTimer();

      } else {

        startSessionWatcher();
      }

      return {
        ok: true
      };
    }

    /* =========================
       SESSION EXPIRED
    ========================= */

    if (result.status === 401) {

      return {
        ok: false,
        status: 401
      };
    }

    /* =========================
       NETWORK ERROR
    ========================= */

    if (result.status === "network_error") {

      return {
        ok: false,
        status: "network_error"
      };
    }

    return {
      ok: false
    };

  } catch (error) {

    console.error(error);

    return {
      ok: false,
      status: "exception"
    };

  } finally {

    restoreInProgress = false;

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

document.addEventListener(
  "visibilitychange",
  async () => {

    if (
      document.visibilityState !==
      "visible"
    ) {
      return;
    }

    const result =
      await restoreProtectedSession();

    if (
      result?.status === 401
    ) {

      redirectToLogin();
    }
  }
);

/* =========================
   PAGE RESTORE CHECK
========================= */

window.addEventListener(
  "pageshow",
  async (event) => {

    if (
      !event.persisted
    ) {
      return;
    }

    const result =
      await restoreProtectedSession();

    if (
      result?.status === 401
    ) {

      redirectToLogin();
    }
  }
);