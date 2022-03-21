import express from "express";
import { webhookController } from "../../controllers";
const router = express.Router();
router.route("/").post(webhookController.WebhookCallBack);

export const WebhookCallback = router;
