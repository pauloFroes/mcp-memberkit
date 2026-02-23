export declare class ApiError extends Error {
    status: number;
    constructor(status: number, message: string);
}
export interface PaginationHeaders {
    currentPage?: string;
    pageLimit?: string;
    totalPages?: string;
    totalCount?: string;
}
export interface PaginatedResponse<T> {
    data: T;
    pagination: PaginationHeaders;
}
export declare function apiRequest<T>(endpoint: string, method?: "GET" | "POST" | "PUT" | "DELETE", body?: Record<string, unknown>, queryParams?: Record<string, string | undefined>): Promise<T>;
export declare function apiRequestPaginated<T>(endpoint: string, queryParams?: Record<string, string | undefined>): Promise<PaginatedResponse<T>>;
export declare function toolResult(data: unknown): {
    content: {
        type: "text";
        text: string;
    }[];
};
export declare function toolError(message: string): {
    isError: boolean;
    content: {
        type: "text";
        text: string;
    }[];
};
