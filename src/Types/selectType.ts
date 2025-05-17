/**
 * This file contains reverse-engineered type definitions based on Inquirer.js internals.
 * Original project: https://github.com/SBoudrias/Inquirer.js
 * Copyright: Copyright (c) 2025 Simon Boudrias
 * The original MIT License can be found at: https://github.com/SBoudrias/Inquirer.js/blob/main/LICENSE
 */
import { Separator } from '@inquirer/core';
type Choice<Value> = {
    value: Value;
    name?: string;
    description?: string;
    short?: string;
    disabled?: boolean | string;
};

type Theme = {
    prefix: string | { idle: string; done: string };
    spinner: {
        interval: number;
        frames: string[];
    };
    style: {
        answer: (text: string) => string;
        message: (text: string, status: 'idle' | 'done' | 'loading') => string;
        error: (text: string) => string;
        help: (text: string) => string;
        highlight: (text: string) => string;
        description: (text: string) => string;
        disabled: (text: string) => string;
    };
    icon: {
        cursor: string;
    };
    helpMode: 'always' | 'never' | 'auto';
    indexMode: 'hidden' | 'number';
};

export type SelectConfig<Value> = {
    message: string;
    choices:
        | readonly (string | Separator)[]
        | readonly (Separator | Choice<Value>)[];
    default?: unknown;
    pageSize?: number;
    loop?: boolean | undefined;
    instructions?: { navigation: string; pager: string };
    theme?: Theme;
};
