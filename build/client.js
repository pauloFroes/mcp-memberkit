import { API_KEY, BASE_URL } from "./auth.js";
export class ApiError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
}
export async function apiRequest(endpoint, method = "GET", body, queryParams) {
    const params = new URLSearchParams();
    params.set("api_key", API_KEY);
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined && value !== "") {
                params.set(key, value);
            }
        }
    }
    const url = `${BASE_URL}${endpoint}?${params.toString()}`;
    const response = await fetch(url, {
        method,
        headers: {
            ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (response.status === 204)
        return {};
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(response.status, `API error (${response.status}): ${error.message || response.statusText}`);
    }
    return (await response.json());
}
export async function apiRequestPaginated(endpoint, queryParams) {
    const params = new URLSearchParams();
    params.set("api_key", API_KEY);
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined && value !== "") {
                params.set(key, value);
            }
        }
    }
    const url = `${BASE_URL}${endpoint}?${params.toString()}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {},
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(response.status, `API error (${response.status}): ${error.message || response.statusText}`);
    }
    const data = (await response.json());
    const pagination = {
        currentPage: response.headers.get("Current-Page") ?? undefined,
        pageLimit: response.headers.get("Page-Limit") ?? undefined,
        totalPages: response.headers.get("Total-Pages") ?? undefined,
        totalCount: response.headers.get("Total-Count") ?? undefined,
    };
    return { data, pagination };
}
export function toolResult(data) {
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
}
export function toolError(message) {
    return {
        isError: true,
        content: [{ type: "text", text: message }],
    };
}
