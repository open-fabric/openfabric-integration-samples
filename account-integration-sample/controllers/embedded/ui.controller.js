import { catchAsync } from "../../utils/catchAsync.js";
import { merchant_redirect_url } from "../../lib/variables.js";
import * as db from "../../db/index.js";
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
  if (transInfo.status === "Approved") {
    res.redirect(
      `${merchant_redirect_url}/embedded/checkout-success?merchant_reference_id=${transInfo.merchant_reference_id}`
    );
    return;
  }
  res.render("embedded/checkout", {
    ...transInfo,
  });
  return;
});

export const OrderUI = catchAsync(async (req, res) => {
  res.render("embedded/order", {});
  return;
});

export const checkoutSuccessUI = catchAsync(async (req, res) => {
  res.render("embedded/checkout-success", {});
  return;
});

export const checkoutFailedUI = catchAsync(async (req, res) => {
  res.render("embedded/checkout-failed", {});
  return;
});
