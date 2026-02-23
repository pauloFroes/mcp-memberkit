import { API_KEY, BASE_URL } from "./auth.js";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
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

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: Record<string, unknown>,
  queryParams?: Record<string, string | undefined>,
): Promise<T> {
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

  if (response.status === 204) return {} as T;

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      `API error (${response.status}): ${(error as Record<string, string>).message || response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

export async function apiRequestPaginated<T>(
  endpoint: string,
  queryParams?: Record<string, string | undefined>,
): Promise<PaginatedResponse<T>> {
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
    throw new ApiError(
      response.status,
      `API error (${response.status}): ${(error as Record<string, string>).message || response.statusText}`,
    );
  }

  const data = (await response.json()) as T;
  const pagination: PaginationHeaders = {
    currentPage: response.headers.get("Current-Page") ?? undefined,
    pageLimit: response.headers.get("Page-Limit") ?? undefined,
    totalPages: response.headers.get("Total-Pages") ?? undefined,
    totalCount: response.headers.get("Total-Count") ?? undefined,
  };

  return { data, pagination };
}

export function toolResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function toolError(message: string) {
  return {
    isError: true,
    content: [{ type: "text" as const, text: message }],
  };
}
