import express from "express";
import { pbaController } from "../../controllers/index.js";
const router = express.Router();
router.route("/provision").post(pbaController.provisionAccountDevice);

export const PBA = router;
