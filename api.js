const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function request(path, opts = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...(opts.headers || {})
    };

    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API}${path}`, {
        ...opts,
        headers,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'API error');

    return data;
}
