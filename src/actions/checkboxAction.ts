import { BaseAction } from './baseAction';

import { checkbox } from '@inquirer/prompts';
import { CheckboxConfig } from '../Types/checkboxType';

export class CheckboxAction extends BaseAction {
    public type: string = 'checkbox';
    private readonly checkboxConfig: CheckboxConfig<any>;

    constructor(checkboxConfig: CheckboxConfig<any>) {
        super();
        this.checkboxConfig = checkboxConfig;
    }

    public async execute() {
        return checkbox(this.checkboxConfig);
    }
}
