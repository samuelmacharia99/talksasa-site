export type SmsResellerTier = {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  rate: number;
  rangeLabel: string;
};

export const SMS_RESELLER_TIERS: SmsResellerTier[] = [
  {
    id: "pro-plus",
    name: "Pro+",
    minAmount: 60_001,
    maxAmount: 100_000,
    rate: 0.2,
    rangeLabel: "60,001 – 100,000 KSH",
  },
  {
    id: "pro",
    name: "Pro",
    minAmount: 20_001,
    maxAmount: 60_000,
    rate: 0.23,
    rangeLabel: "20,001 – 60,000 KSH",
  },
  {
    id: "starter",
    name: "Starter",
    minAmount: 500,
    maxAmount: 20_000,
    rate: 0.3,
    rangeLabel: "500 – 20,000 KSH",
  },
];

export function getTierForAmount(amount: number): SmsResellerTier | null {
  const byMin = [...SMS_RESELLER_TIERS].sort((a, b) => a.minAmount - b.minAmount);
  if (amount < byMin[0].minAmount) return null;
  for (const tier of byMin) {
    if (amount >= tier.minAmount && amount <= tier.maxAmount) return tier;
  }
  const top = byMin[byMin.length - 1];
  if (amount > top.maxAmount) return top;
  return null;
}
export function calculateResellerSms(amount: number): {
  tier: SmsResellerTier | null;
  smsCount: number;
  rate: number;
} {
  const tier = getTierForAmount(amount);
  if (!tier) return { tier: null, smsCount: 0, rate: 0 };
  return {
    tier,
    smsCount: Math.floor(amount / tier.rate),
    rate: tier.rate,
  };
}
