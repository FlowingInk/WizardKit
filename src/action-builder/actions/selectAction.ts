import { BaseAction } from './baseAction';

export class SelectAction extends BaseAction {
    public type: string = 'select';

    public readonly params: object;

    constructor(params:{}={}) {
        super();
        this.params = params;
    }

    public execute() {
        console.log('Select Action');
    }
}
