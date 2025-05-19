import { errorHandler, Operation } from '../type';
import { ActionResult } from './ActionResult';
import { BaseAction } from '../actions/baseAction';

//TODO use the async-mutex lib to rewrite this class and tests
/**
 * The ActionQueue class stores various action classes and provides methods to manage and operate them.
 *
 * @example
 * ```ts
 * // Create a basic action queue and process actions
 * const actionQueue = new ActionQueue();
 * actionQueue.enqueue(new InputAction('input1', { value: 'test' }));
 * actionQueue.enqueue(new SelectAction('select1', { value: 'option1' }));
 * const result = await actionQueue.startProcess();
 * ```
 */
export class ActionQueue {
    /**
     * The internal array used as the queue body to store actions.
     * Each element in the array represents an action that will be processed in FIFO (First-In-First-Out) order.
     * @private
     */
    private actionQueue: BaseAction[] = [];
    /**
     * The flag indicating whether the action queue is currently processing actions.
     * @private
     *  */
    private isProcessing: boolean = false;
    /**
     * This sign indicates whether to enable intermediate result storage in chain calls.
     * @private
     * */
    private readonly cacheSteps?: boolean = false;
    /**
     * The `errorHandler` member handles errors thrown during chain calls.
     * default value is `undefined`
     * @public
     * */
    public readonly errorHandler?: errorHandler;

    //TODO Setting a flag indicates whether to pause or continue the cycle
    /**
     * Initialize the ActionQueue instance member
     *
     * @param operation - The operation object that contains the `cacheSteps` and `errorHandler` properties.
     * */
    constructor(
        operation: Operation = {
            cacheSteps: false,
            errorHandler: undefined,
        },
    ) {
        this.cacheSteps = operation.cacheSteps;
        this.errorHandler = operation.errorHandler;
    }

    /**
     * Add a new action to the queue
     *
     * @param action - The action to be added to the queue.
     * @returns `true` if the action is successfully added to the queue, otherwise `false`.
     * */
    public enqueue(action: BaseAction): boolean {
        if (this.isProcessing) {
            return false;
        }
        this.actionQueue.push(action);
        return true;
    }

    /**
     * Clear all actions from the queue
     *
     * @returns `void`
     * */
    public clear(): void {
        if (this.isProcessing) {
            throw new Error('Process is already running');
        }
        while (this.actionQueue.length > 0) {
            this.actionQueue.pop();
        }
    }

    /**
     * Get the length of the queue
     *
     * @returns The length of the queue.
     * */
    public length(): number {
        return this.actionQueue.length;
    }

    /**
     * Check if the queue is empty
     *
     * @returns `true` if the queue is empty, otherwise `false`.
     */
    public isEmpty(): boolean {
        return this.actionQueue.length === 0;
    }

    /**
     * Get the processing status of the queue
     * @returns The processing status of the queue.
     */
    public getProcessingStatus(): boolean {
        return this.isProcessing;
    }

    //TODO  Added pause and resume methods to perform pause and resume operations
    /**
     * Starts processing the action queue in sequence.
     *
     * This method executes each action in FIFO (First-In-First-Out) order and passes the result of one action as input to the next.
     * If caching is enabled, results of each action will be stored in the output object.
     *
     * If an error occurs during execution and an `errorHandler` has been set, it will be called with the error and the failed action.
     * Otherwise, the error will be thrown.
     *
     * @returns A promise that resolves to an `ActionResult` object containing results of executed actions.
     * @throws Will throw an error if the process is already running or if an unhandled error occurs during execution.
     *
     * @example
     * ```ts
     * const result = await actionQueue.startProcess();
     * console.log(result.fromArray()); // { inputAction: ..., selectAction: ... }
     * ```
     */
    public async startProcess(): Promise<ActionResult> {
        if (this.isProcessing) {
            return Promise.reject(new Error('Process is already running'));
        }
        this.isProcessing = true;
        const actionResult: ActionResult = new ActionResult();
        let nextParams: any[] | null = null;
        while (this.actionQueue.length > 0) {
            const action: BaseAction = this.actionQueue.shift()!;
            nextParams = await this.executeAction(action, nextParams);
            if (this.cacheSteps)
                actionResult.setResult(
                    action.type,
                    nextParams !== undefined ? nextParams : null,
                );
        }
        this.isProcessing = false;
        return actionResult;
    }

    /**
     * Executes the specified action.
     *
     * This function is responsible for asynchronously executing the given action and handling the result or potential errors.
     * It also updates the action result object with the result, unless the result is undefined, in which case it is set to null.
     *
     * @param action The action to execute, must be an instance of BaseAction
     * @param nextParams The parameters for the next action, can be any array or null
     * @returns The result of the action. If the result is a Promise, it waits for it and returns the resolved value
     */
    private async executeAction(action: BaseAction, nextParams: any[] | null) {
        try {
            let result = action.execute(nextParams);
            if (result instanceof Promise) {
                result = await result;
            }

            return result;
        } catch (error) {
            this.isProcessing = false;
            if (this.errorHandler) {
                this.errorHandler(error, action);
            } else {
                throw error;
            }
        }
    }
}
