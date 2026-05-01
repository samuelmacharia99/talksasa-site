"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Currency = "KES" | "TZS" | "UGX" | "RWF" | "USD" | "EUR" | "NGN";

export interface CurrencyInfo {
  code: Currency;
  name: string;
  symbol: string;
  flag: string;
  rate: number; // Exchange rate relative to KES (KES = 1)
}

// Exchange rates relative to KES (approximate rates - update as needed)
// Base: 1 KES = 1
const CURRENCY_RATES: Record<Currency, CurrencyInfo> = {
  KES: {
    code: "KES",
    name: "Kenyan Shilling",
    symbol: "KES",
    flag: "🇰🇪",
    rate: 1,
  },
  TZS: {
    code: "TZS",
    name: "Tanzanian Shilling",
    symbol: "TZS",
    flag: "🇹🇿",
    rate: 16, // 1 KES = 16 TZS
  },
  UGX: {
    code: "UGX",
    name: "Ugandan Shilling",
    symbol: "UGX",
    flag: "🇺🇬",
    rate: 37, // 1 KES = 37 UGX
  },
  RWF: {
    code: "RWF",
    name: "Rwandan Franc",
    symbol: "RWF",
    flag: "🇷🇼",
    rate: 8.3, // 1 KES = 8.3 RWF
  },
  USD: {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    flag: "🇺🇸",
    rate: 0.0074, // 1 KES = 0.0074 USD (approx 135 KES = 1 USD)
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    rate: 0.0068, // 1 KES = 0.0068 EUR (approx 147 KES = 1 EUR)
  },
  NGN: {
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
    flag: "🇳🇬",
    rate: 10, // 1 KES = 10 NGN
  },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (kesPrice: number) => number;
  formatPrice: (kesPrice: number, decimals?: number) => string;
  currencyInfo: CurrencyInfo;
  allCurrencies: CurrencyInfo[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("KES");

  // Load currency from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("talksasa-currency") as Currency | null;
      if (saved && saved in CURRENCY_RATES) {
        setCurrencyState(saved);
      }
    }
  }, []);

  // Save currency to localStorage when it changes
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    if (typeof window !== "undefined") {
      localStorage.setItem("talksasa-currency", newCurrency);
    }
  };

  const currencyInfo = CURRENCY_RATES[currency];
  const allCurrencies = Object.values(CURRENCY_RATES);

  // Convert KES price to selected currency
  const convertPrice = (kesPrice: number): number => {
    return kesPrice * currencyInfo.rate;
  };

  // Format price with currency symbol
  const formatPrice = (kesPrice: number, decimals: number = 0): string => {
    const convertedPrice = convertPrice(kesPrice);
    
    // For USD, EUR, and NGN, show 2 decimals. For others, show 0 decimals
    const finalDecimals = currency === "USD" || currency === "EUR" ? 2 : decimals;
    
    // Format number with locale-specific formatting
    const formatted = convertedPrice.toLocaleString(undefined, {
      minimumFractionDigits: finalDecimals,
      maximumFractionDigits: finalDecimals,
    });

    // Add currency symbol/flag
    if (currency === "USD") {
      return `$${formatted}`;
    } else if (currency === "EUR") {
      return `€${formatted}`;
    } else if (currency === "NGN") {
      return `₦${formatted}`;
    } else {
      // For East African currencies, show flag + code + amount
      return `${currencyInfo.flag} ${formatted} ${currencyInfo.code}`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertPrice,
        formatPrice,
        currencyInfo,
        allCurrencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
