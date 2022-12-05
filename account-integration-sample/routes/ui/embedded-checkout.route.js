import express from "express";
import { embeddedController } from "../../controllers";
const router = express.Router();
router.route("/checkout").get(embeddedController.CheckOutUI);
router.route("/order").get(embeddedController.OrderUI);
router.route("/checkout-success").get(embeddedController.checkoutSuccessUI);
router.route("/checkout-failed").get(embeddedController.checkoutFailedUI);
export const EmbeddedCheckout = router;
