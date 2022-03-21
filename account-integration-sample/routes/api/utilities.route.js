import express from "express";
import { dbController } from "../../controllers";
const router = express.Router();
router.route("/db-clear").post(dbController.clearDb);
export const DbController = router;
