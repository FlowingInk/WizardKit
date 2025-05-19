import { BaseAction } from './baseAction';
import { SelectConfig } from '../Types/selectType';

import { select } from '@inquirer/prompts';

export class SelectAction extends BaseAction {
    public type: string = 'select';
    private readonly selectConfig: SelectConfig<any>;

    constructor(selectConfig: SelectConfig<any>) {
        super();
        this.selectConfig = selectConfig;
    }

    public async execute(...args: any[]): Promise<any> {
        return select(this.selectConfig);
    }
}
