import { actionConstructor } from '../type';

/**
 * A static registry for mapping action types names to their corresponding action classes.
 *
 * This class provides a centralized mechanism to register, retrieve, and manage action constructors
 * by their unique type names. It is typically used during application setup or plugin loading
 * to enable dynamic instantiation of actions at runtime.
 */
export class ActionRegister {
    /**
     * The internal map used to store registered action types and their corresponding action classes.
     * @private
     */
    private static readonly _map = new Map<string, actionConstructor>();

    /**
     * Register an action class with next type name and their corresponding action class
     * @param type - A action type name of string to associate with the action class.
     * @param actionClass -  A action class to associate with the type name.
     */
    public static register(
        type: string = '',
        actionClass: actionConstructor | null = null,
    ): void {
        if (type === '' || actionClass === null) {
            throw new Error(`The incoming argument is empty`);
        }
        if (this._map.has(type)) {
            throw new Error(`${type} is already registered`);
        }
        this._map.set(type, actionClass);
    }

    /**
     * Unregister an action class with next type name and their corresponding action class
     * @param type - A action type name of string to associate with the action class.
     */
    public static unregister(type: string): void {
        if (!this._map.has(type)) {
            throw new Error(`${type} is not register`);
        }
        this._map.delete(type);
    }

    /**
     * Clear all registered action classes.
     */
    public static clear(): void {
        this._map.clear();
    }

    /**
     * Get action class by type name
     * @param type - A action type name of string to associate with the action class.
     * @returns - A action class constructor
     */
    public static getActionClass(type: string): actionConstructor {
        const cls = this._map.get(type)!;
        if (!cls) {
            throw new Error(`${type} is not register`);
        }
        return cls;
    }

    /**
     * Get an array of registered action types and their corresponding action classes.
     * @returns - An array of [type, actionClass] tuples
     */
    public static getTypes(): [string, actionConstructor][] {
        return Array.from(this._map.entries());
    }
}
