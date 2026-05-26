import {

  renderProtectedContent

} from "./protectedContent.js";


/* =========================
   SESSION TIMEOUT
========================= */

let sessionTimeout;

/* =========================
   SESSION DURATION
========================= */

const SESSION_LIMIT =
  1 * 60 * 1000;

/* =========================
   RESET SESSION TIMER
========================= */

export function resetSessionTimer() {

  clearTimeout(sessionTimeout);

  sessionTimeout =
    setTimeout(() => {

      destroySession();

    }, SESSION_LIMIT);
}

/* =========================
   START SESSION WATCHER
========================= */

export function startSessionWatcher() {

  const events = [

    "click",

    "mousemove",

    "keydown",

    "scroll",

    "touchstart",
  ];

  events.forEach((event) => {

    document.addEventListener(

      event,

      resetSessionTimer
    );
  });

  resetSessionTimer();
}

/* =========================
   DESTROY SESSION
========================= */

export function destroySession() {

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
  }

  /* =========================
     SHOW LOGIN
  ========================= */

  const securityContainer =
    document.getElementById(
      "security-container"
    );

  const securityFooter =
    document.getElementById(
      "security-footer"
    );

  if (securityContainer) {

    securityContainer.style.display =
      "block";
  }

  if (securityFooter) {

    securityFooter.style.display =
      "block";
  }

  /* =========================
     CLEAR INPUT
  ========================= */

  const answerInput =
    document.getElementById(
      "answer"
    );

  if (answerInput) {

    answerInput.value = "";
  }

  /* =========================
     USER MESSAGE
  ========================= */

  const errorDiv =
    document.getElementById(
      "error"
    );

  if (errorDiv) {

    errorDiv.textContent =
      "⚠ Session expired.";

    errorDiv.style.opacity = "1";
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
/*import {
  renderProtectedContent
}
from "./protectedContent.js";

/* =========================
   RESTORE SESSION
========================= */

/*export async function
restoreProtectedSession() {

  try {

    await renderProtectedContent();

  } catch (error) {

    console.error(error);

  } finally {

    /* =========================
       SHOW APPLICATION
    ========================= */

   /* document.body.classList.remove(
      "auth-loading"
    );
  }
}*/