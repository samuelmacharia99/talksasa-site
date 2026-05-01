"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const TLDs = [".com", ".co.ke", ".org", ".net"];

export function DomainSearch() {
  const [query, setQuery] = useState("");
  const [tld, setTld] = useState(".co.ke");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.open("https://servers.talksasa.com", "_blank");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSearch}
      className="rounded-xl glass border border-border p-2 flex flex-col sm:flex-row gap-2 max-w-xl mx-auto"
    >
      <div className="flex flex-1 rounded-lg overflow-hidden bg-background/50 border border-border">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find your perfect domain"
          className="flex-1 px-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
          aria-label="Domain name"
        />
        <select
          value={tld}
          onChange={(e) => setTld(e.target.value)}
          className="px-3 py-3 bg-background text-foreground border-l border-border focus:outline-none focus:ring-0 text-sm cursor-pointer"
          aria-label="Domain extension"
        >
          {TLDs.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" size="lg" className="shrink-0">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </motion.form>
  );
}
