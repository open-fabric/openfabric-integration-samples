import express from "express";
import { qrphController } from "../../controllers/index.js";
const router = express.Router();
router.route("/get-transaction").get(qrphController.GetTxnUI);
router.route("/init-transaction").get(qrphController.InitializeTxnUI)
export const QrphTransaction = router
