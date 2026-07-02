import { generateAccessToken } from "../services/tokenService.js";
import logger from "../utils/logger.js";
import { validateAnswer } from "../middleware/validateInput.js";
import { sanitizeText } from "../utils/sanitize.js";
import { increment } from "../utils/securityMetrics.js";
import { addAuditEvent } from "../utils/auditTrail.js";

export async function validateSecurityAnswer(req, res) {

    try {
            
      const ANSWER = process.env.SECURITY_ANSWER;

      const cleanUserAnswer = sanitizeText(req.body.respuesta);

      // CORRECT ANSWER
      const cleanServerAnswer = sanitizeText(ANSWER);
      
      if (cleanUserAnswer === cleanServerAnswer) {
        
        /* =========================
          GENERATE ACCESS TOKEN
        ========================= */

        const accessToken = generateAccessToken({
            access: true,
        });

        /* =========================
          SECURE COOKIE
        ========================= */

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 5 * 60 * 1000,
        });
        
        /* =========================
          SUCCESS RESPONSE
        ========================= */
        increment("authSuccess");

        logger.info("Successful authentication",{
            requestId: req.requestId
        });

        addAuditEvent("AUTH_SUCCESS", {
            requestId: req.requestId
        });                
        
        return res.status(200).json({
          success: true,
          message: "Access granted.",
        });

      }

      increment("authFailure");

      logger.warn("Failed authentication attempt", {
          ip: req.ip,
          requestId: req.requestId,
          path: req.originalUrl
      });

      addAuditEvent("AUTH_FAILURE", {
          ip: req.ip,
          requestId: req.requestId
      });      
        // WRONG ANSWER
      return res.status(401).json({
        success: false,
        message: "Incorrect answer.",
      });
      
    } catch (error) {
      logger.error("Validation route failed", error, {
          ip: req.ip,
          requestId: req.requestId,
          path: req.originalUrl
      });      

      return res.status(500).json({
          success: false,
          message: "Internal server error.",
      });
    }
  }
  