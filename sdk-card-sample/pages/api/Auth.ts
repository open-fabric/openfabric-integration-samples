import axios from "axios";
import qs from "qs";

export const Authentication = (id: string, secret: string) => async (scope?: string,) => {
  const basic = Buffer.from(
     `${id}:${secret}`
  ).toString("base64");
  const body = qs.stringify({
     grant_type: "client_credentials",
     scope: scope
  });
  const response = await axios.post(process.env.OF_AUTH_URL || "", body, {
     headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Basic ${basic}`,
     },
  })
  return response.data
}