import express from "express";
import { embeddedController } from "../../controllers";
const router = express.Router();
router.route("/transactions").post(embeddedController.CreateTransaction);
router.route("/transactions").get(embeddedController.getTransaction);
router.route("/approve-checkout").post(embeddedController.ApproveAndSubmitToOF);
router.route("/transaction/card-auth").post(embeddedController.CardAccessTokenWithRefId);

export const Embedded = router;
