import express from "express";
import { qrphController } from "../../controllers/index.js";
const router = express.Router();
router.route("/init-transaction").post(qrphController.initiateQrphTxn);
router.route("/preview-transaction").post(qrphController.previewQrphTxn);
export const QRPH = router;
