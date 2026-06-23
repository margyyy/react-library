const BASE_URL = '';

async function request(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${url}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
}

export function get(url, params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return request(`${url}${query ? `?${query}` : ''}`);
}

export function post(url, data) {
  return request(url, { method: 'POST', body: JSON.stringify(data) });
}

export function put(url, data) {
  return request(url, { method: 'PUT', body: JSON.stringify(data) });
}

export function del(url) {
  return request(url, { method: 'DELETE' });
}
