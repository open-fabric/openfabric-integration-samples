import { updateTransaction, readTransaction } from "../../db";

export const WebhookFromAccountServer = (transaction: any) => {
  if(!transaction.merchant_reference_id) {
    throw Error('Missing merchant_reference_id')
  }
  const transactionById = readTransaction(transaction.merchant_reference_id)
  if(!transactionById) {
    throw Error("there is no Transaction with merchant_reference_id ", transaction.merchant_reference_id)
  }
  updateTransaction(transaction)
};