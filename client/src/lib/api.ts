let csrfToken: string | null = null;

export function setCsrfToken(token: string | null) {
  csrfToken = token;
}

export function getCsrfToken() {
  return csrfToken;
}

export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const method = options.method?.toUpperCase() || 'GET';
  const needsCsrf = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method);

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (needsCsrf && csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Request failed with status ${response.status}`);
  }

  // Handle empty responses (e.g., 204 No Content)
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return null as T;
  }

  return response.json();
}

export async function apiRequestFormData<T = any>(
  url: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  
  if (csrfToken) {
    headers.set('X-CSRF-Token', csrfToken);
  }

  const response = await fetch(url, {
    ...options,
    method: options.method || 'POST',
    headers,
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Request failed with status ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return null as T;
  }

  return response.json();
}
