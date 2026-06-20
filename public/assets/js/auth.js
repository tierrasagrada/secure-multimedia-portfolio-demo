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

     export function imprimirError(mensaje) {
            const cajaError = document.getElementById('error-box');
            cajaError.textContent = "Error: " + mensaje;
            cajaError.style.display = 'block'; // Muestra el mensaje en la pantalla
        }