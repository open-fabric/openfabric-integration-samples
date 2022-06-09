import { GetAccessToken } from "../../services/auth.js";
import * as dbService from "../../services/db/index.js";
import { catchAsync } from "../../utils/catchAsync";
import * as transactionService from "../../services/of-transactions";

export const CreateTransaction = catchAsync(async (req, res) => {
    const transaction = {
        ...req.body,
        account_reference_id: `ACC-REF-${Date.now()}`,
    };

    dbService.addNewTransaction(transaction);

    const response = await transactionService.createEmbeddedTransaction({
        transaction,
    });

    return res.status(200).json(response);
});

export const CardAccessTokenWithRefId = catchAsync(
    async (req, res) => {
        const account_reference_id = req.body.account_reference_id;
        const transInfo = dbService.readTransaction(account_reference_id);
        if (
            !transInfo ||
            transInfo.status !== "Approved"
        ) {
            return res.status(500).json({
                message: `There is not relevant info related to ${account_reference_id}`,
            });
        }
        if (
            transInfo &&
            transInfo.status === "Approved"
        ) {
            const accessToken = await GetAccessToken("resources/cards.read");
            return res.status(200).json(accessToken);
        }
    }
);
