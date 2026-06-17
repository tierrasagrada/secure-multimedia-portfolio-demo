/* =========================
   VALIDATE ANSWER
========================= */

export function validateAnswer(
  req,
  res,
  next
) {

  const { respuesta } = req.body;

  /* =========================
     BODY EXISTS
  ========================= */

  if (
    !req.body ||
    typeof req.body !== "object"
  ) {

    return res.status(400).json({

      success: false,

      message:
        "Invalid request.",
    });
  }

  /* =========================
     TYPE VALIDATION
  ========================= */

  if (
    typeof respuesta !== "string"
  ) {

    return res.status(400).json({

      success: false,

      message:
        "Invalid input.",
    });
  }

  /* =========================
     EMPTY VALIDATION
  ========================= */

  if (
    !respuesta.trim()
  ) {

    return res.status(400).json({

      success: false,

      message:
        "Empty input.",
    });
  }

  /* =========================
     LENGTH VALIDATION
  ========================= */

  if (
    respuesta.length > 30
  ) {

    return res.status(400).json({

      success: false,

      message:
        "Input too long.",
    });
  }

  next();
}