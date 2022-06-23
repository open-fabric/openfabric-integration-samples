import express from "express";
import { authController } from "../../controllers";
const router = express.Router();
router.route("/open-fabric").post(authController.OpenFabricAuthentication);
export const OFAuth = router;
