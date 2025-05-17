import { BaseAction } from './baseAction';
import { InputConfig } from '../Types/inputType';

import { input } from '@inquirer/prompts';
export class InputAction extends BaseAction {
    public type: string = 'input';
    private readonly inputConfig: InputConfig;

    constructor(inputConfig: InputConfig) {
        super();
        this.inputConfig = inputConfig;
    }

    async execute(): Promise<String> {
        return input(this.inputConfig);
    }
}
