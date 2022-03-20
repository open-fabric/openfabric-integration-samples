import express from "express";
import { orchestratedController } from "../../controllers";
const router = express.Router();
router.route("/transactions").post(orchestratedController.CreateTransaction);
router.route("/approve").post(orchestratedController.ApproveTransaction);
router.route("/cancel").post(orchestratedController.CancelTransaction);

export const Orchestrated = router;
