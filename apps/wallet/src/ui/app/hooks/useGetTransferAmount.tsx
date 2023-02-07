// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { SUI_TYPE_ARG, getTransactions } from '@mysten/sui.js';
import { useMemo } from 'react';

import { getEventsSummary, getAmount } from '_helpers';

import type { SuiTransactionResponse, SuiAddress } from '@mysten/sui.js';

export function useGetTransferAmount({
    txn,
    activeAddress,
}: {
    txn: SuiTransactionResponse;
    activeAddress: SuiAddress;
}) {
    const { certificate, effects } = txn;
    const { coins: eventsSummary } = getEventsSummary(effects, activeAddress);

    const suiTransfer = useMemo(() => {
        const txdetails = getTransactions(certificate)[0];
        return getAmount(txdetails, effects)?.map(
            ({ amount, coinType, recipientAddress }) => {
                // multiply by -1 to match the amount in the event summary, so that negative amount means sent and +ive is received 
                return {
                    amount: -1 * (amount || 0),
                    coinType: coinType || SUI_TYPE_ARG,
                    receiverAddress: recipientAddress,
                };
            }
        );
    }, [certificate, effects]);

    const transferAmount = useMemo(() => {
        return suiTransfer?.length
            ? suiTransfer
            : eventsSummary.filter(
                  ({ receiverAddress }) => receiverAddress === activeAddress
              );
    }, [suiTransfer, eventsSummary, activeAddress]);

    return suiTransfer ?? transferAmount;
}
