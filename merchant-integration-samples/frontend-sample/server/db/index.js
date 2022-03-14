import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
const db = new JsonDB(new Config("merchantsTransaction", true, true, '/'));

export const addNewTransaction  = (trans) => {
  db.push(`/transactions/${trans.merchant_reference_id}`,trans);
}

export const readTransaction = (merchant_reference_id) => {
 return db.getData(`/transactions/${merchant_reference_id}`)
}

export const clearTransactions = () => {
  db.delete('/transactions')
}