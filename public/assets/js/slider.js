import { apiFetch }
from "./api.js";

import { getCSRFToken }
from "./csrf.js";

/* =========================
   LOAD PROTECTED IMAGES
========================= */

export async function
loadProtectedImages() {

  const protectedContent2 =
    document.getElementById(
      "sliker"
    );

  const wanderitodiv =
    document.getElementById(
      "wanderito"
    );

  const wanderitodiv2 =
    document.getElementById(
      "wanderito2"
    );

  if (

    !protectedContent2 ||

    !wanderitodiv ||

    !wanderitodiv2
  ) {

    throw new Error(
      "Protected containers not found."
    );
  }

  protectedContent2.innerHTML = `

    <div id="ninja-slider">

      <div class="slider-inner">

        <ul id="unDiv"></ul>

        <div class="fs-icon"
          title="Expand/Close"></div>

      </div>

    </div>
  `;

  /* =========================
     GET CSRF TOKEN
  ========================= */

  const csrfToken =
    await getCSRFToken();

  /* =========================
     GET IMAGES
  ========================= */

  const response2 =
    await apiFetch(

      "/api/obtenerImagenes",

      {

        method: "POST",

        headers: {

          "X-CSRF-Token":
            csrfToken,
        },

        body: JSON.stringify({}),
      }
    );

  if (!response2.ok) {

    throw new Error(
      "Error loading images"
    );
  }

  const imagesarray =
    await response2.json();

  const sliderContainer =
    document.getElementById(
      "unDiv"
    );

  /* =========================
     RENDER IMAGES
  ========================= */

  for (const image of imagesarray) {

    if (!image.secureUrl)
      continue;

    if (
      image.filename ===
      "wanderers.png"
    ) {

      const imgsw =
        document.createElement(
          "img"
        );

      imgsw.src =
        image.secureUrl;

      imgsw.width = 250;

      imgsw.height = 200;

      imgsw.loading = "lazy";

      imgsw.decoding = "async";

      wanderitodiv.appendChild(
        imgsw
      );

      continue;
    }

    if (
      image.filename ===
      "img-01.jpg"
    ) {

      const imgsw2 =
        document.createElement(
          "img"
        );

      imgsw2.src =
        image.secureUrl;

      imgsw2.className =
        "img-responsive";

      imgsw2.loading =
        "lazy";

      imgsw2.decoding =
        "async";

      wanderitodiv2.appendChild(
        imgsw2
      );

      continue;
    }

    const li =
      document.createElement(
        "li"
      );

    const a =
      document.createElement(
        "a"
      );

    a.className = "ns-img";

    a.href =
      image.secureUrl;

    const div =
      document.createElement(
        "div"
      );

    div.className =
      "caption";

    div.textContent =
      "@colerise";

    li.appendChild(a);

    li.appendChild(div);

    sliderContainer.appendChild(li);
  }

  /* =========================
     INIT SLIDER
  ========================= */

  if (
    typeof nslider !==
    "undefined"
  ) {

    nslider.init();

    setTimeout(() => {

      triggerWanderitoFX();

    }, 50);
  }
}