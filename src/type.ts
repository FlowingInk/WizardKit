import { BaseAction } from './action-builder/actions/baseAction';

/**
 * Represents a constructor function that creates an instance of a class derived from `BaseAction`.
 *
 * This type is used throughout the framework to dynamically instantiate actions based on registered type names.
 * Any class used with this type should extend the `BaseAction` class and provide a compatible constructor.
 */
export type actionConstructor = new (...args: any[]) => BaseAction;
/**
 * Configuration options for initializing an `ActionBuilder` instance.
 *
 * These options control the behavior of the action builder, such as whether intermediate execution results should be cached.
 */
export type Operation = {
    /**
     * Indicates whether intermediate results should be cached during action flow execution.
     *
     * When set to `true`, each action result will be stored and can be accessed later in the flow.
     */
    cacheSteps: boolean;
    /**
     * An optional global error handler that will be called whenever an unhandled error occurs in the action flow.
     *
     * This allows centralized error processing, logging, or recovery logic to be applied across all actions.
     */
    errorHandler?: errorHandler;
};
/**
 * A function type for handling errors that occur during action execution.
 *
 * This handler is typically invoked when an action in the flow throws an error,
 * allowing custom logic to be executed before deciding whether to continue or stop the flow.
 *
 * @param error - The error object thrown during execution.
 * @param callback - Optional context or callback data that can be used to resume or respond to the error.
 * @returns void
 */
export type errorHandler = (error: unknown, callback: any) => void;
