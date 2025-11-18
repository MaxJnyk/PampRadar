export const formatNumber = (n: number | undefined): string => {
  if (n === undefined || n === null || isNaN(n) || !isFinite(n)) return '-';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  if (n >= 1) return n.toFixed(2);
  if (n >= 0.01) return n.toFixed(4);
  if (n > 0) return n.toFixed(6);
  return '0.00';
};

export const formatPrice = (p: number | undefined): string => {
  if (p === undefined || p === null || isNaN(p) || !isFinite(p)) return '-';
  if (p >= 1) return `$${p.toFixed(4)}`;
  if (p >= 0.0001) return `$${p.toFixed(6)}`;
  if (p >= 0.00000001) return `$${p.toFixed(8)}`;
  return `$${p.toFixed(10)}`;
};

export const getProgressColor = (percentage: number): string => {
  if (percentage >= 100) return '#42BABE'; // Success green
  if (percentage >= 75) return '#8B6AF3'; // Purple
  if (percentage >= 50) return '#FFA13E'; // Orange
  if (percentage >= 25) return '#FF7D8A'; // Red
  return '#6B7E7E'; // Grey
};
