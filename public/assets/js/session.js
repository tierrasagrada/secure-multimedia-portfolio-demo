import {
  renderProtectedContent
}
from "./protectedContent.js";

/* =========================
   RESTORE SESSION
========================= */

export async function
restoreProtectedSession() {

  try {

    await renderProtectedContent();

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