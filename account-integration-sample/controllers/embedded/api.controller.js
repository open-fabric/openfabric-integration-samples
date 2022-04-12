import { catchAsync } from "../../utils/catchAsync";
import * as dbService from "../../services/db";
import * as transactionService from "../../services/of-transactions";
import * as merchantService from "../../services/merchant-embedded";
import { account_server_url } from "../../lib/variables";
import { GetAccessToken } from "../../services/auth";

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
  // update merchant webhook
  await merchantService.UpdateMerchantWebhook(updatedTrans);
  return res.status(200).json(updatedTrans);
});

export const CardAccessTokenWithRefId = catchAsync(
  async (req, res) => {
    const account_reference_id = req.body.account_reference_id;
    const transInfo = dbService.readTransaction(account_reference_id);
    if (
      !transInfo ||
      transInfo.status !== "Approved" ||
      !transInfo.ofTransaction
    ) {
      return res.status(500).json({
        message: `There is not relevant info related to ${account_reference_id}`,
      });
    }
    if (
      transInfo &&
      transInfo.status === "Approved" &&
      transInfo.ofTransaction
    ) {
      const accessToken = await GetAccessToken("resources/cards.read");
      return res.status(200).json(accessToken);
    }
  }
);
