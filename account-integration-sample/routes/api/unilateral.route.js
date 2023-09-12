import express from "express";
import { unilateralController } from "../../controllers/index.js";

const router = express.Router();

router.route("/transactions").post(unilateralController.CreateTransaction);
router.route("/partners").get(unilateralController.listPartners);

export const Unilateral = router;
