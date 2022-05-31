import { catchAsync } from "../../utils/catchAsync";
import * as transactionService from "../../services/of-transactions";

export const CreateTransaction = catchAsync(async (req, res) => {
  const response = await transactionService.CreateTransaction({ of_transaction: req.body });
  return res.status(200).send(response);
});

export const ApproveTransaction = catchAsync(async (req, res) => {
  const id = req.body?.id;
  const approved_amount = req.body?.approved_amount
  const approved_currency = req.body?.approved_currency
  if (!id) {
    throw Error("Missing of id in request");
  }
  await transactionService.ApproveTransaction({
    account_reference_id: req.body.account_reference_id,
    approved_amount: approved_amount,
    approved_currency: approved_currency
  });
  const transInfo = await transactionService.GetTransactionById({
    transaction_id: id,
  });
  return res.status(200).send(transInfo)
});

export const mobileApproveTransaction = catchAsync(async (req, res) => {
  const id = req.body.id;
  if (!id) {
    throw Error("Missing of id in request");
  }
  await transactionService.ApproveTransaction({
    account_reference_id: req.body.account_reference_id,
  });
  const transInfo = await transactionService.GetTransactionById({
    transaction_id: id,
  });
  return res.status(200).send(transInfo);
});

export const mobileCancelTransaction = catchAsync(async (req, res) => {
  const id = req.body.id;
  if (!id) {
    throw Error("Missing of id in request");
  }
  await transactionService.CancelTransaction({
    account_reference_id: req.body.account_reference_id,
    reason: req.body.reason,
  });
  const transInfo = await transactionService.GetTransactionById({
    transaction_id: id,
  });
  return res.status(200).send(transInfo);
});

export const CancelTransaction = catchAsync(async (req, res) => {
  const id = req.body.id;
  if (!id) {
    throw Error("Missing of id in request");
  }
  await transactionService.CancelTransaction({
    account_reference_id: req.body.account_reference_id,
    reason: req.body.reason,
  });
  const transInfo = await transactionService.GetTransactionById({
    transaction_id: id,
  });
  return res.status(200).send(transInfo);
});

export const getTransactionById = catchAsync(async (req, res) => {
  const id = req.query.id;
  if (!id) {
    throw Error("Missing of id in request");
  }
  const transInfo = await transactionService.GetTransactionById({
    transaction_id: id,
  });
  return res.status(200).send(transInfo);
});
