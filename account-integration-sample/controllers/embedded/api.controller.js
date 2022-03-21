import { catchAsync } from "../../utils/catchAsync";
import * as dbService from "../../services/db";
import * as transactionService from "../../services/of-transactions";
import { account_server_url } from "../../lib/variables";
export const CreateTransaction = catchAsync(async (req, res) => {
  const accountTransaction = {
    ...req.body,
    account_reference_id: `ACC-REF-${Date.now()}`,
  };
  dbService.addNewTransaction(accountTransaction);
  return res.status(200).send({
    ...accountTransaction,
    redirect_url: `${account_server_url}/embedded/checkout?account_reference_id=${accountTransaction.account_reference_id}`,
  });
});

export const getTransaction = catchAsync(async (req, res) => {
  const account_reference_id = req.query.account_reference_id;
  const transaction = !account_reference_id
    ? dbService.readAllTransaction()
    : dbService.readTransaction(account_reference_id);
  return res.status(200).send(transaction);
});

export const ApproveAndSubmitToOF = catchAsync(async (req, res) => {
  const account_reference_id = req.body.account_reference_id;
  const transInfo = dbService.readTransaction(account_reference_id);
  const response = await transactionService.createEmbeddedTransaction({
    transaction: transInfo,
  });
  const updatedTrans = {
    ...transInfo,
    status: response.status,
    ofTransaction: response,
  };
  dbService.updateTransaction(updatedTrans);
  return res.status(200).json(updatedTrans);
});

export const FetchCard = catchAsync(async (req, res) => {
  const account_reference_id = req.query.account_reference_id;
  if (!account_reference_id) {
    throw Error("Missing `account_reference_id` in query");
    return;
  }
  const transInfo = dbService.readTransaction(account_reference_id);
  if (!transInfo) {
    console.error("No transaction matching " + account_reference_id);
    return;
  }
  if (transInfo.ofTransaction && transInfo.ofTransaction.card_fetch_token) {
    const response = await transactionService.fetchCardInfo({
      card_fetch_token: transInfo.ofTransaction.card_fetch_token,
    });
    dbService.updateTransaction({ ...transInfo, cardInfo: response });
    return res.status(200).json(response);
  }
  throw new Error("There is no info related to OpenFabric card_fetch_token");
});
