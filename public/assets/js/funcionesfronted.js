const submitButton = document.getElementById("submit");

let isSubmitting = false;

let delay = 1000;

/* =========================
   GET CSRF TOKEN
========================= */

async function obtenerCSRFToken() {

  try {

    const response = await fetch("/api/csrf-token", {
      method: "GET",

      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("CSRF request failed");
    }

    const data = await response.json();

    return data.csrfToken;

  } catch (error) {

    console.error("CSRF Error:", error);

    return null;
  }
}

/* =========================
   ERROR UI
========================= */

function mostrarError(message) {

  const errorDiv = document.getElementById("error");

  errorDiv.style.opacity = "1";

  errorDiv.textContent = message;
}

/* =========================
   CLEAR ERROR
========================= */

function limpiarError() {

  const errorDiv = document.getElementById("error");

  errorDiv.style.opacity = "0";

  errorDiv.textContent = "";
}

/* =========================
   DISABLE BUTTON
========================= */

function bloquearBoton() {

  submitButton.disabled = true;

  submitButton.style.opacity = "0.6";

  submitButton.style.cursor = "not-allowed";
}

/* =========================
   ENABLE BUTTON
========================= */

function desbloquearBoton() {

  submitButton.disabled = false;

  submitButton.style.opacity = "1";

  submitButton.style.cursor = "pointer";
}

/* =========================
   RENDER PROTECTED CONTENT
========================= */

async function renderProtectedContent() {

  try {

    /* =========================
       GET PROTECTED CONTENT
    ========================= */

    const contentResponse =
      await fetch(

        "/api/contenido",

        {

          method: "GET",

          credentials:
            "include",
        }
      );

    /* =========================
       SESSION INVALID
    ========================= */

    if (!contentResponse.ok) {

      return false;
    }

    const data =
      await contentResponse.json();

    /* =========================
       HIDE SECURITY UI
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
       SLIDER CONTAINER
    ========================= */

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
      await obtenerCSRFToken();

    /* =========================
       GET IMAGES
    ========================= */

    const response2 =
      await fetch(

        "/api/obtenerImagenes",

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

      a.alt =
        image.filename ||
        "Protected image";

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

    return true;

  } catch (error) {

    console.error(error);

    return false;
  }
}

/* =========================
   MAIN EVENT
========================= */

submitButton.addEventListener("click", async () => {

  /* =========================
     PREVENT MULTIPLE REQUESTS
  ========================= */

  if (isSubmitting) return;

  isSubmitting = true;

  bloquearBoton();

  try {

    const userAnswer =
      document.getElementById("answer")
      .value
      .trim();

    /* =========================
       VALIDATION
    ========================= */

    if (!userAnswer) {

      mostrarError("⚠ The answer cannot be empty.");

      return;
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(userAnswer)) {

      mostrarError(
        "⚠ Invalid input. Use only letters and numbers."
      );

      return;
    }

    limpiarError();

    /* =========================
       GET CSRF TOKEN
    ========================= */

    const csrfToken = await obtenerCSRFToken();

    if (!csrfToken) {

      mostrarError(
        "⚠ Authentication error. Reload the page."
      );

      return;
    }

    /* =========================
       VALIDATE ANSWER
    ========================= */

    const response1 = await fetch(
      "/api/validarRespuesta",
      {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",

          "X-CSRF-Token": csrfToken,
        },

        body: JSON.stringify({
          respuesta: userAnswer,
        }),
      }
    );

    /* =========================
       RATE LIMIT
    ========================= */

    if (response1.status === 429) {

      mostrarError(
        "⚠ Too many attempts. Please try again later."
      );

      return;
    }

    /* =========================
       WRONG ANSWER
    ========================= */

    if (response1.status === 401) {

      mostrarError(
        "⚠ Incorrect answer. Try again."
      );

      delay = Math.min(delay * 2, 30000);

      await new Promise(resolve =>
        setTimeout(resolve, delay)
      );

      return;
    }

    /* =========================
       SERVER ERROR
    ========================= */

    if (!response1.ok) {

      throw new Error("Server error");
    }

const data =
  await response1.json();

/* =========================
   SUCCESS
========================= */

if (!data.success) {

  mostrarError(

    "⚠ Invalid server response."
  );

  return;
}

/* =========================
   LOAD PROTECTED SESSION
========================= */

await renderProtectedContent();

  } catch (error) {

    console.error(error);

    mostrarError(
      "⚠ An error occurred. Please try again later."
    );

  } finally {

    isSubmitting = false;

    desbloquearBoton();
  }
});

/* =========================
   IMAGE LOAD EFFECT
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const images =
      document.querySelectorAll("img");

    images.forEach((img) => {

      img.onload = () => {
        img.style.opacity = "1";
      };
    });
  }
);

/* =========================
   AUTO RESTORE SESSION
========================= */

document.addEventListener(

  "DOMContentLoaded",

  async () => {

    await renderProtectedContent();

    /* =========================
      SHOW APP
    ========================= */

    document.body.classList.remove(
      "auth-loading"
    );
  }
);