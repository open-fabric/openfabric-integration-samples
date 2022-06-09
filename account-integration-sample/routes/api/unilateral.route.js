import express from "express";
import { unilateralController } from "../../controllers";
const router = express.Router();
router.route("/transactions").post(unilateralController.CreateTransaction);
router.route("/transaction/card-auth").post(unilateralController.CardAccessTokenWithRefId);
export const Unilateral = router;
