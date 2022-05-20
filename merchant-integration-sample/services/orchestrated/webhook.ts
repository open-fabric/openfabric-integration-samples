import {
  addNewTransaction,
  readTransaction,
  updateTransaction,
} from "../../db";
export const WebhookProcess = async (webhook: any) => {
  const txn_ref_id = webhook && webhook.data && webhook.data.txn_ref_id;
  const txtByRefId = readTransaction(txn_ref_id);
  !txtByRefId &&
    addNewTransaction({
      webhook: webhook,
      merchant_reference_id: txn_ref_id,
    });

  txtByRefId &&
    updateTransaction({
      ...txtByRefId,
      webhook: webhook
    });
  return;
};
