import axios from 'axios';
import qs from 'qs';
import {
    GetTransactionDetailsInternalRequest,
    TransactionsApi, UpdateTransactionOperationRequest
} from "@open-fabric/merchant-api-ts/dist/apis";
import {Configuration} from "@open-fabric/merchant-api-ts/dist/runtime";

const client_id = "<client_id>"
const client_secret = "<client_secret>";

const authEndpoint = 'https://auth.dev.openfabric.co/oauth2/token';
const basePath = 'https://api.dev.openfabric.co';

export class AccountsService {
    transactionsApi: TransactionsApi;
    accountToken: string | null;

    constructor() {
        this.transactionsApi = new TransactionsApi(new Configuration({
            basePath
        }));
        this.accountToken = null;
    }

    getTransById = async (id: string) => {
        const options = await this.getOptions();
        return this.transactionsApi.getTransactionDetailsInternal({id} as GetTransactionDetailsInternalRequest, options);
    };

    approveTransaction = async (account_reference_id: string) => {
        const options = await this.getOptions();
        return this.transactionsApi.updateTransaction({
            updateTransactionRequest: {
                account_reference_id,
                status: 'Approved'
            }
        } as UpdateTransactionOperationRequest, options);
    };

    cancelTransaction = async (account_reference_id: string) => {
        const options = await this.getOptions();
        return this.transactionsApi.updateTransaction({
            updateTransactionRequest: {
                account_reference_id,
                status: 'Failed',
                reason: 'User trigger failed',
            }
        } as UpdateTransactionOperationRequest, options);
    };

    private getOptions = async () => {
        this.accountToken = await this.getAccountToken();
        return ({
            headers: {
                Authorization: `Bearer ${this.accountToken}`,
                'content-type': 'application/json'
            },
        });
    };

    private getAccountToken = async () => {
        if (!this.accountToken) {
            const basic = new Buffer(client_id + ':' + client_secret).toString('base64');
            const data = qs.stringify({
                grant_type: 'client_credentials',
            });

            try {
                const result = await axios
                    .post(authEndpoint, data, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            Authorization: `Basic ${basic}`,
                        },
                    });
                this.accountToken = result.data.access_token;
            } catch (e) {
                alert('Cannot get access token for client credential flow');
            }
        }

        return this.accountToken;
    };
}
