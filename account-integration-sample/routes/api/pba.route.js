import express from "express";
import { pbaController } from "../../controllers/index.js";
const router = express.Router();
router.route("/provision").post(pbaController.provisionAccountDevice);
router.route("/transactions/final-auth/approval").post(pbaController.approveFinalAuthTransaction);
router.route("/callback").post(pbaController.WebhookCallBack);
export const PBA = router;
