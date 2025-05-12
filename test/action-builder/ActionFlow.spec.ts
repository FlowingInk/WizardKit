import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { ActionFlow } from '../../src/action-builder/ActionFlow';
import { BaseAction } from '../../src/action-builder/actions/baseAction';
import { ActionRegister } from '../../src/action-builder/ActionRegister';
import { ActionQueue } from '../../src/action-builder/ActionQueue';
import { ActionResult } from '../../src/action-builder/ActionResult';

class testAction extends BaseAction {
    type: string = 'testAction';
    params: object = {};

    execute() {
        return 'a';
    }
}

ActionRegister.register('testAction', testAction);
let testFlow_cache_false: ActionFlow;
let testFlow_cache_true: ActionFlow;
beforeEach(() => {
    testFlow_cache_false = new ActionFlow(false);
    testFlow_cache_true = new ActionFlow(true);
});
describe('action flow testing', () => {
    describe('basic function testing', () => {
        test('should return this instance on each call for method chaining', () => {
            let iterator = testFlow_cache_true;
            const firstCalled = testFlow_cache_true.next('testAction');
            expect(firstCalled).toBe(testFlow_cache_true);

            const secondCalled = testFlow_cache_true.next('testAction');
            expect(secondCalled).toBe(testFlow_cache_true);

            const thirdCalled = testFlow_cache_true.next('testAction');
            expect(thirdCalled).toBe(testFlow_cache_true);
        });
        test('should return ActionResult instance when executeAll method is called', async () => {
            expect(await testFlow_cache_true.executeAll()).toBeInstanceOf(
                ActionResult,
            );
        });
        test('should return an empty ActionResult instance when executeAll is called on an empty ActionQueue', async () => {
            const testResult = await testFlow_cache_true.executeAll();
            expect(testResult.fromArray()).toStrictEqual([]);
        });
        test('should trigger execution of all actions after multiple next() calls when executeAll() is invoked', async () => {
            const result = await testFlow_cache_true
                .next('testAction')
                .next('testAction')
                .next('testAction')
                .executeAll();
            expect(result.fromArray()).toStrictEqual([
                ['testAction', 'a'],
                ['testAction', 'a'],
                ['testAction', 'a'],
            ]);
        });
        test('should return a empty array when cache operation is set disabled', async () => {
            const result = await testFlow_cache_false
                .next('testAction')
                .next('testAction')
                .next('testAction')
                .executeAll();
            expect(result.fromArray()).toStrictEqual([]);
        });
    });
    describe('Parameter and type handle testing', () => {
        test('should generate a default empty object when next is called with `type` and no second argument', async () => {
            class testAction2 extends BaseAction {
                type: string = 'testAction2';
                params: object = {};

                constructor(params: object) {
                    super();
                    this.params = params;
                }

                execute() {
                    return this.params;
                }
            }

            ActionRegister.register('testAction2', testAction2);
            const result = await testFlow_cache_true
                .next('testAction2')
                .executeAll();
            expect(result.fromArray()).toStrictEqual([['testAction2', {}]]);
            const result1 = await testFlow_cache_true
                .next('testAction2', { flag: true })
                .executeAll();
            expect(result1.fromArray()).toStrictEqual([
                ['testAction2', { flag: true }],
            ]);
        });
    });
    describe('Boundary condition testing', () => {
        test('should return an empty result when executeAll is called without invoking next', () => {
            expect(testFlow_cache_true.executeAll()).resolves.toStrictEqual(
                new ActionResult(),
            );
        });
    });
});
