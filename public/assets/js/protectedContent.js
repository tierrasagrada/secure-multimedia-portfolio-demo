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

    if (
      contentResponse.status === 401 &&
      localStorage.getItem(
        "hadValidSession"
      ) === "true"
    ) {

      localStorage.removeItem(
        "hadValidSession"
      );

      localStorage.removeItem(
        "sessionExpired"
      );

      const errorDiv =
        document.getElementById(
          "error"
        );

      if (errorDiv) {

        errorDiv.textContent =
          "⚠ Session expired.";

        errorDiv.classList.add(
          "active"
        );
      }
    }

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
       RENDER HTML
    ========================= */

    const protectedContent =
      document.getElementById(
        "protected-content"
      );

if (!protectedContent.dataset.loaded) {

  protectedContent.innerHTML =
    tempDiv.innerHTML;

  protectedContent.dataset.loaded =
    "true";
}

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