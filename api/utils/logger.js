/* =========================
   TIMESTAMP
========================= */

function getTimestamp() {

  return new Date().toISOString();
}

/* =========================
   INFO
========================= */

function info(message) {

  console.log(

    `[INFO] [${getTimestamp()}] ${message}`
  );
}

/* =========================
   WARNING
========================= */

function warn(message) {

  console.warn(

    `[WARNING] [${getTimestamp()}] ${message}`
  );
}

/* =========================
   ERROR
========================= */

function error(message, err = null) {

  console.error(

    `[ERROR] [${getTimestamp()}] ${message}`
  );

  if (err) {

    console.error(err);
  }
}

/* =========================
   SECURITY
========================= */

function security(message) {

  console.warn(

    `[SECURITY] [${getTimestamp()}] ${message}`
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