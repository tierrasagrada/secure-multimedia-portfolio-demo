import express from "express";

import auth from "../middleware/auth.js";

import { getProtectedContent } from "../controllers/contentController.js";

const router = express.Router();

/* =========================
   PROTECTED CONTENT
========================= */

router.get("/",auth, (req, res, next) => {
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    });
    next();
  },getProtectedContent);

export default router;
