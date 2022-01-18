import React, {useEffect, useState} from 'react';
import queryStringParser from 'query-string';
import qs from 'qs';
import axios from "axios";

import {
    AccountsService,
} from './AccountsService';
import {CircularProgress} from './CircularProgress';
import {Button} from './Button';

const client_id = "<client_id>"
const client_secret = "<client_secret>";

const authEndpoint = 'https://auth.dev.openfabric.co/oauth2/token';

const getAccountToken = async () => {
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
        return result.data.access_token;
    } catch (e) {
        alert('Cannot get access token for client credential flow');
    }
    return null;
};

enum Stage {
    Init,
    Failed,
    Approved,
}

const getStatus = (stage: Stage) => {
    switch (+stage) {
        case Stage.Failed:
            return 'Failed';
        case Stage.Approved:
            return 'Approved';
        default:
            return null;
    }
}

const showAlert = (error: any) =>
    alert(
        `${error.message} ${
            !error.response && error.response
                ? ''
                : `${JSON.stringify(error.response)}`
        }`
    );

export const App = () => {
    const [id, setId] = React.useState<string | null>(null);
    const [accountsService, setAccountsService] = React.useState<AccountsService | undefined>(undefined);
    const [transInfo, setTransInfo] = useState<object | undefined>();
    const [stage, setStage] = useState<Stage>(Stage.Init);

    useEffect(() => {
        const queryString = window.location.search;
        const parsed = queryStringParser.parse(queryString);

        if (parsed.id) {
            setId(parsed.id.toString());
        }

        getAccountToken().then((accountToken) => {
            if (accountToken) {
                setAccountsService(new AccountsService(accountToken));
            } else {
                alert("Can't retrieve account token!")
            }
        });
    }, []);

    useEffect(() => {
        if (id && accountsService) {
            accountsService.getTransById(id)
                .then((response) => {
                    if (response.status === 200) {
                        setTransInfo(response.data);
                    }
                })
                .catch(showAlert);
        }
    }, [id, accountsService]);

    const updateTransaction = React.useCallback((transInfo: any, stage: Stage, reason?: string) => () => {
        setStage(stage);
        if (!accountsService) {
            return;
        }

        const status = getStatus(stage);
        if (status === null) {
            alert("Stage should be either Approved or Failed!");
            return;
        }

        accountsService.updateTransaction(transInfo.account_reference_id, status, reason).then(() => {
            window.location.href = transInfo.gateway_success_url;
        }).catch(showAlert).finally(() => {
            setStage(Stage.Init);
        });
    }, [accountsService]);


    return (
        <div
            style={{
                fontFamily: 'sans-serif',
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <h2 style={{textAlign: 'center'}}>OpenFabric - Account Integration Sample</h2>
            {transInfo && accountsService ? (
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignContent: 'space-around',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        onClick={updateTransaction(transInfo, Stage.Failed, "User trigger failed")}
                        isRed={false}
                        isDisabled={stage !== Stage.Init}
                    >
                        Approve Transaction
                        {stage === Stage.Failed && <CircularProgress/>}
                    </Button>
                    <Button
                        onClick={updateTransaction(transInfo, Stage.Approved)}
                        isDisabled={stage !== Stage.Init}
                        isRed={true}
                    >
                        Cancel Transaction
                        {stage === Stage.Approved && <CircularProgress/>}
                    </Button>
                </div>
            ) : (<div style={{marginTop: '48px'}}><CircularProgress/></div>)}
        </div>
    );
}
