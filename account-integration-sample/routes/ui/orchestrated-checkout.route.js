import express from "express";
import { orchestratedController } from "../../controllers/index.js";
const router = express.Router();
router.route("/checkout").get(orchestratedController.CheckOutUI);
export const OrchestratedCheckout = router
