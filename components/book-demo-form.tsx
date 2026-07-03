"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  CalendarDays,
  Clock,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/components/analytics";
import { useToast } from "@/components/toast";
import { submitLead } from "@/lib/submit-lead";
import { cn } from "@/lib/utils";
import { CONTACT } from "@/lib/contact";
import {
  DEMO_PRODUCTS,
  TIME_SLOTS,
  formatDemoDate,
  getAvailableDays,
  getMonthOptions,
} from "@/lib/book-demo";

type FormState = {
  name: string;
  email: string;
  phone: string;
  product: string;
  month: string;
  day: string;
  time: string;
  notes: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const WHATSAPP_NUMBER = CONTACT.whatsapp;
const MONTH_OPTIONS = getMonthOptions();

const inputClass =
  "w-full rounded-lg bg-background/50 border px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

function formatWhatsAppMessage(form: FormState) {
  const monthOption = MONTH_OPTIONS.find((m) => m.value === form.month);
  const dateLabel =
    monthOption && form.day
      ? formatDemoDate(monthOption.year, monthOption.month, Number(form.day))
      : "Not specified";

  return encodeURIComponent(
    `
📅 DEMO REQUEST - TalkSasa.com

👤 Name: ${form.name}
📧 Email: ${form.email}
📱 Phone: ${form.phone}

📦 Product: ${form.product}
🗓️ Preferred date: ${dateLabel}
🕐 Preferred time: ${form.time} (EAT)

${form.notes ? `💬 Notes:\n${form.notes}` : ""}

---
Sent from talksasa.com book a demo form
  `.trim()
  );
}

function openWhatsApp(url: string) {
  const isMobile =
    typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    window.location.href = url;
  } else {
    window.open(url, "_blank");
  }
}

export function BookDemoForm() {
  const toast = useToast();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    product: "",
    month: MONTH_OPTIONS[0]?.value ?? "",
    day: "",
    time: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedMonth = MONTH_OPTIONS.find((m) => m.value === form.month);
  const availableDays = useMemo(() => {
    if (!selectedMonth) return [];
    return getAvailableDays(selectedMonth.year, selectedMonth.month);
  }, [selectedMonth]);

  function validate(): boolean {
    const next: Errors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      next.name = "Please enter your full name";
    }
    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address";
    }
    if (!form.phone.trim()) {
      next.phone = "Phone is required";
    } else if (!/^[+]?[\d\s-()]+$/.test(form.phone)) {
      next.phone = "Please enter a valid phone number";
    }
    if (!form.product) {
      next.product = "Please select a product";
    }
    if (!form.month) {
      next.month = "Please select a month";
    }
    if (!form.day) {
      next.day = "Please select a day";
    }
    if (!form.time) {
      next.time = "Please select a time";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validate()) return;

    setStatus("loading");

    try {
      const monthOption = MONTH_OPTIONS.find((m) => m.value === form.month);
      const dateLabel =
        monthOption && form.day
          ? formatDemoDate(monthOption.year, monthOption.month, Number(form.day))
          : "Not specified";

      const saved = await submitLead({
        type: "demo",
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: form.product,
        message: form.notes.trim() || undefined,
        metadata: {
          preferred_date: dateLabel,
          preferred_time: form.time,
        },
      });

      if (!saved.ok) {
        setStatus("error");
        setErrorMessage(saved.error);
        toast(saved.error, "error");
        return;
      }

      const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${formatWhatsAppMessage(form)}`;
      const isMobile =
        typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      trackCTAClick("book_demo_whatsapp_submit");

      if (isMobile) {
        try {
          sessionStorage.setItem("talksasa_pending_wa", whatsappURL);
        } catch {
          // ignore
        }
        window.location.href = `${saved.redirect}&open_whatsapp=1`;
        return;
      }

      openWhatsApp(whatsappURL);
      window.location.href = saved.redirect;
    } catch {
      const msg = "Could not open WhatsApp. Please try again.";
      setStatus("error");
      setErrorMessage(msg);
      toast(msg, "error");
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="rounded-2xl glass border border-border p-6 sm:p-8 space-y-5"
    >
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3"
        >
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-400">{successMessage}</p>
              <p className="text-xs text-emerald-400/80 mt-1">
                Didn&apos;t open?{" "}
                <button
                  type="button"
                  onClick={() =>
                    openWhatsApp(
                      `https://wa.me/${WHATSAPP_NUMBER}?text=${formatWhatsAppMessage(form)}`
                    )
                  }
                  className="underline hover:text-emerald-300"
                >
                  Click here to try again
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {status === "error" && errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-400">{errorMessage}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="demo-name" className="block text-sm font-medium text-foreground mb-1.5">
            Full name
          </label>
          <input
            id="demo-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className={cn(inputClass, errors.name ? "border-red-500/50" : "border-border")}
            placeholder="Your name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="demo-phone" className="block text-sm font-medium text-foreground mb-1.5">
            Phone
          </label>
          <input
            id="demo-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            className={cn(inputClass, errors.phone ? "border-red-500/50" : "border-border")}
            placeholder="+254 700 000 000"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="demo-email" className="block text-sm font-medium text-foreground mb-1.5">
          Email
        </label>
        <input
          id="demo-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          className={cn(inputClass, errors.email ? "border-red-500/50" : "border-border")}
          placeholder="you@company.com"
        />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="demo-product" className="block text-sm font-medium text-foreground mb-1.5">
          <span className="inline-flex items-center gap-1.5">
            <Package className="h-4 w-4 text-primary" />
            Product you&apos;re interested in
          </span>
        </label>
        <select
          id="demo-product"
          value={form.product}
          onChange={(e) => setForm((p) => ({ ...p, product: e.target.value }))}
          className={cn(inputClass, errors.product ? "border-red-500/50" : "border-border")}
        >
          <option value="">Select a product</option>
          {DEMO_PRODUCTS.map((product) => (
            <option key={product} value={product}>
              {product}
            </option>
          ))}
        </select>
        {errors.product && <p className="mt-1 text-xs text-red-400">{errors.product}</p>}
      </div>

      <div className="rounded-xl border border-border bg-background/30 p-4 sm:p-5 space-y-4">
        <p className="text-sm font-medium text-foreground flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          Preferred demo date & time
        </p>
        <p className="text-xs text-muted-foreground -mt-2">
          All times are East Africa Time (EAT). We&apos;ll confirm availability on WhatsApp.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="demo-month" className="block text-sm font-medium text-foreground mb-1.5">
              Month
            </label>
            <select
              id="demo-month"
              value={form.month}
              onChange={(e) =>
                setForm((p) => ({ ...p, month: e.target.value, day: "" }))
              }
              className={cn(inputClass, errors.month ? "border-red-500/50" : "border-border")}
            >
              {MONTH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.month && <p className="mt-1 text-xs text-red-400">{errors.month}</p>}
          </div>

          <div>
            <label htmlFor="demo-day" className="block text-sm font-medium text-foreground mb-1.5">
              Day
            </label>
            <select
              id="demo-day"
              value={form.day}
              onChange={(e) => setForm((p) => ({ ...p, day: e.target.value }))}
              className={cn(inputClass, errors.day ? "border-red-500/50" : "border-border")}
            >
              <option value="">Select day</option>
              {availableDays.map((day) => (
                <option key={day} value={String(day)}>
                  {day}
                </option>
              ))}
            </select>
            {errors.day && <p className="mt-1 text-xs text-red-400">{errors.day}</p>}
          </div>

          <div>
            <label htmlFor="demo-time" className="block text-sm font-medium text-foreground mb-1.5">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Time
              </span>
            </label>
            <select
              id="demo-time"
              value={form.time}
              onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
              className={cn(inputClass, errors.time ? "border-red-500/50" : "border-border")}
            >
              <option value="">Select time</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.time && <p className="mt-1 text-xs text-red-400">{errors.time}</p>}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="demo-notes" className="block text-sm font-medium text-foreground mb-1.5">
          Additional notes <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          id="demo-notes"
          rows={3}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          className={cn(inputClass, "resize-none border-border")}
          placeholder="Team size, use case, questions for the demo…"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto"
        disabled={status === "loading"}
        data-track="book-demo-submit"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Opening WhatsApp…
          </>
        ) : (
          <>
            <MessageCircle className="mr-2 h-4 w-4" />
            Send demo request via WhatsApp
          </>
        )}
      </Button>
    </motion.form>
  );
}
