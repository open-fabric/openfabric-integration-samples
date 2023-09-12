import express from "express";
import { webhookController } from "../../controllers/index.js";
const router = express.Router();
router.route("/").post(webhookController.WebhookCallBack);

export const WebhookCallback = router;
