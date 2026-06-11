import express from "express";

import auth from
"../middleware/auth.js";

import {
  getProtectedContent
}
from "../controllers/contentController.js";

const router = express.Router();

/* =========================
   PROTECTED CONTENT
========================= */

router.get(
  "/",
  auth,
  getProtectedContent
  //async (req, res) => {

    //try {

      /* =========================
         SECURE HTML
      ========================= */

      // PROTECTED CONTENT
      /*const protectedContent = ``;

      return res.status(200).json({

        success: true,

        content:
          protectedContent,
      });*/

    /*} catch (error) {

      return res.status(500).json({

        success: false,

        message:
          "Internal server error.",
      });
    }*/
  //}
);

export default router;