// frontend/lib/api/client.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(
    message: string,
    status: number,
    code?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function parseError(response: Response): Promise<ApiError> {
  let message = `Request failed with status ${response.status}`;
  let code: string | undefined;

  try {
    const data = await response.json();

    if (data?.error?.message) {
      message = data.error.message;
    }

    if (data?.error?.code) {
      code = data.error.code;
    }
  } catch {
    // Backend returned non-JSON error.
  }

  if (response.status === 404) {
    message =
      message === `Request failed with status 404`
        ? "The requested resource was not found."
        : message;
  }

  if (response.status === 415) {
    message =
      message === `Request failed with status 415`
        ? "This file type is not supported."
        : message;
  }

  if (response.status === 503) {
    message =
      message === `Request failed with status 503`
        ? "The backend service is currently unavailable."
        : message;
  }

  return new ApiError(message, response.status, code);
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body instanceof FormData
          ? {}
          : {
              "Content-Type": "application/json",
            }),
        ...(options.headers || {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      `Cannot connect to the backend at ${API_BASE_URL}. ` +
        `Make sure the backend is running and the URL is correct.`,
      0
    );
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function apiUpload<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      `Cannot connect to the backend at ${API_BASE_URL}. ` +
        `Make sure the backend is running and the URL is correct.`,
      0
    );
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  return response.json() as Promise<T>;
}