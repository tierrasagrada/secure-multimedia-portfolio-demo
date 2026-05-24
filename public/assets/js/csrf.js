import { apiFetch }
from "./api.js";

/* =========================
   CSRF CACHE
========================= */

let csrfToken = null;

/* =========================
   GET CSRF TOKEN
========================= */

export async function getCSRFToken() {

  /* =========================
     CACHE TOKEN
  ========================= */

  if (csrfToken) {

    return csrfToken;
  }

  const response =
    await apiFetch(

      "/api/csrf-token",

      {

        method: "GET",
      }
    );

  if (!response.ok) {

    throw new Error(
      "Failed CSRF token."
    );
  }

  const data =
    await response.json();

  csrfToken =
    data.csrfToken;

  return csrfToken;
}