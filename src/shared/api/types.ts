export type ApiSuccess<T> = {
    ok: true;
    data: T;
    status: number;
};

export type ApiError = {
    ok: false;
    error: string;
    status: number;
};

export type ApiResponse<T = void> = ApiSuccess<T> | ApiError;

export type ErrorDTO = {
    error: string;
    message: string;
};
