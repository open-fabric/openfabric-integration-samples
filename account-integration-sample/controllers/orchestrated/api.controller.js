import { catchAsync } from "../../utils/catchAsync.js";
import * as transactionService from "../../services/of-transactions/index.js";

export const CreateTransaction = catchAsync(async (req, res) => {
  const preApprovedInfo = req.body.pat_link?.link_id || req.body.pat_link?.tenant_link_ref || req.body.pat_link?.partner_link_ref;
  const isDualAuth = req.body.network_transaction_ref

  if (isDualAuth) {
    const response = await transactionService.CreateDualAuthTransaction({ of_transaction: req.body });
    return res.status(200).send(response);
  }
  else if (preApprovedInfo !== undefined) {
    const response = await transactionService.CreatePreApprovedTransaction({ of_transaction: req.body });
    return res.status(200).send(response);
  }

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
