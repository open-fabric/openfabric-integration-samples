import { catchAsync } from "../../utils/catchAsync";

export const CheckOutUI = catchAsync(async (req, res) => {
  const account_reference_id = req.query.account_reference_id;
  if (!account_reference_id) {
    console.error("Missing `account_reference_id` in query");
    return;
  }
  const transInfo = readTransaction(account_reference_id);
  if (!transInfo) {
    console.error("No transaction matching " + account_reference_id);
    return;
  }
  res.render("embedded/checkout", {
    ...transInfo,
  });
});
