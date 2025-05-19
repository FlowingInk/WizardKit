'use strict';


import { InputConfig } from '../Types/inputType';
import { SelectConfig } from '../Types/selectType';
import { CheckboxConfig } from '../Types/checkboxType';
import { ActionQueue } from './ActionQueue';
import { ActionRegister } from './ActionRegister';

export class ActionFlow {
    private actionQueue: ActionQueue = new ActionQueue();

    constructor(cacheSteps: boolean = false) {
        this.actionQueue = new ActionQueue({ cacheSteps: cacheSteps });
    }

    public next(nextType: string, nextParams: object = {}): this {
        const actionClass = new (ActionRegister.getActionClass(
            nextType,
        ) as any)(nextParams);
        this.actionQueue.enqueue(actionClass);
        return this;
    }

    public input(inputConfig: InputConfig): this {
        this.actionQueue.enqueue(new (ActionRegister.getActionClass('input'))(inputConfig));
        return this;
    }

    public select(selectConfig: SelectConfig<any>): this {
        this.actionQueue.enqueue(new (ActionRegister.getActionClass('select'))(selectConfig));
        return this;
    }

    public checkbox(checkboxConfig: CheckboxConfig<any>): this {
        this.actionQueue.enqueue(new (ActionRegister.getActionClass('checkbox'))(checkboxConfig));
        return this;
    }

    public end() {
        return this.actionQueue.startProcess();
    }
}
