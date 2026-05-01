"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

/**
 * Placeholder for Tawk.to, Intercom, or Crisp.
 * Replace the button onClick with your chat SDK's open method.
 * Example Tawk.to: window.Tawk_API?.maximize();
 * Example Intercom: window.Intercom?.('show');
 * Example Crisp: window.$crisp?.push(['do', 'chat:open']);
 */
export function ChatWidget() {
  const [hover, setHover] = useState(false);

  const openChat = () => {
    // Uncomment and use your provider:
    // if (typeof window !== "undefined" && (window as any).Tawk_API) (window as any).Tawk_API.maximize();
    // if (typeof window !== "undefined" && (window as any).Intercom) (window as any).Intercom('show');
    // if (typeof window !== "undefined" && (window as any).$crisp) (window as any).$crisp.push(['do', 'chat:open']);
    console.log("Chat widget: Add Tawk.to, Intercom, or Crisp script and open method.");
  };

  return (
    <div className="hidden md:block fixed bottom-24 right-6 z-50">
      <button
        type="button"
        aria-label="Open chat"
        onClick={openChat}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      {hover && (
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs whitespace-nowrap">
          Chat with us
        </span>
      )}
    </div>
  );
}
