import express from "express";

import auth from
"../middleware/auth.js";

import {
  getProtectedImages
}
from "../controllers/imageController.js";

const router = express.Router();

router.post("/", auth, getProtectedImages );

export default router;