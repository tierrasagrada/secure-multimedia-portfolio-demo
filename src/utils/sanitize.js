import validator from "validator";
import xss from "xss";

/* =========================
   SANITIZE TEXT
========================= */

export function sanitizeText(input) {

  if (
    typeof input !== "string"
  ) {

    return "";
  }

  /* =========================
     TRIM
  ========================= */

  let clean =
    validator.trim(input);

  /* =========================
     REMOVE XSS
  ========================= */

  clean = xss(clean);

  /* =========================
     ESCAPE HTML
  ========================= */

  clean =
    validator.escape(clean);

  /* =========================
     NORMALIZE
  ========================= */

  clean =
    clean.toLowerCase();

  return clean;
}