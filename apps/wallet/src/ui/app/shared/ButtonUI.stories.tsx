// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { type Meta, type StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import Icon, { SuiIcons } from '../components/icon';
import { Button } from './ButtonUI';

export default {
    component: Button,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
} as Meta<typeof Button>;

export const Default: StoryObj<typeof Button> = {
    args: {
        text: 'Default Button',
    },
};

export const AllButton: StoryObj<typeof Button> = {
    render: (props) => {
        const variants = [
            'primary',
            'secondary',
            'outline',
            'warning',
        ] as const;
        const sizes = ['tall', 'narrow'] as const;
        return (
            <div className="grid gap-4 grid-cols-2">
                {sizes.map((size) =>
                    variants.map((variant) => (
                        <>
                            <Button
                                {...{ variant, size, text: variant }}
                                {...props}
                                before={<Icon icon={SuiIcons.Add} />}
                                after={<Icon icon={SuiIcons.Plus} />}
                            />
                            <Button
                                {...{ variant, size, text: variant }}
                                {...props}
                                disabled
                                text={`${props.text || variant} disabled`}
                                before={<Icon icon={SuiIcons.Add} />}
                                after={<Icon icon={SuiIcons.Plus} />}
                            />
                        </>
                    ))
                )}
            </div>
        );
    },
};

export const AllLink: StoryObj<typeof Button> = {
    ...AllButton,
    args: { to: '.' },
};
export const AllAnchor: StoryObj<typeof Button> = {
    ...AllButton,
    args: { href: 'https://example.com' },
};
