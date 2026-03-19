import { ErrorDTO } from '../types';

export class ApiError extends Error {
    public readonly error: string;
    public readonly field?: string;

    constructor(data: ErrorDTO) {
        super(data.message);

        this.name = 'ApiError';
        this.error = data.error;
        this.field = data.field;

        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
