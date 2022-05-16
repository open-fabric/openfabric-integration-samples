import { readTransaction } from "../../db";
export const getTransactionByRefId = (merchant_reference_id: string) => {
  const transaction = readTransaction(merchant_reference_id);
  return transaction;
};