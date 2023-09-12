import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js";
const db = new JsonDB(new Config("AccountTransaction", true, true, "/"));

export const addNewTransaction = (trans) => {
  db.push(`/transactions/${trans.account_reference_id}`, trans);
};

export const updateTransaction = (trans) => {
  db.push(`/transactions/${trans.account_reference_id}`, trans);
};

export const readTransaction = (account_reference_id) => {
  return db.getData(`/transactions/${account_reference_id}`);
};
export const readAllTransaction = () => {
return db.getData(`/transactions`);
};

export const clearTransactions = () => {
  db.delete('/transactions')
}
