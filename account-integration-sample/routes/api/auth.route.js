import express from "express";
import { authController } from "../../controllers";
const router = express.Router();
router.route("/open-fabric").get(authController.OpenFabricAuthentication);
export const OFAuth = router;
