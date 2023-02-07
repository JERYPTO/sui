// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// TODO: replace all the existing button usages (the current Button component or button) with this
// TODO: rename this to Button when the existing Button component is removed

import { cva, type VariantProps, cx } from 'class-variance-authority';
import { forwardRef, type Ref } from 'react';

import { ButtonOrLink, type ButtonOrLinkProps } from './utils/ButtonOrLink';

import type { ReactNode } from 'react';

const styles = cva(
    [
        'transition no-underline flex flex-row flex-nowrap items-center',
        'justify-center border-none bg-transparent cursor-pointer gap-2 outline-none',
        'group text-body font-semibold max-w-full min-w-0 disabled:opacity-40',
    ],
    {
        variants: {
            variant: {
                primary: [
                    'bg-hero-dark hover:bg-hero focus:bg-hero text-white visited:text-white active:text-white/70',
                    'disabled:bg-hero-darkest disabled:text-white',
                ],
                secondary: [
                    'bg-gray-45 text-steel-darker visited:text-steel-darker active:text-steel-darker/70 disabled:text-steel-darker',
                ],
                outline: [
                    'bg-white !border-solid border border-steel text-steel-dark hover:border-steel-dark',
                    'focus:border-steel-dark hover:text-steel-darker focus:text-steel-darker active:border-steel',
                    'active:text-steel-dark visited:text-steel-dark',
                ],
                warning: [
                    'bg-issue-light text-issue-dark visited:text-issue-dark active:text-issue/70',
                ],
            },
            size: {
                tall: ['h-11 px-5 rounded-xl'],
                narrow: ['h-9 py-2.5 px-5 rounded-lg'],
            },
        },
        compoundVariants: [
            {
                variant: 'outline',
                className: [
                    '!opacity-100 !border-gray-45 focus:border-gray-45 hover:border-gray-45 active:border-gray-45',
                    'text-steel-dark/50 hover:text-steel-dark/50 focus:text-steel-dark/50 active:text-steel-dark/50',
                ],
            },
            {
                variant: 'warning',
                className: ['text-issue-dark/50 active:text-issue-dark/50'],
            },
        ],
    }
);
const iconStyles = cva('transition flex', {
    variants: {
        variant: {
            primary: ['text-sui-light'],
            secondary: ['text-steel group-active:opacity-70'],
            outline: [
                'text-steel group-hover:text-steel-darker group-focus:text-steel-darker group-active:text-steel-dark',
            ],
            warning: [
                'opacity-80 group-hover:opacity-100 group-focus:opacity-100 group-active:text-issue group-active:opacity-70',
            ],
        },
        disabled: {
            true: [''],
            false: [],
        },
    },
    compoundVariants: [
        {
            disabled: true,
            variant: 'primary',
            className: ['text-steel group-active:opacity-70'],
        },
        {
            disabled: true,
            variant: 'outline',
            className: [
                '!text-steel group-hover:text-steel group-focus:text-steel group-active:text-steel',
            ],
        },
        {
            disabled: true,
            variant: 'warning',
            className: [
                'text-issue group-hover:opacity-50 group-focus:opacity-50',
            ],
        },
    ],
});

export interface ButtonProps
    extends VariantProps<typeof styles>,
        Omit<VariantProps<typeof iconStyles>, 'disabled'>,
        Omit<ButtonOrLinkProps, 'className'> {
    before?: ReactNode;
    after?: ReactNode;
    text: ReactNode;
}

export const Button = forwardRef(
    (
        {
            variant,
            size,
            disabled,
            before,
            after,
            text,
            ...otherProps
        }: ButtonProps,
        ref: Ref<HTMLAnchorElement | HTMLButtonElement>
    ) => {
        return (
            <ButtonOrLink
                disabled={disabled}
                ref={ref}
                className={styles({ variant, size })}
                {...otherProps}
            >
                {before ? (
                    <div className={iconStyles({ variant })}>{before}</div>
                ) : null}
                <div
                    className={cx(
                        disabled ? 'opacity-70' : null,
                        'truncate leading-tight'
                    )}
                >
                    {text}
                </div>
                {after ? (
                    <div className={iconStyles({ variant })}>{after}</div>
                ) : null}
            </ButtonOrLink>
        );
    }
);

Button.displayName = 'Button';
