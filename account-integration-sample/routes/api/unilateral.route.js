import express from "express";
import { unilateralController } from "../../controllers";
const router = express.Router();
router.route("/transactions").post(unilateralController.CreateTransaction);
export const Unilateral = router;
