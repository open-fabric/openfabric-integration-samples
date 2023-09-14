import express from "express";
import { embeddedController } from "../../controllers/index.js";
const router = express.Router();
router.route("/transactions").post(embeddedController.CreateTransaction);
router.route("/transactions").get(embeddedController.getTransaction);
router.route("/approve-checkout").post(embeddedController.ApproveAndSubmitToOF);

export const Embedded = router;
