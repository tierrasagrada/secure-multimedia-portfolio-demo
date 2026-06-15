import { apiFetch }
from "./api.js";

import { getCSRFToken }
from "./csrf.js";

/* =========================
   LOAD NINJA SLIDER SCRIPT
========================= */

async function ensureNinjaSliderLoaded() {

  /* =========================
     REMOVE OLD SCRIPT
  ========================= */

  const oldScript =
    document.getElementById(
      "ninja-slider-script"
    );

  if (oldScript) {

    oldScript.remove();
  }

  /* =========================
     LOAD NEW SCRIPT
  ========================= */

  await new Promise((resolve, reject) => {

    const script =
      document.createElement(
        "script"
      );

    script.id =
      "ninja-slider-script";

    script.src =
      "/assets/js/ninja-slider.js";

    script.onload =
      resolve;

    script.onerror =
      reject;

    document.body.appendChild(
      script
    );
  });
}

/* =========================
   LOAD PROTECTED IMAGES
========================= */

export async function
loadProtectedImages() {
  console.time("loadProtectedImages");
if (

  typeof destroyFireworks ===
  "function"

) {

  destroyFireworks();
}
  const sliker =
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

    !sliker ||

    !wanderitodiv ||

    !wanderitodiv2
  ) {

    throw new Error(
      "Protected containers not found."
    );
  }

  /* =========================
     RESET VISUALS
  ========================= */

  wanderitodiv.innerHTML = "";

  wanderitodiv2.innerHTML = "";

  /* =========================
     FULL RESET SLIDER
  ========================= */

  sliker.innerHTML = "";

  /* =========================
     REMOVE OLD CONTROLS
  ========================= */

  document.getElementById(
    "ninja-slider-pager"
  )?.remove();

  document.getElementById(
    "ninja-slider-prev"
  )?.remove();

  document.getElementById(
    "ninja-slider-next"
  )?.remove();

  document.getElementById(
    "ninja-slider-pause-play"
  )?.remove();

  /* =========================
     REBUILD SLIDER HTML
  ========================= */

  sliker.innerHTML = `

    <div id="ninja-slider">

      <div class="slider-inner">

        <ul id="unDiv"></ul>

        <div class="fs-icon"
          title="Expand/Close"></div>

      </div>

    </div>
  `;

  await new Promise(resolve =>
    requestAnimationFrame(resolve)
  );

  const sliderContainer =
    document.getElementById(
      "unDiv"
    );

  if (!sliderContainer) {

    throw new Error(
      "Slider container not found."
    );
  }

  /* =========================
     RESET INLINE STYLES
  ========================= */

  sliderContainer.removeAttribute(
    "style"
  );

  /* =========================
     LOAD SCRIPT AGAIN
  ========================= */

  await ensureNinjaSliderLoaded();

  /* =========================
     GET CSRF TOKEN
  ========================= */

  const csrfToken =
    await getCSRFToken();

  /* =========================
     GET IMAGES
  ========================= */
console.time("fetchProtectedImages");

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

  const imagesarray = await response2.json();
console.timeEnd("fetchProtectedImages");
  /* =========================
     RENDER IMAGES
  ========================= */
console.time("generateSliderDOM");
  for (const image of imagesarray) {

    if (!image.secureUrl)
      continue;

    /* =========================
       FIREWORK IMAGE
    ========================= */

    if (image.filename === "wanderers.png") {

      const imgsw = document.createElement("img");

      imgsw.src = image.secureUrl;

      imgsw.width = 250;

      imgsw.height = 200;

      imgsw.loading = "lazy";

      imgsw.decoding = "async";

      wanderitodiv.appendChild(
        imgsw
      );

      continue;
    }

    /* =========================
       STATIC IMAGE
    ========================= */

    if (image.filename === "img-01.png") {
const preloadedImage =
  new Image();

await new Promise(resolve => {

  preloadedImage.onload =
    resolve;

  preloadedImage.onerror =
    resolve;

  preloadedImage.src =
    image.secureUrl;
});

preloadedImage.className =
  "img-responsive";

preloadedImage.loading =
  "eager";

preloadedImage.decoding =
  "sync";

wanderitodiv2.appendChild(
  preloadedImage
);

continue;
    }

    /* =========================
       SLIDER IMAGE
    ========================= */

    const li = document.createElement("li");

    const a = document.createElement("a");

    a.className = "ns-img";

    a.href = image.secureUrl;

    const div = document.createElement("div");

    div.className = "caption";

    div.textContent = "@colerise";

    li.appendChild(a);

    li.appendChild(div);

    sliderContainer.appendChild(li);
  }
console.timeEnd("generateSliderDOM");
  /* =========================
     PRELOAD SLIDER IMAGES
  ========================= */

   Promise.all(

    imagesarray
      .filter(image =>

        image.filename !== "wanderers.png" && image.filename !== "img-01.png"
      )
      .map(image => {

        return new Promise(resolve => {

          const img = new Image();

          img.onload = resolve;

          img.onerror = resolve;

          img.src = image.secureUrl;
        });
      })
  ).catch(error => {
  console.error("Image preload failed", error);
});

  /* =========================
     INIT SLIDER
  ========================= */

  if (typeof nslider !== "undefined") {
    try {
      console.time("nslider.init");
      nslider.init();
      console.timeEnd("nslider.init");
    } catch (error) {
      console.error(
        "Slider init error:",
        error
      );
    }
  }

  /* =========================
     REINIT FIREWORKS
  ========================= */

  if (typeof triggerWanderitoFX !== "undefined") {
    try {
      setTimeout(() => {
        triggerWanderitoFX();
      }, 100);
    } catch (error) {
      console.error(
        "Fireworks init error:",
        error
      );
    }
  }
  console.timeEnd(
    "loadProtectedImages"
  );
}