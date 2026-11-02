const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1';
export async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, { credentials: 'include', ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error?.message || 'The request could not be completed.');
  return body.data;
}
export const api = {
  list: () => request('/cases'),
  getCase: id => request(`/cases/${id}`),
  status: id => request(`/cases/${id}/status`),
  create: data => request('/cases', { method: 'POST', headers: { 'Idempotency-Key': crypto.randomUUID() }, body: JSON.stringify(data) }),
  accuse: (id, suspectId) => request(`/cases/${id}/accusations`, { method: 'POST', body: JSON.stringify({ suspectId }) }),
  result: id => request(`/cases/${id}/result`),
  retry: id => request(`/cases/${id}/retry`, { method: 'POST', body: '{}' })
};
