export class InvalidFileExtensionError extends Error {
    constructor(
        public readonly expected: string,
        public readonly received: string,
    ) {
        super(
            `Expected file extension: ${expected}, but received: ${received}`,
        );
        // 维持正确的原型链
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'InvalidFileExtensionError';
    }
}
