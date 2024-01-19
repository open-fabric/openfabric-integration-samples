import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js";

export const db = new JsonDB(new Config("AccountTransaction", true, true, "/"));

export const addNewTransaction = (trans) => {
  db.push(`/transactions/${trans.account_reference_id}`, trans);
};

export const updateTransaction = (trans) => {
  db.push(`/transactions/${trans.account_reference_id}`, trans);
};

export const readTransaction = (account_reference_id) => {
  db.reload()
  return db.getData(`/transactions/${account_reference_id}`);
};

export const clearTransactions = () => {
  db.delete('/transactions')
}

export const addNewPbaTransactions = (transaction) => {
  db.push(`/pba/transactions/${transaction.network_transaction_ref}`, transaction);
}

export const addNewPbaNotification = (notification) => {
  const key =
    notification?.data?.network_transaction_ref || notification?.data?.network_file_id;

  if (key) {
    db.push(`/pba/notifications/${key}`, notification);
  }
};

export const getPbaNotification = (networkTxnRef) => {
  return db.getData(`/pba/notifications/${networkTxnRef}`)
}
