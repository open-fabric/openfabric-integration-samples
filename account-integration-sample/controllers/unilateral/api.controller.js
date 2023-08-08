import axios from "axios";
import { of_issuer_url, of_auth_url } from "../../lib/variables.js";
import { GetAccessToken } from "../../services/auth.js";
import { catchAsync } from "../../utils/catchAsync";
import * as transactionService from "../../services/of-transactions";

export const CreateTransaction = catchAsync(async (req, res) => {
    const transaction = {
        ...req.body,
        account_reference_id: `ACC-REF-${Date.now()}`,
    };

    const embeddedTransaction = await transactionService.createEmbeddedTransaction({
        transaction,
    });

    const accessToken = await GetAccessToken("resources/cards.read");
    const response = await FetchCard(embeddedTransaction.card_fetch_token, accessToken.access_token);

    return res.status(200).json(response);
});

export const FetchCard = async (card_fetch_token, access_token) => {
    const result = await axios.post(
        `${of_issuer_url}/i/fetchCard`,
        {
            card_fetch_token,
        },
        {
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
        }
    );
    return result.data;
};

export const MERCHANTS = [{
  name: 'Lazada',
  url: 'https://www.lazada.sg',
  clientId: '5gooe22dkk23f3nheika6p212',
  clientSecret: '1816cbmasgd86usjcsl4eu65lns8bd3ul1938bcg2nsdkj39ui5r'
}]

export const authorize = async (clientId, clientSecret, scope) => {
  const response = await fetch(
    of_auth_url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      })
    }
  )
  console.log(response.status)
  const data = await response.json()
  return data.access_token
}

export const listPartners = catchAsync(async (req, res) => {
  const data = await Promise.all(
    MERCHANTS.map(async ({ clientId, clientSecret, ...merchant }) => {
      const accessToken = await authorize(
        clientId, clientSecret,
        'resources/transactions.create'
      )
      return {
        ...merchant,
        accessToken,
      }
    })
  )
  res.json(data)
})
