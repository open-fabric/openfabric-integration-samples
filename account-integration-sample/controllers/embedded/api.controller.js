import { catchAsync } from "../../utils/catchAsync";
import * as dbService from "../../services/db";
import * as transactionService from "../../services/of-transactions";
import { account_server_url, of_issuer_url } from "../../lib/variables";
import { GetAccessToken } from "../../services/auth";
import axios from "axios";

export const CreateTransaction = catchAsync(async (req, res) => {
  const accountTransaction = {
    ...req.body,
    account_reference_id: `ACC-REF-${Date.now()}`,
  };
  dbService.addNewTransaction(accountTransaction);
  return res.status(200).send({
    ...accountTransaction,
    redirect_url: `${account_server_url}/embedded/checkout?account_reference_id=${accountTransaction.account_reference_id}`,
  });
});

export const getTransaction = catchAsync(async (req, res) => {
  const account_reference_id = req.query.account_reference_id;
  const transaction = !account_reference_id
    ? dbService.readAllTransaction()
    : dbService.readTransaction(account_reference_id);
  return res.status(200).send(transaction);
});

export const ApproveAndSubmitToOF = async (req, res) => {
  try {
    const account_reference_id = req.body.account_reference_id;
    const transInfo = dbService.readTransaction(account_reference_id);

    const response = await transactionService.createEmbeddedTransaction({
      transaction: transInfo,
    });

    const updatedTrans = {
      ...transInfo,
      status: response.status,
      ofTransaction: response,
    };
    dbService.updateTransaction(updatedTrans);

    let displayData = {}
    if (updatedTrans?.pg_provider_config?.name) {
      displayData = {
        pg_name: updatedTrans.pg_provider_config.name,
        pg_card_token: response.pg_card_token
      }
    } else {
      displayData = await BackEndFetchCard(response.card_fetch_token)
    }

    const displayStr = Object.keys(displayData).map(function (key) {
      return key + '=' + displayData[key];
    }).join('&');

    return res.status(200).send({
      redirect_url: `${account_server_url}/embedded/checkout-success?${displayStr}`,
    });
  } catch (err) {
    return res.status(200).send({
      redirect_url: `${account_server_url}/embedded/checkout-failed?message=${err.message}`,
    });
  }
};


const BackEndFetchCard = async (
  card_fetch_token
) => {
  const accessToken = await GetAccessToken("resources/cards.read");

  const response = await axios.post(
    `${of_issuer_url}/i/fetchCard`,
    {
      card_fetch_token,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken.access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
