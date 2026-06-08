export function formatMetric(num: number | undefined | null): string {
  if (num === undefined || num === null) {
    return '0';
  }
  
  const n = Number(num);
  if (isNaN(n)) {
    return '0';
  }

  if (n >= 1000000000) {
    return Math.round(n / 1000000000) + 'B';
  }
  if (n >= 1000000) {
    return Math.round(n / 1000000) + 'M';
  }
  if (n >= 1000) {
    return Math.round(n / 1000) + 'K';
  }
  return n.toString();
}

let cachedMetricsPromise: Promise<any> | null = null;

export function getMetrics(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  const stored = sessionStorage.getItem('agentsecrets_metrics');
  if (stored) {
    try {
      return Promise.resolve(JSON.parse(stored));
    } catch (e) {
      // ignore and refetch
    }
  }

  if (cachedMetricsPromise) {
    return cachedMetricsPromise;
  }

  cachedMetricsPromise = fetch(`/api/metrics?t=${Date.now()}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch metrics');
      return res.json();
    })
    .then(json => {
      if (json && json.status === 'success') {
        sessionStorage.setItem('agentsecrets_metrics', JSON.stringify(json));
      }
      return json;
    })
    .catch(err => {
      cachedMetricsPromise = null;
      throw err;
    });

  return cachedMetricsPromise;
}
