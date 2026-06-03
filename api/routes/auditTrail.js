import express from "express";
import auth from "../middleware/auth.js";

import {
  getAuditEvents
} from "../utils/auditTrail.js";

const router = express.Router();

router.get(
  "/",
  auth,
  (req, res) => {

    return res.status(200).json(
      getAuditEvents()
    );
  }
);

export default router;