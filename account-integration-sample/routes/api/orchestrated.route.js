import express from "express";
import { orchestratedController } from "../../controllers";
const router = express.Router();
router.route("/transactions").post(orchestratedController.CreateTransaction);
router.route("/transactions").get(orchestratedController.getTransactionById);

router.route("/mobile/approve").post(orchestratedController.mobileApproveTransaction);
router.route("/mobile/cancel").post(orchestratedController.mobileCancelTransaction);

router.route("/approve").post(orchestratedController.ApproveTransaction);
router.route("/pre-auth").post(orchestratedController.PreAuthTransaction);
router.route("/cancel").post(orchestratedController.CancelTransaction);

export const Orchestrated = router;
