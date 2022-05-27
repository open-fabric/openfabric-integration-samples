import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
const db = new JsonDB(new Config("merchantsTransaction", true, true, '/'));

export const addNewTransaction  = (trans: any) => {
  db.push(`/transactions/${trans.merchant_reference_id}`,trans);
}

export const readTransaction = (merchant_reference_id: string) => {
  try {
    return db.getData(`/transactions/${merchant_reference_id}`)
  } catch(err) {
    console.log('====== ERR readTransaction ', err)
    return null
  }
  
}

export const updateTransaction = (trans: any) => {
  db.push(`/transactions/${trans.merchant_reference_id}`, trans);
};
export const clearTransactions = () => {
  db.delete('/transactions')
}