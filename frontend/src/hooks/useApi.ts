import { useState, useCallback } from 'react';

const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Normalize base: ensure it contains /api at the end and no trailing slash
let API_BASE_URL = rawBase.trim();
if (API_BASE_URL.endsWith('/')) API_BASE_URL = API_BASE_URL.slice(0, -1);
if (!API_BASE_URL.endsWith('/api')) API_BASE_URL = `${API_BASE_URL}/api`;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T,>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: Record<string, any>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'API error');
      }

      return data as T;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
};

export const useSystemInfo = () => {
  const { request, loading, error } = useApi();
  const [info, setInfo] = useState<any>(null);

  const fetchSystemInfo = useCallback(async () => {
    const data = await request('/system/info', 'GET');
    if (data) {
      setInfo(data);
    }
  }, [request]);

  return { fetchSystemInfo, info, loading, error };
};

export const useRegistration = () => {
  const { request, loading, error } = useApi();

  const validate = useCallback(async (name: string, rollNumber: string, studentClass: string) => {
    return request('/register/validate', 'POST', { name, roll_number: rollNumber, class: studentClass });
  }, [request]);

  const startCapture = useCallback(async (name: string, rollNumber: string, studentClass: string) => {
    return request('/register/start-capture', 'POST', { name, roll_number: rollNumber, class: studentClass });
  }, [request]);

  const generateEncodings = useCallback(async (name: string, rollNumber: string, studentClass: string) => {
    return request('/register/generate-encodings', 'POST', { name, roll_number: rollNumber, class: studentClass });
  }, [request]);

  return {
    validate,
    startCapture,
    generateEncodings,
    loading,
    error,
  };
};

export const useAttendance = () => {
  const { request, loading, error } = useApi();

  const start = useCallback(async () => {
    return request('/attendance/start', 'POST');
  }, [request]);

  return { start, loading, error };
};

export const useTraining = () => {
  const { request, loading, error } = useApi();

  const train = useCallback(async () => {
    return request('/train/encodings', 'POST');
  }, [request]);

  return { train, loading, error };
};

export const useStudents = () => {
  const { request, loading, error } = useApi();
  const [students, setStudents] = useState<any[]>([]);

  const fetch = useCallback(async () => {
    const data = await request('/students', 'GET');
    if (data) {
      setStudents(data.students || []);
    }
  }, [request]);

  return { fetch, students, loading, error };
};
