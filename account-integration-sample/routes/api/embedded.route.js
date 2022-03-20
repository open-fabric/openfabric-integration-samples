import express from "express";
import { embeddedController } from "../../controllers";
const router = express.Router();
router.route("/transactions").post(embeddedController.CreateTransaction);
router.route("/approve-checkout").post(embeddedController.ApproveAndSubmitToOF);
router.route("/fetch-card").post(embeddedController.FetchCard);
export const Embedded = router;
