export function sumDecimal(numbers: number[]): number {
  const totalCents = numbers.reduce(
    (total, num) => total + Math.round(num * 100),
    0
  );
  return totalCents / 100;
}

export function sumByKeyDecimal<T>(items: T[], key: keyof T): number {
  const totalCents = items.reduce((total, item) => {
    const value = item[key];
    if (typeof value === 'number') {
      return total + Math.round(value * 100);
    }
    return total;
  }, 0);
  return totalCents / 100;
}

export function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
