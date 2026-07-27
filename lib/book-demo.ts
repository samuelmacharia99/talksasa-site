export const DEMO_PRODUCTS = [
  "Bulk SMS",
  "Business Email",
  "Application Hosting",
  "Reseller Hosting",
  "Domains",
  "VPS & Dedicated Servers",
  "SMS Reseller",
  "M-Pesa Payments",
  "Multiple products",
] as const;

export const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
] as const;

export type MonthOption = {
  value: string;
  label: string;
  year: number;
  month: number;
};

export function getMonthOptions(count = 12): MonthOption[] {
  const options: MonthOption[] = [];
  const start = new Date();
  start.setDate(1);

  for (let i = 0; i < count; i++) {
    const date = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const label = date.toLocaleDateString("en-KE", { month: "long", year: "numeric" });
    options.push({
      value: `${year}-${String(month + 1).padStart(2, "0")}`,
      label,
      year,
      month,
    });
  }

  return options;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getAvailableDays(year: number, month: number): number[] {
  const total = getDaysInMonth(year, month);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const startDay = isCurrentMonth ? today.getDate() : 1;

  return Array.from({ length: total - startDay + 1 }, (_, i) => startDay + i);
}

export function formatDemoDate(year: number, month: number, day: number): string {
  const date = new Date(year, month, day);
  return date.toLocaleDateString("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
