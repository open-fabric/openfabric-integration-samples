import { catchAsync } from "../utils/catchAsync";
import { clearTransactions } from "../db";

export const clearDb = catchAsync(async (req, res) => {
  await clearTransactions();
  res.status(200);
});
