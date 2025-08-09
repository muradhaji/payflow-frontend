export interface MonthlyData {
  label: string;
  amount: number;
  index: number;
}

export interface YearlyData {
  year: number;
  months: MonthlyData[];
}
