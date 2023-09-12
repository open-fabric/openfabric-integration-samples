import express from "express";
import { qrphController } from "../../controllers/index.js";
const router = express.Router();
router.route("/transactions").post(qrphController.initiateQrphTxn);

export const QRPH = router;
