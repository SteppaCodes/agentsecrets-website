export function formatMetric(num: number | undefined | null): string {
  if (num === undefined || num === null) {
    return '0';
  }
  
  const n = Number(num);
  if (isNaN(n)) {
    return '0';
  }

  if (n >= 1000000000) {
    return (n / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return n.toString();
}
