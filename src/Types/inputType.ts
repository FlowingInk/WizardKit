/**
 * This file contains reverse-engineered type definitions based on Inquirer.js internals.
 * Original project: https://github.com/SBoudrias/Inquirer.js
 * Copyright: Copyright (c) 2025 Simon Boudrias
 * The original MIT License can be found at: https://github.com/SBoudrias/Inquirer.js/blob/main/LICENSE
 */
export type InputConfig = {
    message: string;
    default?: string;
    transformer?: (input: string, { isFinal }: { isFinal: boolean }) => string;
    validate?: (input: string) => boolean | string | Promise<boolean | string>;
    theme?: InputTheme;
};
type InputTheme = {
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
    };
    validationFailureMode: 'keep' | 'clear';
};
