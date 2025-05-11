'use strict';

import { ActionQueue } from './ActionQueue';
import { ActionRegister } from './ActionRegister';
import { ActionResult } from './ActionResult';

/**
 * ActionFlow class as the construction process for regulating action classes
 *
 * Provider a chain call method and unified execution entry point
 *
 *@example
 * ```ts
 * //create ActionFlow instance and chain call method
 * const testFlow = new ActionFlow()
 *      .next('input', {
 *          type: 'text',
 *          placeholder: 'Please input your name',
 *      })
 *      .next('select', {
 *          options: ['Option 1', 'Option 2', 'Option 3'],
 *      })
 *      .executeAll();
 * ```
 * */
export class ActionFlow {
    /**
     * ActionQueue instance to store action classes
     * @private
     */
    private readonly actionQueue: ActionQueue;
    /**
     * Cache steps flag
     * @private
     */
    private cacheSteps: boolean = false;

    /**
     * Initialize ActionQueue instance
     * @param cacheSteps - cache steps flag,whether enable cacheSteps
     */
    constructor(cacheSteps: boolean = false) {
        this.actionQueue = new ActionQueue({ cacheSteps: cacheSteps });
    }

    /**
     * Add an action to the flow by resolving its action class using the provider type name and instantiating with the given parameters
     *
     * This method is used to build the chain of actions to be executed sequentially
     *
     * @param nextType -  The registered type name of the action class to instantiate.
     * @param nextParams - Optional parameters to pass to the action constructor.
     * @returns this - The current ActionFlow instance for chaining.
     */
    public next(nextType: string, nextParams: object = {}): this {
        const actionClass = new (ActionRegister.getActionClass(
            nextType,
        ) as any)(nextParams);
        this.actionQueue.enqueue(actionClass);
        return this;
    }

    /**
     * Execute all actions in the ActionQueue and return the result.
     * @returns Promise<ActionResult> - The result of the executed actions.
     */
    public async executeAll(): Promise<ActionResult> {
        return this.actionQueue.startProcess();
    }
}
