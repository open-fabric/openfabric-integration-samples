import { catchAsync } from "../../utils/catchAsync";
import * as db from '../../db'
export const CheckOutUI = catchAsync(async (req, res) => {
  const account_reference_id = req.query.account_reference_id;
  if (!account_reference_id) {
    console.error("Missing `account_reference_id` in query");
    return;
  }
  const transInfo = db.readTransaction(account_reference_id);
  if (!transInfo) {
    console.error("No transaction matching " + account_reference_id);
    return;
  }
  console.log('==== CheckOutUI', transInfo)
  console.log('==== time', Date.now())
  res.render("embedded/checkout", {
    ...transInfo,
  });
});
