import _ from 'lodash';

/**
 * Stores intermediate results when the `cacheSteps` option is enabled.
 *
 * This class allows users to backtrack or reuse intermediate values by maintaining a mapping of action type names to their corresponding results.
 * It stores these mappings in an array of key-value pairs, where the key is a string representing the action type name and the value is of any type.
 *
 * @remarks To utilize intermediate results, you must pass an appropriate configuration to the `ActionBuilder` constructor enabling the `cacheSteps` option.
 */
export class ActionResult {
    /**
     * An array of key-value pairs, where the key is a string representing the action type name and the value is of any type.
     * @private
     */
    private resultArray: Array<[string, any]> = [];
    /**
     * Indicates whether the `ActionResult` object is empty.
     * @private
     */
    private empty: boolean = true;

    constructor() {}

    /**
     * store result into the Array
     * @param type - A action type name of string to associate with the action class.
     * @param actionResult - The result of executing the action class method
     */
    public setResult(type: string, actionResult: any): void {
        if (type === '') throw new Error('Type cannot be empty');
        this.resultArray.push([type, actionResult]);
        this.empty = false;
    }

    /**
     * get result with type name from Array
     * @param type - A action type name of string to associate with the action class.
     * @returns - The result of executing the action class method
     */
    public getValue(type: string): Array<[string, any]> {
        return this.resultArray.filter(
            (subArray) => subArray.length > 0 && subArray[0] === type,
        );
    }

    /**
     * check if the Array is empty
     * @returns indicates if the array is empty
     */
    public isEmpty(): boolean {
        return this.empty;
    }

    /**
     * get the array of results
     * @returns the array of results
     */
    public fromArray(): Array<[string, any]> {
        return _.cloneDeep(this.resultArray);
    }
}
