const MARA_BASE = import.meta.env.VITE_MARA_BASE_URL || 'http://localhost:8001';

export interface MaraExtractSuggestion {
  field: string;
  label: string;
  value: any;
  options?: string[];
}

export interface MaraExtractResponse {
  suggestions: MaraExtractSuggestion[];
}

export interface MaraChatResponse {
  llm_reply: string;
  mara_results: any[];
  baseline_results?: any[];
  hydration: {
    provider: string;
    preferred_key: string;
    ordered_article_ids: number[];
    ranked_targets: any[];
  };
  frontend?: any;
}

async function maraFetch<T>(endpoint: string, body: Record<string, any>): Promise<T> {
  const url = `${MARA_BASE}${endpoint}`;
  console.log(`[MARA] → ${endpoint}`, JSON.stringify(body));

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[MARA] ✗ ${endpoint} ${res.status}`, text);
    throw new Error(`MARA ${endpoint} failed: ${res.status} — ${text}`);
  }

  const data = await res.json();
  console.log(`[MARA] ← ${endpoint}`, JSON.stringify(data).slice(0, 2000));
  return data as T;
}

export function extractConstraints(userId: string, message: string) {
  return maraFetch<MaraExtractResponse>('/extract', { user_id: userId, message });
}

export function saveConstraints(userId: string, constraints: Record<string, any>) {
  return maraFetch<any>('/constraints', { user_id: userId, ...constraints });
}

export function chatWithMara(userId: string, message: string) {
  return maraFetch<MaraChatResponse>('/chat', { user_id: userId, message });
}

export function browseMara(
  userId: string,
  productId: string,
  name: string,
  description: string,
) {
  return maraFetch<{ status: string }>('/browse', {
    user_id: userId,
    product_id: productId,
    name,
    description,
  });
}
