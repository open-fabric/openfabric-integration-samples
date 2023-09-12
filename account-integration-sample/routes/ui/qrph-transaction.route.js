import express from "express";
import { qrphController } from "../../controllers/index.js";
const router = express.Router();
router.route("/transaction-get").get(qrphController.GetTxnUI);
router.route("/transaction-init"),get(qrphController.InitializeTxnUI)
export const QrphTransaction = router
