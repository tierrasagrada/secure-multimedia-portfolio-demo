/* =========================
   LOGIN
========================= */
import {
  apiFetch
} from "./api.js";

import {
  getCSRFToken
} from "./csrf.js";

/* =========================
   LOGIN REQUEST
========================= */

export async function login(
  respuesta
) {

  const csrfToken =
    await getCSRFToken();

  return apiFetch(

    "/api/validarRespuesta",

    {

      method: "POST",

      credentials:
        "include",

      headers: {

        "Content-Type":
          "application/json",

        "X-CSRF-Token":
          csrfToken,
      },

      body: JSON.stringify({

        respuesta,
      }),
    }
  );
}
/*export async function login(
  respuesta
) {

  const csrfToken =
    await getCSRFToken();

  const response =
    await apiFetch(

      "/api/validarRespuesta",

      {

        method: "POST",

        headers: {

          "X-CSRF-Token":
            csrfToken,
        },

        body: JSON.stringify({

          respuesta,
        }),
      }
    );

  return response;
}*/

/* =========================
   RESTORE SESSION
========================= */

export async function restoreSession() {

  const response =
    await apiFetch(

      "/api/contenido",

      {

        method: "GET",
      }
    );

  return response;
}