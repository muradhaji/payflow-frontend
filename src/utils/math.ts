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

export function calculatePercentageDecimal(
  part: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 10000) / 100;
}

export function getMostFrequentAmount(numbers: number[]): number | null {
  if (!numbers.length) return null;

  const frequencyMap = new Map<number, number>();

  for (const num of numbers) {
    frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
  }

  let mostFrequent = numbers[0];
  let maxCount = 0;

  for (const [num, count] of frequencyMap) {
    if (count > maxCount) {
      mostFrequent = num;
      maxCount = count;
    }
  }

  return mostFrequent;
}
