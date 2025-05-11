import { beforeEach, describe, expect, test } from '@jest/globals';
import { ActionResult } from '../../src/action-builder/ActionResult';

let testResult: ActionResult;
beforeEach(() => {
    testResult = new ActionResult();
});
describe('action result test', () => {
    describe('initial state verification testing', () => {
        test('should return an array of empty values', () => {
            const result = testResult.fromArray();
            expect(result).toEqual([]);
        });
        test('should return the empty flag as true', () => {
            expect(testResult.isEmpty()).toBeTruthy();
        });
    });
    describe('data store logic testing ', () => {
        test('should update resultArray, getValue, and isEmpty correctly after a single call', () => {
            testResult.setResult('test', 'test');
            expect(testResult.fromArray().length).toBe(1);
            expect(testResult.fromArray()).toEqual([['test', 'test']]);
            expect(testResult.isEmpty()).toBeFalsy();
        });
        test('should store results in insertion order and allow duplicates of the same type when setResult is called multiple time', () => {
            testResult.setResult('test', 'test');
            testResult.setResult('test', 'test');
            const testArray: Array<[string, any]> = testResult.fromArray();
            expect(testArray.length).toBe(2);
            expect(testArray[0]).toStrictEqual(testArray[1]);
            expect(testResult.fromArray()).toEqual([
                ['test', 'test'],
                ['test', 'test'],
            ]);
            expect(testResult.isEmpty()).toBeFalsy();
            expect(testResult.getValue('test')).toEqual([
                ['test', 'test'],
                ['test', 'test'],
            ]);
        });
        describe('result retrieval logic testing', () => {
            test('should return an array of empty values when retrieving data of the specified type', () => {
                expect(testResult.getValue('test')).toEqual([]);
                expect(testResult.getValue('test2')).toEqual([]);
                expect(testResult.getValue('te')).toEqual([]);
            });
            test('should return all matching items when multiple entries of the same type exist', () => {
                testResult.setResult('test', 'test');
                testResult.setResult('test', 'test1');
                testResult.setResult('test', 'test2');
                testResult.setResult('test', 'test3');
                testResult.setResult('test1', 'test');
                testResult.setResult('test1', 'test1');
                testResult.setResult('test1', 'test2');
                testResult.setResult('test1', 'test3');
                testResult.setResult('test2', 'test');
                testResult.setResult('test2', 'test1');
                testResult.setResult('test2', 'test2');
                testResult.setResult('test2', 'test3');
                expect(testResult.getValue('test')).toEqual([
                    ['test', 'test'],
                    ['test', 'test1'],
                    ['test', 'test2'],
                    ['test', 'test3'],
                ]);
                expect(testResult.getValue('test1')).toEqual([
                    ['test1', 'test'],
                    ['test1', 'test1'],
                    ['test1', 'test2'],
                    ['test1', 'test3'],
                ]);
                expect(testResult.getValue('test2')).toEqual([
                    ['test2', 'test'],
                    ['test2', 'test1'],
                    ['test2', 'test2'],
                    ['test2', 'test3'],
                ]);
            });
        });
    });
    describe('Boundary condition testing', () => {
        test('should handle null or undefined values correctly when passed to setResult', () => {
            testResult.setResult('test', null);
            expect(testResult.getValue('test')).toEqual([['test', null]]);
            testResult.setResult('test1', undefined);
            expect(testResult.getValue('test1')).toEqual([
                ['test1', undefined],
            ]);
        });
        test('should handle empty string as a invalid type name when passed to setResult', () => {
            expect(() => testResult.setResult('', 'test')).toThrow(
                'Type cannot be empty',
            );
        });
        test('should handle data type compatibility correctly when passed to setResult', () => {
            testResult.setResult('test', 1);
            testResult.setResult('test', 'test');
            testResult.setResult('test', true);
            testResult.setResult('test', [1, 2, 3]);
            testResult.setResult('test', { test: 'test' });
            testResult.setResult('test', new Error('test'));
            testResult.setResult('test', () => {});
            testResult.setResult('test', /test/);
            testResult.setResult('test', Symbol('test'));
            testResult.setResult('test', NaN);
            testResult.setResult('test', Infinity);
            const result = testResult.getValue('test');

            expect(result[0][1]).toBe(1);
            expect(result[1][1]).toBe('test');
            expect(result[2][1]).toBe(true);
            expect(result[3][1]).toEqual([1, 2, 3]);
            expect(result[4][1]).toEqual({ test: 'test' });
            expect(result[5][1]).toBeInstanceOf(Error);
            expect(typeof result[6][1]).toBe('function');
            expect(result[7][1] instanceof RegExp).toBe(true);
            expect(Object.prototype.toString.call(result[8][1])).toBe(
                '[object Symbol]',
            );
            expect(Number.isNaN(result[9][1])).toBe(true);
            expect(result[10][1]).toBe(Infinity);
        });
    });
    describe('State conformance testing', () => {
        test('should not modify internal state when the returned array is modified', () => {
            testResult.setResult('test', 'test');
            testResult.setResult('test1', 'test1');
            testResult.setResult('test', 'test2');
            const testArray: Array<[string, any]> = testResult.fromArray();
            testArray[0][1] = 'test3';
            expect(testResult.fromArray()).toEqual([
                ['test', 'test'],
                ['test1', 'test1'],
                ['test', 'test2'],
            ]);
            expect(testArray).toEqual([
                ['test', 'test3'],
                ['test1', 'test1'],
                ['test', 'test2'],
            ]);
        });
        test('should accurately increment resultArray length with each setResult call', () => {
            testResult.setResult('test', 'test');
            expect(testResult.fromArray().length).toBe(1);
            testResult.setResult('test1', 'test1');
            expect(testResult.fromArray().length).toBe(2);
            testResult.setResult('test', 'test2');
            expect(testResult.fromArray().length).toBe(3);
            testResult.setResult('test1', 'test2');
            expect(testResult.fromArray().length).toBe(4);
        });
    });
});
