import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig.js";
import { PatLink } from "./core";

export const db = new JsonDB(new Config("PatLink", true, true, "/"));

export const addPatLink = async (patLink:PatLink) => {
  await db.push(`/pat_link/${patLink.partner_link_ref}`, patLink);
};

export const readPatLink = async (partnerLinkRef:string): Promise<PatLink> => {
  db.reload()
  return await db.getData(`/pat_link/${partnerLinkRef}`);
};

export const cleatPatLinks = async () => {
  await db.delete('/pat_link')
}
