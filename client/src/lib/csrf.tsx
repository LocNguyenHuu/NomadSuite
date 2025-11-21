import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CsrfContextType {
  csrfToken: string | null;
  refreshToken: () => Promise<void>;
}

const CsrfContext = createContext<CsrfContextType | undefined>(undefined);

export function CsrfProvider({ children }: { children: ReactNode }) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const fetchToken = async () => {
    try {
      const response = await fetch('/api/csrf-token', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  return (
    <CsrfContext.Provider value={{ csrfToken, refreshToken: fetchToken }}>
      {children}
    </CsrfContext.Provider>
  );
}

export function useCsrf() {
  const context = useContext(CsrfContext);
  if (context === undefined) {
    throw new Error('useCsrf must be used within a CsrfProvider');
  }
  return context;
}

export async function fetchWithCsrf(
  url: string,
  options: RequestInit = {},
  csrfToken: string | null
): Promise<Response> {
  const method = options.method?.toUpperCase() || 'GET';
  const needsCsrf = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method);

  const headers = new Headers(options.headers);
  
  if (needsCsrf && csrfToken) {
    headers.set('csrf-token', csrfToken);
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}
