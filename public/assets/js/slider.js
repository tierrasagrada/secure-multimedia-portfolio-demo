import { apiFetch } from "./api.js";

import { getCSRFToken } from "./csrf.js";

/* =========================
   LOAD NINJA SLIDER SCRIPT
========================= */

async function ensureNinjaSliderLoaded() {

  /* =========================
     REMOVE OLD SCRIPT
  ========================= */

  const oldScript = document.getElementById("ninja-slider-script");

  if (oldScript) {
    oldScript.remove();
  }

  /* =========================
     LOAD NEW SCRIPT
  ========================= */

  await new Promise((resolve, reject) => {
    const script = document.createElement("script");

    script.id = "ninja-slider-script";
    script.src = "/assets/js/ninja-slider.js";

    script.onload = resolve;
    script.onerror = reject;

    document.body.appendChild(script);
  });
}

/* =========================
   LOAD PROTECTED IMAGES
========================= */

export async function loadProtectedImages(){

  if(typeof destroyFireworks === "function"){
    destroyFireworks();
  }

  const sliker = document.getElementById("sliker");
  const wanderitodiv = document.getElementById("wanderito");
  const wanderitodiv2 = document.getElementById("wanderito2");

  if (!sliker || !wanderitodiv || !wanderitodiv2){
    throw new Error("Protected containers not found.");
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

  document.getElementById("ninja-slider-pager")?.remove();
  document.getElementById("ninja-slider-prev")?.remove();
  document.getElementById("ninja-slider-next")?.remove();
  document.getElementById("ninja-slider-pause-play")?.remove();

  /* =========================
     REBUILD SLIDER HTML
  ========================= */

  sliker.innerHTML = `
    <div id="ninja-slider">
      <div class="slider-inner">
        <ul id="unDiv"></ul>
        <div class="fs-icon"
          title="Expand/Close">
        </div>
      </div>
    </div>
  `;

  await new Promise(resolve => requestAnimationFrame(resolve));

  const sliderContainer = document.getElementById("unDiv");

  if (!sliderContainer) {
    throw new Error("Slider container not found.");
  }

  /* =========================
     RESET INLINE STYLES
  ========================= */

  sliderContainer.removeAttribute("style");

  /* =========================
     LOAD SCRIPT AGAIN
  ========================= */

  await ensureNinjaSliderLoaded();

  /* =========================
     GET CSRF TOKEN
  ========================= */

  const csrfToken = await getCSRFToken();

  /* =========================
     GET IMAGES
  ========================= */

  const response2 = await apiFetch("/api/obtenerImagenes",{
    method: "POST",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({}),
  });

  if (!response2.ok){
    throw new Error("Error loading images");
  }

  const imagesarray = await response2.json();
  
  imagesarray.sort((a, b) => {

    if (a.filename === "wanderers.png"){
      return -1;
    } 

    if (b.filename === "wanderers.png"){
       return 1;
    }

    return 0;
  });

  /* =========================
     RENDER IMAGES
  ========================= */

  for (const image of imagesarray) {

    if (!image.secureUrl){
      continue;
    }

    /* =========================
       FIREWORK IMAGE
    ========================= */

    if (image.filename === "wanderers.png") {

      const imgsw = document.createElement("img");

      imgsw.onload = () => {
        if (typeof triggerWanderitoFX !== "undefined") {
          triggerWanderitoFX();
        }
      };

      imgsw.src = image.secureUrl;
      imgsw.width = 250;
      imgsw.height = 200;
      imgsw.loading = "eager";
      imgsw.decoding = "sync";
      wanderitodiv.appendChild(imgsw);

      continue;
    }

    /* =========================
       STATIC IMAGE
    ========================= */

    if (image.filename === "img-01.png") {

      const preloadedImage = new Image();

      preloadedImage.onload = () => {

        preloadedImage.className = "img-responsive";
        preloadedImage.loading = "eager";
        preloadedImage.decoding = "sync";

        wanderitodiv2.appendChild(preloadedImage);
      };

      preloadedImage.src = image.secureUrl;

      continue;
    }

    /* =========================
       SLIDER IMAGE
    ========================= */

    // 1. Creation
    const li = document.createElement("li");
    const a = document.createElement("a");
    const div = document.createElement("div");

    // 2. Configuration
    a.className = "ns-img";
    a.href = image.secureUrl;
    
    div.className = "caption";
    div.textContent = "@colerise";

    // 3. Appending and Insertion
    li.appendChild(a);
    li.appendChild(div);
    sliderContainer.appendChild(li);
  }

  /* =========================
     INIT SLIDER
  ========================= */

  if (typeof nslider !== "undefined") {
    try {
      nslider.init();
    } catch (error) {
      showError("No fue posible cargar el contenido.");
    }
  }
}