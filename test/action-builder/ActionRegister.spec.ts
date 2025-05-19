import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { BaseAction } from '../../src/actions/baseAction';
import { ActionRegister } from '../../src/builder/ActionRegister';

class TestAction extends BaseAction {
    type: string = 'TestAction';
    params: object = {};

    execute() {
        return 'TestAction';
    }
}

function generateLongName(length: number, serialNumberChoice: number) {
    const charset1 =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charset2 =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

    let result: string = '';
    let charset: string = '';
    let charactersLength: number = 0;
    if (serialNumberChoice == 1) {
        charset = charset1;
        charactersLength = charset1.length;
    } else {
        charset = charset2;
        charactersLength = charset2.length;
    }
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

afterEach(() => {
    ActionRegister.clear();
});
describe('action register tests', () => {
    describe('Basic function tests', () => {
        test('should add the action to the action map when the register method is called', () => {
            ActionRegister.register('TestAction', TestAction);
            expect(ActionRegister.getActionClass('TestAction')).toBe(
                TestAction,
            );
        });
        test('should remove the action from the map', () => {
            ActionRegister.register('TestAction', TestAction);
            ActionRegister.unregister('TestAction');
            expect(() => ActionRegister.getActionClass('TestAction')).toThrow(
                'TestAction is not register',
            );
        });
        test('should return an array of types from the action map', () => {
            class TestAction1 extends BaseAction {
                type: string = 'TestAction1';
                params: object = {};

                execute() {
                    return 'TestAction1';
                }
            }

            class TestAction2 extends BaseAction {
                type: string = 'TestAction2';
                params: object = {};

                execute() {
                    return 'TestAction2';
                }
            }

            ActionRegister.register('TestAction', TestAction);
            ActionRegister.register('TestAction1', TestAction1);
            ActionRegister.register('TestAction2', TestAction2);
            expect(ActionRegister.getTypes()).toStrictEqual([
                ['TestAction', TestAction],
                ['TestAction1', TestAction1],
                ['TestAction2', TestAction2],
            ]);
        });
    });
    describe('Boundary condition testing', () => {
        test('should return Empty Array When No Action Classes Are Registered', () => {
            expect(ActionRegister.getTypes()).toStrictEqual([]);
        });
        test('should throw the error after calling the unregister method', () => {
            expect(() => ActionRegister.unregister('TestAction0')).toThrow(
                'TestAction0 is not register',
            );
            expect(() => ActionRegister.getActionClass('TestAction1')).toThrow(
                'TestAction1 is not register',
            );
        });
        test('should throw the error when type is empty or action class is null', () => {
            expect(() => {
                ActionRegister.register('', TestAction);
            }).toThrow('The incoming argument is empty');
            expect(() => {
                ActionRegister.register('TestAction', null);
            }).toThrow('The incoming argument is empty');
            expect(() => {
                ActionRegister.register();
            }).toThrow('The incoming argument is empty');
            expect(() => {
                ActionRegister.register('TestAction');
            }).toThrow('The incoming argument is empty');
            expect(() => {
                ActionRegister.register('', null);
            }).toThrow('The incoming argument is empty');
        });
        test('should throw the error when repeatedly enqueue the same the action', () => {
            ActionRegister.register('TestAction', TestAction);
            expect(() => {
                ActionRegister.register('TestAction', TestAction);
            }).toThrow('TestAction is already registered');
        });
        test('should execute class methods normally when use extra-long name', () => {
            const longlongname1 = generateLongName(1000, 1);
            const longlongname2 = generateLongName(1000, 2);
            ActionRegister.register(longlongname1, TestAction);
            expect(ActionRegister.getActionClass(longlongname1)).toBe(
                TestAction,
            );
            ActionRegister.register(longlongname2, TestAction);
            expect(ActionRegister.getActionClass(longlongname2)).toBe(
                TestAction,
            );
        });
    });
    describe('life cycle tests', () => {
        test('should successfully re-register the same workflow type after unregistering', () => {
            ActionRegister.register('TestAction', TestAction);
            ActionRegister.unregister('TestAction');
            ActionRegister.register('TestAction', TestAction);
            expect(ActionRegister.getActionClass('TestAction')).toBe(
                TestAction,
            );
        });
        test('should update instantiation behavior when re-registering a modified class', () => {
            class TestAction1 extends BaseAction {
                type: string = 'TestAction1';
                params: object = {};

                execute() {
                    return 'one';
                }
            }

            class ModifiedClass extends BaseAction {
                type: string = 'TestAction1';
                params: object = {};

                execute() {
                    return 'two';
                }
            }

            ActionRegister.register('TestAction1', TestAction1);
            expect(
                new (ActionRegister.getActionClass('TestAction1'))().execute(),
            ).toBe('one');
            ActionRegister.unregister('TestAction1');
            ActionRegister.register('TestAction1', ModifiedClass);
            expect(
                new (ActionRegister.getActionClass('TestAction1'))().execute(),
            ).toBe('two');
            ActionRegister.unregister('TestAction1');
        });
    });
});
