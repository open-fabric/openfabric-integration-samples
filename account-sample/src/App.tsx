import React, {useEffect, useRef, useState} from 'react';
import queryStringParser from 'query-string';

import {
    AccountsService,
} from './AccountsService';

import {CircularProgress} from './CircularProgress';
import {Button} from './Button';
import {TransactionDetailsResponse} from "@open-fabric/merchant-api-ts/dist/models/TransactionDetailsResponse";

const accountsService = new AccountsService();

export const App = () => {
    const paramRef = useRef<string | undefined>();

    const [transInfo, setTransInfo] = useState<TransactionDetailsResponse | undefined>();
    const [process, setProcess] = useState<string>('');

    useEffect(() => {
        const queryString = window.location.search;
        const parsed = queryStringParser.parse(queryString);
        paramRef.current = parsed.id as string;
    }, []);

    useEffect(() => {
        const id = paramRef && paramRef.current && paramRef.current;
        if (id) {
            accountsService.getTransById(id)
                .then((response) => {
                    if (response.status === 'Approved') {
                        setTransInfo(response);
                    }
                })
                .catch((error) => {
                    alert(
                        `${error.message} ${
                            !error.response && error.response
                                ? ''
                                : `${JSON.stringify(error.response)}`
                        }`
                    );
                });
        }
    }, [paramRef]);

    const CancelTransaction = async (transInfo: any) => {
        setProcess('Cancelled');

        await accountsService.cancelTransaction(transInfo.account_reference_id).finally(() => {
            setProcess('');
        });

        window.location.href = transInfo.gateway_fail_url;
    };

    const ApproveTransaction = async (transInfo: any) => {
        setProcess('Approved');
        await accountsService.approveTransaction(transInfo.account_reference_id).finally(() => {
            setProcess('');
        });

        window.location.href = transInfo.gateway_success_url;
    };

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
            {transInfo ? (
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
                        onClick={() => ApproveTransaction(transInfo)}
                        isRed={false}
                        isDisabled={process !== ''}
                    >
                        Approve Transaction
                        {process === 'Approved' && <CircularProgress/>}
                    </Button>
                    <Button
                        onClick={() => CancelTransaction(transInfo)}
                        isDisabled={process !== ''}
                        isRed={true}
                    >
                        Cancel Transaction
                        {process === 'Cancelled' && <CircularProgress/>}
                    </Button>
                </div>
            ) : (<div style={{marginTop: '48px'}}><CircularProgress/></div>)}
        </div>
    );
}
