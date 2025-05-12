import { input } from '@inquirer/prompts';
import { BaseAction } from './baseAction';

export class InputAction extends BaseAction {
    public type: string = 'input';
    public params: { inputText: string };

    constructor(params: { inputText: string }) {
        super();
        this.params = params;
    }

    execute(): void {
        console.log(this.params['inputText']);
    }
}
