import express from "express";

const router = express.Router();

/* =========================
   LOGOUT
========================= */

router.post("/", (req, res) => {

  res.clearCookie(
    "access_token",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "strict"
    }
  );

  return res.status(200).json({

    success: true,

    message:
      "Session closed."
  });
});

export default router;