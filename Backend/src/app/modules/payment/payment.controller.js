import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import httpStatus from "http-status";
import { paymentService } from "./payment.service.js";

// The URL of your React/Next.js frontend
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

/**
 * Step 1: Initiate Payment
 */
const initiatePayment = catchAsync(async (req, res) => {
  const result = await paymentService.initiatePaymentService(req.user.userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment initiated successfully",
    data: { paymentUrl: result.gatewayUrl },
  });
});

/**
 * Step 2: Payment Success Callback
 */
const paymentSuccess = catchAsync(async (req, res) => {
  // gateway sends data in req.body
  await paymentService.validateAndUpdatePaymentService(req.body);
  
  // Redirect user to the frontend success page
  res.redirect(`${FRONTEND_URL}/payment/success?tranId=${req.body.tran_id}`);
});

/**
 * Step 3: Payment Fail Callback
 */
const paymentFail = catchAsync(async (req, res) => {
  const { tran_id } = req.body;
  await paymentService.updatePaymentStatusService(tran_id, "FAILED");
  
  res.redirect(`${FRONTEND_URL}/payment/fail?tranId=${tran_id}`);
});

/**
 * Step 4: Payment Cancel Callback
 */
const paymentCancel = catchAsync(async (req, res) => {
  const { tran_id } = req.body;
  await paymentService.updatePaymentStatusService(tran_id, "CANCELLED");
  
  res.redirect(`${FRONTEND_URL}/payment/cancel?tranId=${tran_id}`);
});

/**
 * Step 5: IPN (Instant Payment Notification) Webhook
 * Hits in the background securely. Doesn't redirect, just replies to gateway.
 */
const paymentIpn = catchAsync(async (req, res) => {
  // Only process if it's a valid status
  if (req.body.status === "VALID" || req.body.status === "VALIDATED") {
    try {
      await paymentService.validateAndUpdatePaymentService(req.body);
    } catch (error) {
      console.error("IPN Processing Error:", error);
      // Even if our DB logic fails, return 400 so the gateway knows it wasn't processed correctly
      return res.status(400).send("IPN Verification Failed"); 
    }
  }
  
  // Always return 200 OK to the gateway so it stops sending the IPN
  res.status(200).send("IPN Received Successfully");
});

export const paymentControllers = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIpn,
};