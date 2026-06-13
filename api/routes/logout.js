import express from "express";

import auth from "../middleware/auth.js";

import { logout } from "../controllers/logoutController.js";

const router = express.Router();

/* =========================
   LOGOUT
========================= */

router.post(
  "/",
  auth,
  logout
);

export default router;