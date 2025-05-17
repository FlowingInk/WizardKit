import { ActionFlow } from './ActionFlow';
import { InputAction } from './actions/inputAction';
import { ActionRegister } from './ActionRegister';
import _ from 'lodash';
import { actionConstructor, Operation } from '../type';

/**
 * A builder class for creating and managing a sequence of actions with optional caching of intermediate results.
 *
 * This class provides methods to register, unregister, and update custom action types,
 * and serves as a factory for creating `ActionFlow` instances that execute the registered actions in sequence.
 *
 * It maintains an internal registry of available action types and ensures they are properly registered
 * before being used in a flow. Built-in actions (e.g., input, select) are pre-registered by default.
 *
 * @example
 * ```ts
 * const builder = new ActionBuilder({ cacheSteps: true });
 * builder.startWith('input', { value: 'hello' })
 *        .next('select', { option: 'A' })
 *        .executeAll()
 * ```
 */
export class ActionBuilder {
    /**
     * Indicates whether intermediate results should be cached during execution.
     *
     * When set to `true`, intermediate results can be accessed or reused later in the action flow.
     */
    public readonly cacheSteps: boolean = false;
    /**
     * An internal record mapping action type names to their corresponding action constructors.
     *
     * This record is used to keep track of all registered actions and ensure they are properly initialized.
     * It includes built-in actions and any additional actions registered via the `registerAction` method.
     */
    private readonly actionRegisterIndex: Record<string, actionConstructor> = {
    };

    /**
     * Initializes a new instance of the `ActionBuilder` class.
     *
     * @param operation - Configuration options for the builder, including whether to enable caching of intermediate results.
     * @see {@link Operation} for more details on configuration options.
     */
    constructor(
        operation: Operation = {
            cacheSteps: false,
        },
    ) {
        this.cacheSteps = operation.cacheSteps;
        this.initAction();
    }

    /**
     * Initializes the internal action registry by registering all built-in actions.
     *
     * This method is called automatically during construction to ensure all predefined actions are ready for use.
     */
    private initAction(): void {
        for (const key in this.actionRegisterIndex) {
            ActionRegister.register(key, this.actionRegisterIndex[key]);
        }
    }

    /**
     * Registers a new action type with its corresponding constructor.
     *
     * Throws an error if the action type is already registered.
     *
     * @param type - The unique identifier for the action type.
     * @param actionClass - The constructor function for the action.
     * @throws Will throw an error if the action type is already registered.
     */
    public registerAction(type: string, actionClass: actionConstructor): void {
        if (type in this.actionRegisterIndex) {
            throw new Error(`${type} is already registered`);
        }
        ActionRegister.register(type, actionClass);
        this.actionRegisterIndex[type] = actionClass; //Add an action to the table
    }

    /**
     * Unregisters an existing action type.
     *
     * Throws an error if the action type is not currently registered.
     *
     * @param type - The unique identifier for the action type to unregister.
     * @throws Will throw an error if the action type is not registered.
     */
    public unRegisterAction(type: string): void {
        ActionRegister.unregister(type);
        delete this.actionRegisterIndex[type];
    }

    /**
     * Updates an existing action type with a new constructor.
     *
     * First unregisters the old action type and then registers the new one.
     *
     * @param type - The unique identifier for the action type.
     * @param actionClass - The new constructor function for the action.
     */
    public updateAction(type: string, actionClass: actionConstructor): void {
        ActionRegister.unregister(type);
        ActionRegister.register(type, actionClass);
        this.actionRegisterIndex[type] = actionClass; //Add an action to the table
    }

    /**
     * Creates a new `ActionFlow` instance starting with the specified action type and parameters.
     *
     * @param type - The initial action type to start the flow with.
     * @param params - Optional parameters for the initial action.
     * @returns A new `ActionFlow` instance configured with the provided action and parameters.
     * @see {@link ActionFlow} for more details on the `ActionFlow` class.
     */
    public startWith(type: string, params: object = {}): ActionFlow {
        return new ActionFlow(this.cacheSteps).next(type, params);
    }

    /**
     * Returns a deep copy of the internal action registry.
     *
     * This allows safe access to the current state of the action registry without modifying it.
     *
     * @returns A deep copy of the action registry, where keys are action type names and values are {@link actionConstructor} instances.
     */
    public getActionRegisterIndex(): Record<string, actionConstructor> {
        return _.cloneDeep(this.actionRegisterIndex);
    }
}
