const API_BASE = process.env.REACT_APP_API_URL || '';

export function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(fullUrl, { ...options, headers }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || '请求失败');
    }
    return data;
  });
}
