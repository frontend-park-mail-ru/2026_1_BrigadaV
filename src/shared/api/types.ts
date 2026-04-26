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


export type TripSummaryDTO = {
    id: number;
    title: string;
    location: string;
    start_date?: Date;
    end_date?: Date;
    preview: string;
};

export type ErrorDTO = {
    error: string;
    field?: string;
    message: string;
};
