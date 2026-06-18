"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, CheckCircle2, AlertCircle, Clock, Shield, MessageCircle, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/components/analytics";
import { useToast } from "@/components/toast";
import { cn } from "@/lib/utils";
import { CONTACT, INFO_EMAIL, SALES_EMAIL, PRIMARY_PHONE, SALES_PHONE } from "@/lib/contact";

const SERVICE_OPTIONS = [
  "Bulk SMS",
  "Web Hosting",
  "Domains",
  "VPS",
  "Dedicated Servers",
  "Cloud Solutions",
  "Multiple / Not sure",
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const WHATSAPP_NUMBER = CONTACT.whatsapp;

function formatWhatsAppMessage(formData: FormState) {
  const messageText = `
🆕 NEW INQUIRY - TalkSasa.com

👤 Name: ${formData.name}
📧 Email: ${formData.email}
📱 Phone: ${formData.phone}

🔍 Interested in: ${formData.service}

${formData.message ? `💬 Message:\n${formData.message}` : ''}

---
Sent from talksasa.com contact form
  `.trim();
  
  return encodeURIComponent(messageText);
}

export function ContactForm() {
  const toast = useToast();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    const phoneRegex = /^[+]?[\d\s-()]+$/;
    if (!form.phone.trim()) {
      next.phone = "Phone is required";
    } else if (!phoneRegex.test(form.phone)) {
      next.phone = "Please enter a valid phone number";
    }
    if (!form.service) {
      next.service = "Please select a service";
    }
    // Message is now optional
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
      const whatsappMessage = formatWhatsAppMessage(form);
      const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
      
      // Detect mobile device
      const isMobile = typeof window !== "undefined" && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // On mobile, directly navigate (opens WhatsApp app)
        window.location.href = whatsappURL;
      } else {
        // On desktop, open in new tab (WhatsApp Web)
        window.open(whatsappURL, "_blank");
      }
      
      setSuccessMessage("Opening WhatsApp... Please click Send to complete your inquiry.");
      setStatus("success");
      trackCTAClick("contact_form_whatsapp_submit");
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setForm({ name: "", email: "", phone: "", service: "", message: "" });
        setErrors({});
        setStatus("idle");
        setSuccessMessage("");
      }, 3000);
      
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Could not open WhatsApp. Please try again or contact us directly.";
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
          className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 mb-4"
        >
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-400">{successMessage}</p>
              <p className="text-xs text-emerald-400/80 mt-1">
                Didn&apos;t open?{" "}
                <button
                  type="button"
                  onClick={() => {
                    const whatsappMessage = formatWhatsAppMessage(form);
                    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
                    window.open(whatsappURL, "_blank");
                  }}
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
          className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 mb-4"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-400">{errorMessage}</p>
              <p className="text-xs text-red-400/80 mt-1">
                Contact us directly:{" "}
                <a href={`mailto:${INFO_EMAIL}`} className="underline hover:text-red-300">
                  {INFO_EMAIL}
                </a>
                {" or "}
                <a href={`mailto:${SALES_EMAIL}`} className="underline hover:text-red-300">
                  {SALES_EMAIL}
                </a>
                {" or call "}
                <a href={`tel:${PRIMARY_PHONE.tel}`} className="underline hover:text-red-300">
                  {PRIMARY_PHONE.display}
                </a>
                {", "}
                <a href={`tel:${SALES_PHONE.tel}`} className="underline hover:text-red-300">
                  {SALES_PHONE.display}
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className={cn(
            "w-full rounded-lg bg-background/50 border px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
            errors.name ? "border-red-500/50" : "border-border"
          )}
          placeholder="Your name"
        />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          className={cn(
            "w-full rounded-lg bg-background/50 border px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
            errors.email ? "border-red-500/50" : "border-border"
          )}
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="contact-phone" className="block text-sm font-medium text-foreground mb-1.5">
          Phone
        </label>
        <input
          id="contact-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          className={cn(
            "w-full rounded-lg bg-background/50 border px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
            errors.phone ? "border-red-500/50" : "border-border"
          )}
          placeholder="+254 700 000 000"
        />
        {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="contact-service" className="block text-sm font-medium text-foreground mb-1.5">
          Service Interested In
        </label>
        <select
          id="contact-service"
          value={form.service}
          onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))}
          className={cn(
            "w-full rounded-lg bg-background/50 border px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
            errors.service ? "border-red-500/50" : "border-border"
          )}
        >
          <option value="">Select a service</option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.service && <p className="mt-1 text-xs text-red-400">{errors.service}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">
          Message
        </label>
        <textarea
          id="contact-message"
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          rows={4}
          className={cn(
            "w-full rounded-lg bg-background/50 border px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none",
            errors.message ? "border-red-500/50" : "border-border"
          )}
          placeholder="How can we help? (Optional)"
        />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 border-0"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Preparing message...
          </>
        ) : (
          <>
            Send via WhatsApp
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      {/* Alternative contact methods */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm text-center text-muted-foreground mb-3">Or contact us directly:</p>
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank")}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            asChild
          >
            <a href={`tel:${PRIMARY_PHONE.tel}`}>
              <Phone className="mr-2 h-4 w-4" />
              {PRIMARY_PHONE.display}
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            asChild
          >
            <a href={`tel:${SALES_PHONE.tel}`}>
              <Phone className="mr-2 h-4 w-4" />
              {SALES_PHONE.display}
            </a>
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            asChild
          >
            <a href={`mailto:${INFO_EMAIL}`}>
              <Mail className="mr-2 h-4 w-4" />
              {INFO_EMAIL}
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            asChild
          >
            <a href={`mailto:${SALES_EMAIL}`}>
              <Mail className="mr-2 h-4 w-4" />
              {SALES_EMAIL}
            </a>
          </Button>
        </div>
      </div>

      {/* Privacy & Response time info */}
      <div className="pt-4 border-t border-border space-y-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-4 w-4 mr-2 text-emerald-400 shrink-0" />
          <span>We typically respond within 1 hour during business hours (8 AM - 8 PM EAT)</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Shield className="h-4 w-4 mr-2 text-emerald-400 shrink-0" />
          <span>Your information is secure. We never share your details.</span>
        </div>
      </div>
    </motion.form>
  );
}
