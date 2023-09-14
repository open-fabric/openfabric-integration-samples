import { catchAsync } from "../utils/catchAsync.js";
import { clearTransactions } from "../db/index.js";

export const clearDb = catchAsync(async (req, res) => {
  await clearTransactions();
  res.status(200);
});
