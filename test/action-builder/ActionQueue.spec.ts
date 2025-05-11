import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { BaseAction } from '../../src/action-builder/actions/baseAction';
import { ActionQueue } from '../../src/action-builder/ActionQueue';
import { ActionResult } from '../../src/action-builder/ActionResult';

class testAction_async1 extends BaseAction {
    public type: string = 'test_async1';
    public params: {};

    constructor(params: {} = {}) {
        super();
        this.params = params;
    }

    public async execute(): Promise<string> {
        return 'test class 1_async';
    }
}

class testAction_async2 extends BaseAction {
    public type: string = 'test_async2';
    public params: {};

    constructor(params: {} = {}) {
        super();
        this.params = params;
    }

    public async execute(): Promise<string> {
        return 'test class 2_async';
    }
}

class testAction_sync1 extends BaseAction {
    public type: string = 'test_sync1';
    public params: {};

    constructor(params: {} = {}) {
        super();
        this.params = params;
    }

    public execute(): string {
        return 'test class 1_sync';
    }
}

class testAction_sync2 extends BaseAction {
    public type: string = 'test_sync2';
    public params: {};

    constructor(params: {} = {}) {
        super();
        this.params = params;
    }

    public execute(): string {
        return 'test class 2_sync';
    }
}

class testAction_chain1 extends BaseAction {
    type: string = 'testAction_chain1';
    params: object = {};

    execute(...args: any[]) {
        return 1;
    }
}

class testAction_chain2 extends BaseAction {
    type: string = 'testAction_chain2';
    params: object = {};

    execute(passParams: number) {
        return passParams + 1;
    }
}

class testAction_chain3 extends BaseAction {
    type: string = 'testAction_chain3';
    params: object = {};

    execute(passParams: number) {
        return passParams + 1;
    }
}

let actionQueue_cache_false: ActionQueue;
let actionQueue_cache_true: ActionQueue;
beforeEach(() => {
    actionQueue_cache_false = new ActionQueue({ cacheSteps: false });
    actionQueue_cache_true = new ActionQueue({ cacheSteps: true });
});
describe('ActionQueue class tests', () => {
    describe('Basic functional testing', () => {
        test('should the action queue is executed sequentially', async () => {
            actionQueue_cache_true.enqueue(new testAction_async1());
            actionQueue_cache_true.enqueue(new testAction_sync1());
            actionQueue_cache_true.enqueue(new testAction_async2());
            actionQueue_cache_true.enqueue(new testAction_sync2());
            const resultArray: Array<any>[] = (
                (await actionQueue_cache_true.startProcess()) as ActionResult
            ).fromArray();
            expect(resultArray).toEqual([
                ['test_async1', 'test class 1_async'],
                ['test_sync1', 'test class 1_sync'],
                ['test_async2', 'test class 2_async'],
                ['test_sync2', 'test class 2_sync'],
            ]);
        });
        test('should store the action result correctly', async () => {
            actionQueue_cache_true.enqueue(new testAction_async1());
            const result1 =
                (await actionQueue_cache_true.startProcess()) as ActionResult;
            expect(result1.getValue('test_async1')).toStrictEqual([
                ['test_async1', 'test class 1_async'],
            ]);
            actionQueue_cache_true.enqueue(new testAction_sync1());
            const result2 =
                (await actionQueue_cache_true.startProcess()) as ActionResult;
            expect(result2.getValue('test_sync1')).toStrictEqual([
                ['test_sync1', 'test class 1_sync'],
            ]);
            actionQueue_cache_true.enqueue(new testAction_async2());
            const result3 =
                (await actionQueue_cache_true.startProcess()) as ActionResult;
            expect(result3.getValue('test_async2')).toStrictEqual([
                ['test_async2', 'test class 2_async'],
            ]);
            actionQueue_cache_true.enqueue(new testAction_sync2());
            const result4 =
                (await actionQueue_cache_true.startProcess()) as ActionResult;
            expect(result4.getValue('test_sync2')).toStrictEqual([
                ['test_sync2', 'test class 2_sync'],
            ]);
        });
        test('should be cleared after completing all methods', () => {
            actionQueue_cache_true.enqueue(new testAction_async1());
            actionQueue_cache_true.enqueue(new testAction_sync1());
            actionQueue_cache_true.enqueue(new testAction_async1());
            actionQueue_cache_true.enqueue(new testAction_sync1());
            expect(actionQueue_cache_true.length()).toBe(4);
            actionQueue_cache_true.clear();
            expect(actionQueue_cache_true.length()).toBe(0);
        });
        test('should return a empty array when cache operation is set disabled', async () => {
            actionQueue_cache_false.enqueue(new testAction_async1());
            actionQueue_cache_false.enqueue(new testAction_sync1());
            actionQueue_cache_false.enqueue(new testAction_async1());

            expect(
                (await actionQueue_cache_false.startProcess()).fromArray(),
            ).toStrictEqual([]);
        });
        test('should pass the result from one chain call to the next', async () => {
            actionQueue_cache_true.enqueue(new testAction_chain1());
            actionQueue_cache_true.enqueue(new testAction_chain2());
            actionQueue_cache_true.enqueue(new testAction_chain3());
            expect(
                (await actionQueue_cache_true.startProcess()).fromArray(),
            ).toStrictEqual([
                ['testAction_chain1', 1],
                ['testAction_chain2', 2],
                ['testAction_chain3', 3],
            ]);
        });
    });
    describe('error handler tests', () => {
        test('should throw the error synchronously and invoke the error handler', async () => {
            const error = new Error('sync error');
            const mockAction = {
                execute: jest.fn().mockImplementation(() => {
                    throw error; // 同步抛出错误
                }),
                type: 'testAction',
            };
            const actionQueue_T = new ActionQueue({
                cacheSteps: true,
                errorHandler: jest.fn(),
            });
            actionQueue_T.enqueue(mockAction as unknown as BaseAction);
            const startProcessSpy = jest.spyOn(actionQueue_T, 'startProcess');
            await actionQueue_T.startProcess();
            expect(actionQueue_T.startProcess).toHaveBeenCalled();
            expect(actionQueue_T.errorHandler).toHaveBeenCalledWith(
                error,
                mockAction,
            );
        });
        test('should throw the error asynchronously and invoke the error handler', async () => {
            const error = new Error('async error');
            const mockAction = {
                //@ts-ignore
                execute: jest.fn().mockRejectedValue(error),
                type: 'testAction',
            };
            const actionQueue_T = new ActionQueue({
                cacheSteps: true,
                errorHandler: jest.fn(),
            });
            actionQueue_T.enqueue(mockAction as unknown as BaseAction);
            const startProcessSpy = jest.spyOn(actionQueue_T, 'startProcess');
            await actionQueue_T.startProcess();
            expect(actionQueue_T.startProcess).toHaveBeenCalled();
            expect(actionQueue_T.errorHandler).toHaveBeenCalledWith(
                error,
                mockAction,
            );
        });
        test('should rethrow the error when no errorHandler is provider', async () => {
            const error = new Error('no error handler');
            const mockAction = {
                execute: jest.fn().mockImplementation(() => {
                    throw error;
                }),
                type: 'testAction',
            };
            actionQueue_cache_true.enqueue(mockAction as unknown as BaseAction);
            const startProcessSpy = jest.spyOn(
                actionQueue_cache_true,
                'startProcess',
            );
            await expect(actionQueue_cache_true.startProcess()).rejects.toThrow(
                error,
            );
            expect(actionQueue_cache_true.startProcess).toHaveBeenCalled();
        });
    });
    describe('Boundary condition testing', () => {
        test('should return an empty action result from startProcess', async () => {
            const emptyResult =
                (await actionQueue_cache_true.startProcess()) as ActionResult;
            expect(emptyResult.isEmpty()).toBe(true);
        });
        //TODO Add thread-safe tests
        test('should execute actions and store results with null for undefined return values', async () => {
            const testAction = {
                execute: (): void => {},
                type: 'testAction',
            };
            actionQueue_cache_true.enqueue(testAction as unknown as BaseAction);
            const result =
                (await actionQueue_cache_true.startProcess()) as ActionResult;
            expect(result.getValue('testAction')).toStrictEqual([
                ['testAction', null],
            ]);
        });
        describe('Asynchronous scenario testing', () => {
            test('should refuse subsequent calls to startProcess while it is already running', async () => {
                const longRunTestAction = {
                    execute: () => {
                        return new Promise((resolve) =>
                            setTimeout(resolve, 1000).unref(),
                        );
                    },
                    type: 'longRunTestAction',
                };
                actionQueue_cache_true.enqueue(
                    longRunTestAction as unknown as BaseAction,
                );
                const firstCall = actionQueue_cache_true.startProcess();
                expect(actionQueue_cache_true.getProcessingStatus()).toBe(true);
                await expect(
                    actionQueue_cache_true.startProcess(),
                ).rejects.toThrow('Process is already running');
            });
            test('should reset the isProcess flag after completing the method', async () => {
                const testAction = {
                    execute: () => Promise.resolve('test'),
                    type: 'testAction',
                };
                actionQueue_cache_true.enqueue(
                    testAction as unknown as BaseAction,
                );
                await actionQueue_cache_true.startProcess();
                expect(actionQueue_cache_true.getProcessingStatus()).toBe(
                    false,
                );
            });
            test('should refuse the subsequent calls to clear while it is already running ', () => {
                const longRunTestAction = {
                    execute: () => {
                        return new Promise((resolve) =>
                            setTimeout(resolve, 2000).unref(),
                        );
                    },
                    type: 'longRunTestAction',
                };
                actionQueue_cache_true.enqueue(
                    longRunTestAction as unknown as BaseAction,
                );
                actionQueue_cache_true.startProcess();
                expect(() => actionQueue_cache_true.clear()).toThrow(
                    'Process is already running',
                );
            });
            test('should not alter queue state when enqueue is called during startProcess execution', async () => {
                const longRunTestAction = {
                    execute: () => {
                        return new Promise((resolve) =>
                            setTimeout(resolve, 1000).unref(),
                        );
                    },
                    type: 'longRunTestAction',
                };
                actionQueue_cache_true.enqueue(
                    longRunTestAction as unknown as BaseAction,
                );
                actionQueue_cache_true.startProcess();
                expect(actionQueue_cache_true.getProcessingStatus()).toBe(true);
                actionQueue_cache_true.enqueue(new testAction_async1());
                expect(actionQueue_cache_true.length()).toBe(0);
            });
        });
    });
    describe('should correctly manage memory and state', () => {
        test('should be cleared when startProcess method finish successfully', async () => {
            actionQueue_cache_true.enqueue(new testAction_async1());
            actionQueue_cache_true.enqueue(new testAction_sync1());
            actionQueue_cache_true.enqueue(new testAction_async2());
            actionQueue_cache_true.enqueue(new testAction_sync2());
            await actionQueue_cache_true.startProcess();
            expect(actionQueue_cache_true.isEmpty()).toBe(true);
        });
        test('should maintain correct queue state after interruption', async () => {
            const error = new Error('interruption error');
            const mockAction = {
                execute: jest.fn().mockImplementation(() => {
                    throw error;
                }),
                type: 'testAction',
            };
            actionQueue_cache_true.enqueue(new testAction_async1());
            actionQueue_cache_true.enqueue(mockAction as unknown as BaseAction);
            actionQueue_cache_true.enqueue(new testAction_sync1());
            actionQueue_cache_true.enqueue(new testAction_async2());
            actionQueue_cache_true.enqueue(new testAction_sync2());

            await expect(actionQueue_cache_true.startProcess()).rejects.toThrow(
                error,
            );
            expect(actionQueue_cache_true.length()).toBe(3);
        });

        test('should not produce side effect when the same action instance is enqueued multiple time', async () => {
            class testAction_sameInstance extends BaseAction {
                type: string = 'testAction';
                params: object = {};
                count: number = 0;

                constructor(params: object = {}) {
                    super();
                    this.params = params;
                }

                execute() {
                    this.count++;
                    return this.count;
                }
            }

            const action = new testAction_sameInstance();
            actionQueue_cache_true.enqueue(action);
            actionQueue_cache_true.enqueue(action);
            actionQueue_cache_true.enqueue(action);
            const result =
                (await actionQueue_cache_true.startProcess()) as ActionResult;
            expect(result.fromArray()).toStrictEqual([
                ['testAction', 1],
                ['testAction', 2],
                ['testAction', 3],
            ]);
        });
    });
});
