export function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function discountPercent(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}
