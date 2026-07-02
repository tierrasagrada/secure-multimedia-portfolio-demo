import helmet from "helmet";

const securityHeaders = helmet({
  /* =========================
     DISABLE CSP
  ========================= */

  contentSecurityPolicy: false,

  /* =========================
     CROSS ORIGIN
  ========================= */

  crossOriginEmbedderPolicy: false,

  /* =========================
     HIDE TECHNOLOGY
  ========================= */

  hidePoweredBy: true,

  /* =========================
     MIME SNIFFING
  ========================= */

  noSniff: true,

  /* =========================
     CLICKJACKING
  ========================= */

  frameguard: {
    action: "deny",
  },

  /* =========================
     HTTPS ONLY
  ========================= */

  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },

  /* =========================
     REFERRER POLICY
  ========================= */

  referrerPolicy: {
    policy: "no-referrer",
  },
});

export default securityHeaders;