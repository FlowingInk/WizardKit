import {
    afterEach,
    beforeEach,
    describe,
    expect,
    test,
} from '@jest/globals';
import { ActionBuilder } from '../../src/action-builder/ActionBuilder';
import { ActionRegister } from '../../src/action-builder/ActionRegister';
import { BaseAction } from '../../src/action-builder/actions/baseAction';
import { ActionFlow } from '../../src/action-builder/ActionFlow';

type actionConstructor = new (...args: any[]) => BaseAction;
let testBuilder_cache_true: ActionBuilder;

class testAction extends BaseAction {
    public type: string = 'testAction';
    public params: {};

    constructor(params: {} = {}) {
        super();
        this.params = params;
    }

    public async execute() {
        return 'test';
    }
}

class testAction_chain1 extends BaseAction {
    type: string = 'testAction_chain1';
    params: {
        inputNumber: Number;
    };

    constructor(params: { inputNumber: Number }) {
        super();
        this.params = params;
    }

    execute(...args: any[]) {
        return this.params['inputNumber'];
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

beforeEach(() => {
    testBuilder_cache_true = new ActionBuilder({ cacheSteps: true });
});
afterEach(() => {
    ActionRegister.clear();
});
describe('action builder testing', () => {
    describe('basic function testing', () => {
        test('should automatically call initAction upon instantiation', () => {
            expect(ActionRegister.getTypes().length > 0).toBeTruthy();
        });
        test('should ensure actionRegisterIndex and ActionRegister states are consistent upon initialization', () => {
            const registry = testBuilder_cache_true.getActionRegisterIndex();
            const arrayFormat: Array<[string, actionConstructor]> =
                Object.entries(registry) as Array<[string, actionConstructor]>;
            expect(arrayFormat).toStrictEqual(ActionRegister.getTypes());
        });
        test('should synchronous update into actionRegisterIndex object when registerAction is called', () => {
            testBuilder_cache_true.registerAction('testAction', testAction);
            expect(
                testBuilder_cache_true.getActionRegisterIndex(),
            ).toHaveProperty('testAction');
        });
        test('should throw an error when attempting to register the same action twice', () => {
            testBuilder_cache_true.registerAction('testAction', testAction);
            expect(() => {
                testBuilder_cache_true.registerAction('testAction', testAction);
            }).toThrow('testAction is already registered');
        });
        test('should create an ActionFlow instance when startWith is called', () => {
            testBuilder_cache_true.registerAction('testAction', testAction);
            expect(
                testBuilder_cache_true.startWith('testAction'),
            ).toBeInstanceOf(ActionFlow);
        });
        test('should update action in actionRegisterIndex when updateAction is called', async () => {
            class testAction2 extends BaseAction {
                public type: string = 'testAction';
                public params: {};

                constructor(params: {} = {}) {
                    super();
                    this.params = params;
                }

                public async execute() {
                    return 'test2';
                }
            }

            testBuilder_cache_true.registerAction('testAction', testAction);
            testBuilder_cache_true.updateAction('testAction', testAction2);
            const result = (
                await testBuilder_cache_true
                    .startWith('testAction')
                    .executeAll()
            ).getValue('testAction')[0][1];
            expect(result).toBe('test2');
        });
        test('should pass the result from one chain call to the next', async () => {
            testBuilder_cache_true.registerAction(
                'testAction_chain1',
                testAction_chain1,
            );
            testBuilder_cache_true.registerAction(
                'testAction_chain2',
                testAction_chain2,
            );
            testBuilder_cache_true.registerAction(
                'testAction_chain3',
                testAction_chain3,
            );
            const result = await testBuilder_cache_true
                .startWith('testAction_chain1', { inputNumber: 5 })
                .next('testAction_chain2')
                .next('testAction_chain3')
                .executeAll();
            expect(result.fromArray()).toStrictEqual([
                ['testAction_chain1', 5],
                ['testAction_chain2', 6],
                ['testAction_chain3', 7],
            ]);
        });
    });
    describe('Exception and Boundary Testing', () => {
        test('should propagate errors thrown by ActionRegister during registration in ActionBuilder', () => {
            testBuilder_cache_true.registerAction('testAction', testAction);
            expect(() => {
                testBuilder_cache_true.registerAction('testAction', testAction);
            }).toThrow('testAction is already registered');
        });
        test('should correctly handle special characters in type, such as `@delete`', () => {
            testBuilder_cache_true.registerAction('@delete', testAction);
            testBuilder_cache_true.registerAction('@create#user', testAction);
            testBuilder_cache_true.registerAction(
                '<script>alert(1)</script>',
                testAction,
            );
            testBuilder_cache_true.registerAction('delete|drop', testAction);
            expect(
                testBuilder_cache_true.getActionRegisterIndex(),
            ).toHaveProperty('@delete');
            expect(
                testBuilder_cache_true.getActionRegisterIndex(),
            ).toHaveProperty('@create#user');
            expect(
                testBuilder_cache_true.getActionRegisterIndex(),
            ).toHaveProperty('<script>alert(1)</script>');
            expect(
                testBuilder_cache_true.getActionRegisterIndex(),
            ).toHaveProperty('delete|drop');
        });
        test('should throw an error when startWith is called without any register actions', () => {
            ActionRegister.clear();
            expect(() => {
                testBuilder_cache_true.startWith('testAction');
            }).toThrow('testAction is not register');
        });
    });
    describe('State Consistency Testing', () => {
        test('', () => {
            testBuilder_cache_true.registerAction('testAction', testAction);
            const registry = testBuilder_cache_true.getActionRegisterIndex();
            const arrayFormat: Array<[string, actionConstructor]> =
                Object.entries(registry) as Array<[string, actionConstructor]>;
            expect(arrayFormat).toStrictEqual(ActionRegister.getTypes());
            testBuilder_cache_true.unRegisterAction('testAction');
            const registry1 = testBuilder_cache_true.getActionRegisterIndex();
            const arrayFormat2: Array<[string, actionConstructor]> =
                Object.entries(registry1) as Array<[string, actionConstructor]>;
            expect(arrayFormat2).toStrictEqual(ActionRegister.getTypes());
        });
    });
});
