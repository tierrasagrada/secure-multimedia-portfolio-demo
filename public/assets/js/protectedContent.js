import { apiFetch }
from "./api.js";

import {
  loadProtectedImages
}
from "./slider.js";

/* =========================
   RENDER PROTECTED CONTENT
========================= */

export async function
renderProtectedContent() {

  try {

    /* =========================
       GET CONTENT
    ========================= */

    const contentResponse =
      await apiFetch(

        "/api/contenido",

        {

          method: "GET",
        }
      );

    if (!contentResponse.ok) {

      return {
        ok: false,
        status: contentResponse.status
      };
    }

    const data =
      await contentResponse.json();

    /* =========================
       HIDE LOGIN UI
    ========================= */

    document.getElementById(
      "security-footer"
    ).style.display = "none";

    document.getElementById(
      "security-container"
    ).style.display = "none";

    /* =========================
       SANITIZE HTML
    ========================= */

    const cleanHTML =
      DOMPurify.sanitize(

        data.content,

        {

          ADD_TAGS: ["iframe"],

          ADD_ATTR: [

            "allow",

            "allowfullscreen",

            "frameborder",

            "src",

            "title",

            "referrerpolicy",
          ],

          FORBID_ATTR: [

            "onload",

            "onclick",
          ],

          FORBID_TAGS: [

            "script",
          ],
        }
      );

    const tempDiv =
      document.createElement(
        "div"
      );

    tempDiv.innerHTML = cleanHTML;

    /* =========================
       VALIDATE IFRAMES
    ========================= */

    const iframes = tempDiv.getElementsByTagName("iframe");

    const allowedHosts = [
      "www.youtube.com"
    ];      

    for (const iframe of iframes) {
      try {
        const url = new URL(iframe.src);
        if (!allowedHosts.includes(url.hostname)) {
            iframe.remove();
            continue;
        }
        if (!url.pathname.startsWith("/embed/")) {
          iframe.remove();
        }
      } catch {
        iframe.remove();
      }      
    }

 /* =========================
   RENDER HTML (SAFE RENDER)
========================= */

const protectedContent =
  document.getElementById(
    "protected-content"
  );

/* =========================
   SOLO INYECTAR HTML 1 VEZ
========================= */

if (!protectedContent.dataset.loaded) {

  protectedContent.innerHTML =
    tempDiv.innerHTML;

  protectedContent.dataset.loaded =
    "true";
}

/* =========================
   SIEMPRE ASEGURAR VISIBILIDAD
========================= */

protectedContent.style.display =
  "block";

/* =========================
   PREVENIR DUPLICACIÓN DE UI DINÁMICA
========================= */

/* CLAVE: limpiar antes de volver a inicializar efectos */

const wanderito =
  document.getElementById("wanderito");

const wanderito2 =
  document.getElementById("wanderito2");

if (wanderito) {
  wanderito.innerHTML = "";
}

if (wanderito2) {
  wanderito2.innerHTML = "";
}

/*
  IMPORTANTE:
  En Android + pageshow, el DOM puede quedar inconsistente.
  Por eso NO usamos cache estricto.
*/

const shouldReloadImages =
  !protectedContent.dataset.imagesLoaded ||
  document.visibilityState === "visible";

if (shouldReloadImages) {

  await loadProtectedImages();

  protectedContent.dataset.imagesLoaded = "true";
}
/* =========================
   RESULTADO
========================= */

return {
  ok: true
};

  } catch (error) {

    console.error(error);

    return {
      ok: false,
      status: "network_error"
    };
  }
}