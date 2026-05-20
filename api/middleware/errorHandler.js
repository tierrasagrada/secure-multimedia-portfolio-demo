const errorHandler = (
  err,
  req,
  res,
  next
) => {

  /* =========================
     CSRF ERROR
  ========================= */

  if (
    err.code ===
    "EBADCSRFTOKEN"
  ) {

    return res.status(403).json({

      success: false,

      message:
        "Invalid request.",
    });
  }

  /* =========================
     RATE LIMIT
  ========================= */

  if (err.status === 429) {

    return res.status(429).json({

      success: false,

      message:
        "Too many requests.",
    });
  }

  /* =========================
     SERVER LOG
  ========================= */

  console.error(err);

  /* =========================
     GENERIC ERROR
  ========================= */

  return res.status(500).json({

    success: false,

    message:
      "Internal server error.",
  });
};

export default errorHandler;