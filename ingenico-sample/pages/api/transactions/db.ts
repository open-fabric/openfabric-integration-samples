import { JsonDB, Config } from 'node-json-db';

let db: JsonDB;
export function getDB() {
  if (db == undefined) {
    db = new JsonDB(new Config("ppaas-transactions", true, false, '/'));
  }
  return db;
}