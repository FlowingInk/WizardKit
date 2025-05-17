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
    checked?: boolean;
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
        defaultAnswer: (text: string) => string;
        help: (text: string) => string;
        highlight: (text: string) => string;
        key: (text: string) => string;
        disabledChoice: (text: string) => string;
        description: (text: string) => string;
        renderSelectedChoices: <T>(
            selectedChoices: ReadonlyArray<Choice<T>>,
            allChoices: ReadonlyArray<Choice<T> | Separator>,
        ) => string;
    };
    icon: {
        checked: string;
        unchecked: string;
        cursor: string;
    };
    helpMode: 'always' | 'never' | 'auto';
};

export type CheckboxConfig<Value> = {
    message: string;
    choices:
        | readonly (string | Separator)[]
        | readonly (Separator | Choice<Value>)[];
    pageSize?: number;
    loop?: boolean | undefined;
    required?: boolean | undefined;
    validate?:
        | ((
              choices: readonly Choice<Value>[],
          ) => boolean | string | Promise<string | boolean>)
        | undefined;
    shortcut?: { all?: string | null; invert?: string | null } | undefined;
    theme?: Theme;
};
