import { addNewTransaction } from "../../db";
export const Checkout = async (transaction: any) => {
  const merchantTrans = { ...transaction, status: "Created", type: 'orchestrated' };
  addNewTransaction(merchantTrans);
  return merchantTrans
};
