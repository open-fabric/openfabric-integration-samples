import express from "express";
import { embeddedController } from "../../controllers";
const router = express.Router();
router.route("/checkout").get(embeddedController.CheckOutUI);
router.route("/order").get(embeddedController.OrderUI);
export const EmbeddedCheckout = router;
