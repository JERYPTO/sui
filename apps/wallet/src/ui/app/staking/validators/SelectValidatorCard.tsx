// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import cl from 'classnames';
import { useState, useMemo } from 'react';

import { STATE_OBJECT, getName } from '../usePendingDelegation';
import { ValidatorListItem } from './ValidatorListItem';
import { Content, Menu } from '_app/shared/bottom-menu-layout';
import Button from '_app/shared/button';
import { Text } from '_app/shared/text';
import { validatorsFields } from '_app/staking/validatorsFields';
import Alert from '_components/alert';
import Icon, { SuiIcons } from '_components/icon';
import LoadingIndicator from '_components/loading/LoadingIndicator';
import { useGetObject } from '_hooks';
import { formatPercentage } from '_src/shared/formatting';

export function SelectValidatorCard() {
    const [selectedValidator, setSelectedValidator] = useState<null | string>(
        null
    );
    const [sortKey, setSortKey] = useState<'name' | 'stakeShare'>('stakeShare');
    const [sortAscending, setSortAscending] = useState(true);

    const { data, isLoading, isError } = useGetObject(STATE_OBJECT);

    const validatorsData = data && validatorsFields(data);

    const selectValidator = (address: string) => {
        setSelectedValidator((state) => (state !== address ? address : null));
    };

    const handleSortByKey = (key: 'name' | 'stakeShare') => {
        if (key === sortKey) {
            setSortAscending(!sortAscending);
        }
        setSortKey(key);
    };

    const totalStake = useMemo(() => {
        if (!validatorsData) return 0;
        return validatorsData?.validators.fields.active_validators.reduce(
            (acc, curr) =>
                (acc +=
                    +curr.fields.delegation_staking_pool.fields.sui_balance +
                    +curr.fields.stake_amount),
            0
        );
    }, [validatorsData]);

    const validatorList = useMemo(() => {
        if (!validatorsData) return [];

        const sortedAsc = validatorsData.validators.fields.active_validators
            .map((validator) => ({
                name: getName(validator.fields.metadata.fields.name),
                address: validator.fields.metadata.fields.sui_address,
                stakeShare: formatPercentage(
                    +validator.fields.delegation_staking_pool.fields
                        .sui_balance + +validator.fields.stake_amount,
                    BigInt(totalStake)
                ),
                logo:
                    validator.fields.metadata.fields.image_url &&
                    typeof validator.fields.metadata.fields.image_url ===
                        'string'
                        ? validator.fields.metadata.fields.image_url
                        : null,
            }))
            .sort((a, b) => {
                if (sortKey === 'name') {
                    return a[sortKey].localeCompare(b[sortKey], 'en', {
                        sensitivity: 'base',
                        numeric: true,
                    });
                }
                return a[sortKey] - b[sortKey];
            });
        return sortAscending ? sortedAsc : sortedAsc.reverse();
    }, [sortAscending, sortKey, validatorsData, totalStake]);

    if (isLoading) {
        return (
            <div className="p-2 w-full flex justify-center items-center h-full">
                <LoadingIndicator />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-2">
                <Alert mode="warning">
                    <div className="mb-1 font-semibold">
                        Something went wrong
                    </div>
                </Alert>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full -my-5">
            <Content className="flex flex-col w-full items-center">
                <div className="flex flex-col w-full items-center -top-5 bg-white sticky pt-5 pb-2.5 z-50 mt-0">
                    <div className="flex items-start w-full mb-2">
                        <Text
                            variant="subtitle"
                            weight="medium"
                            color="steel-darker"
                        >
                            Sort by:
                        </Text>
                        <div className="flex items-center ml-2 gap-1.5">
                            <button
                                className="bg-transparent border-0 p-0 flex gap-1 cursor-pointer"
                                onClick={() => handleSortByKey('stakeShare')}
                            >
                                <Text
                                    variant="caption"
                                    weight="medium"
                                    color={
                                        sortKey === 'stakeShare'
                                            ? 'hero'
                                            : 'steel-darker'
                                    }
                                >
                                    Stake Share
                                </Text>
                                {sortKey === 'stakeShare' && (
                                    <Icon
                                        icon={SuiIcons.ArrowLeft}
                                        className={cl(
                                            'text-captionSmall font-thin  text-hero',
                                            sortAscending
                                                ? 'rotate-90'
                                                : '-rotate-90'
                                        )}
                                    />
                                )}
                            </button>

                            <button
                                className="bg-transparent border-0 p-0 flex gap-1 cursor-pointer"
                                onClick={() => handleSortByKey('name')}
                            >
                                <Text
                                    variant="caption"
                                    weight="medium"
                                    color={
                                        sortKey === 'name'
                                            ? 'hero'
                                            : 'steel-darker'
                                    }
                                >
                                    Name
                                </Text>
                                {sortKey === 'name' && (
                                    <Icon
                                        icon={SuiIcons.ArrowLeft}
                                        className={cl(
                                            'text-captionSmall font-thin  text-hero',
                                            sortAscending
                                                ? 'rotate-90'
                                                : '-rotate-90'
                                        )}
                                    />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-start w-full">
                        <Text
                            variant="subtitle"
                            weight="medium"
                            color="steel-darker"
                        >
                            Select a validator to start staking SUI.
                        </Text>
                    </div>
                </div>
                <div className="flex items-start flex-col w-full mt-1 flex-1">
                    {validatorsData &&
                        validatorList.map(
                            ({ name, address, stakeShare, logo }) => (
                                <div
                                    className="cursor-pointer w-full relative"
                                    key={address}
                                    onClick={() => selectValidator(address)}
                                >
                                    <ValidatorListItem
                                        selected={selectedValidator === address}
                                        validatorAddress={address}
                                        validatorName={name}
                                        logo={logo}
                                        stakeShare={stakeShare}
                                    />
                                </div>
                            )
                        )}
                </div>
            </Content>
            {selectedValidator && (
                <Menu
                    stuckClass="staked-cta"
                    className="w-full px-0 pb-5 mx-0 -bottom-5"
                >
                    <Button
                        size="large"
                        mode="primary"
                        href={`/stake/new?address=${encodeURIComponent(
                            selectedValidator
                        )}`}
                        className="w-full"
                    >
                        Select Amount
                        <Icon
                            icon={SuiIcons.ArrowRight}
                            className="text-captionSmall text-white font-normal"
                        />
                    </Button>
                </Menu>
            )}
        </div>
    );
}
