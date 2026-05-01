"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useCurrency } from "@/lib/currency-provider";

// Tiered pricing based on top-up amount (credit)
function getSMSInfo(topUpAmount: number): { 
  smsCount: number; 
  perSms: number; 
  tier: string; 
  tierName: string;
  topUpAmount: number;
} {
  if (topUpAmount <= 0) return { 
    smsCount: 0, 
    perSms: 0, 
    tier: "", 
    tierName: "",
    topUpAmount: 0
  };
  
  // TIER 1: Top up KES 1 - 10,000 → KES 0.35/SMS
  if (topUpAmount <= 10000) {
    const smsCount = Math.floor(topUpAmount / 0.35);
    return { 
      smsCount,
      perSms: 0.35, 
      tier: "TIER 1 (Top up KES 1 - 10,000)",
      tierName: "Small Businesses",
      topUpAmount
    };
  }
  
  // TIER 2: Top up KES 10,001 - 30,000 → KES 0.30/SMS
  if (topUpAmount <= 30000) {
    const smsCount = Math.floor(topUpAmount / 0.30);
    return { 
      smsCount,
      perSms: 0.30, 
      tier: "TIER 2 (Top up KES 10,001 - 30,000)",
      tierName: "Medium Businesses",
      topUpAmount
    };
  }
  
  // TIER 3: Top up KES 30,001+ → KES 0.25/SMS
  const smsCount = Math.floor(topUpAmount / 0.25);
  return { 
    smsCount,
    perSms: 0.25, 
    tier: "TIER 3 (Top up KES 30,001+)",
    tierName: "Large Organizations",
    topUpAmount
  };
}

export function SMSCalculator() {
  const { formatPrice } = useCurrency();
  const [topUpAmount, setTopUpAmount] = useState(5000);
  const [inputValue, setInputValue] = useState("5000");
  const result = getSMSInfo(topUpAmount);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    setInputValue(value);
    const numValue = Number(value);
    if (numValue >= 1) {
      setTopUpAmount(numValue);
    } else if (value === "") {
      setTopUpAmount(0);
    }
  };

  const handleBlur = () => {
    if (topUpAmount < 1) {
      setTopUpAmount(5000);
      setInputValue("5000");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl glass border border-border p-6 sm:p-8 max-w-md mx-auto"
    >
      <div className="flex items-center gap-2 text-primary mb-4">
        <MessageSquare className="h-5 w-5" />
        <h3 className="font-semibold text-foreground">SMS Cost Calculator</h3>
      </div>
      <label htmlFor="topup-amount" className="block text-sm text-muted-foreground mb-2">
        Top-up amount (KES)
      </label>
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">KES</span>
        <input
          id="topup-amount"
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Enter amount"
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>
      <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 text-center">
        <div className="text-sm text-muted-foreground mb-2">You can send approximately</div>
        <div className="text-3xl font-bold text-foreground mb-1">
          {result.smsCount.toLocaleString()} SMS
        </div>
        {result.tier && (
          <p className="text-xs text-muted-foreground mt-2 font-medium">{result.tier}</p>
        )}
        {result.tierName && (
          <p className="text-xs text-muted-foreground mt-0.5">{result.tierName}</p>
        )}
        <div className="mt-3 pt-3 border-t border-primary/20">
          <p className="text-xs text-muted-foreground">
            Rate: {formatPrice(result.perSms, 2)} per SMS
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatPrice(result.perSms * 1000, 2)} per 1,000 SMS
          </p>
        </div>
      </div>
    </motion.div>
  );
}
