import express from "express";

import {
  serveProtectedImage
} from "../controllers/imageAccessController.js";

const router = express.Router();

router.get(
  "/",
  serveProtectedImage
);

export default router;
