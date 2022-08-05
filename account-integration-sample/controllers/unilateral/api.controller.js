import axios from "axios";
import { of_issuer_url } from "../../lib/variables.js";
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
