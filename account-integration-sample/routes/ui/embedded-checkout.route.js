import express from "express";
import { embeddedController } from "../../controllers";
const router = express.Router();
router.route("/checkout").get(embeddedController.CheckOutUI);
export const EmbeddedCheckout = router;
