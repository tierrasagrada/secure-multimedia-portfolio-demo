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

      return false;
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

    tempDiv.innerHTML =
      cleanHTML;

    /* =========================
       VALIDATE IFRAMES
    ========================= */

    const iframes =
      tempDiv.getElementsByTagName(
        "iframe"
      );

    for (const iframe of iframes) {

      if (

        !iframe.src.startsWith(

          "https://www.youtube.com/embed/"
        )
      ) {

        iframe.remove();
      }
    }

    /* =========================
       RENDER HTML
    ========================= */

    const protectedContent =
      document.getElementById(
        "protected-content"
      );

    protectedContent.innerHTML =
      tempDiv.innerHTML;

    protectedContent.style.display =
      "block";

    /* =========================
       LOAD IMAGES
    ========================= */

    await loadProtectedImages();

    return true;

  } catch (error) {

    console.error(error);

    return false;
  }
}