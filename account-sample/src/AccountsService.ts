import axios from 'axios';

const basePath = 'https://api.dev.openfabric.co';

export class AccountsService {
    accountToken: string;

    constructor(accountToken: string) {
        this.accountToken = accountToken;
    }

    getTransById = async (id: string) =>
        axios.get(`${basePath}/t/transactions/${id}/details`, this.config);

    updateTransaction = async (account_reference_id: string, status: string, reason?: string) =>
        axios
            .put(
                `${basePath}/t/transactions`,
                {
                    account_reference_id,
                    status,
                    reason,
                },
                this.config,
            );

    private get config() {
        return ({
            headers: {
                Authorization: `Bearer ${this.accountToken}`,
                'content-type': 'application/json'
            },
        });
    }
}
