import express from "express";
import auth from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { paymentValidation } from "./payment.validation.js";
import { paymentControllers } from "./payment.controller.js";

const router = express.Router();

/**
 * POST /api/payment/initiate
 * Any logged-in user can initiate a payment.
 */
router.post(
  "/initiate",
  auth(
    "STUDENT",
    "PARENT",
    "TEACHER",
    "ACCOUNTANT" // Add whoever is allowed to pay
  ),
  validateRequest(paymentValidation.initiatePaymentValiadionSchema),
  paymentControllers.initiatePayment
);

/**
 * PUBLIC CALLBACK ROUTES
 * These are hit by the Payment Gateway, NOT directly by the user's frontend.
 * Do NOT put auth() middleware here.
 */
router.post("/success", paymentControllers.paymentSuccess);
router.post("/fail", paymentControllers.paymentFail);
router.post("/cancel", paymentControllers.paymentCancel);

/**
 * IPN WEBHOOK
 * SSLCommerz will POST to this URL in the background.
 */
router.post("/ipn", paymentControllers.paymentIpn);

export const paymentRoutes = router;