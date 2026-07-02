import pino from "pino";

/* =========================
   LOGGER INSTANCE
========================= */

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  base: null,
});

/* =========================
   INFO
========================= */

function info(message, extra = {}) {
  logger.info(
    {
      event: "info",
      ...extra,
    },
    message,
  );
}

/* =========================
   WARNING
========================= */

function warn(message, extra = {}) {
  logger.warn(
    {
      event: "warning",
      ...extra,
    },
    message,
  );
}

/* =========================
   ERROR
========================= */

function error(message, err = null, extra = {}) {
  logger.error(
    {
      event: "error",
      error: err?.message,
      stack: err?.stack,
      ...extra,
    },
    message,
  );
}

/* =========================
   SECURITY
========================= */

function security(message, extra = {}) {
  logger.warn(
    {
      event: "security",
      ...extra,
    },
    message,
  );
}

/* =========================
   EXPORTS
========================= */

export default {
  info,
  warn,
  error,
  security,
};