"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Server,
  ChevronDown,
  ArrowRight,
  Sun,
  Moon,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCTAModal } from "@/components/cta-modal";
import { useTheme } from "@/components/theme-provider";
import { trackCTAClick } from "@/components/analytics";
import { useRipple } from "@/lib/use-ripple";
import { BULK_SMS_URL, HOSTING_URL } from "@/lib/urls";
import { ServicesMegaMenu } from "@/components/services-mega-menu";
import { megaMenuGroups } from "@/lib/platform-menu";

const loginItems = [
  { label: "Bulk SMS", href: `${BULK_SMS_URL}/login` },
  { label: "Hosting & Domains", href: `${HOSTING_URL}/login` },
  { label: "Mail login", href: "https://mail.talksasa.com/" },
];

const resellerItems = [
  { icon: Server, title: "Reseller Hosting", description: "White-label hosting, domains, and cloud apps.", href: "/reseller-hosting" },
  { icon: MessageSquare, title: "SMS Reseller", description: "Resell bulk SMS under your own brand.", href: "/sms-reseller" },
];

const navItems = [
  { href: "/domains", label: "Register domain" },
  { href: "/pricing", label: "Pricing" },
  { href: "/book-demo", label: "Book a demo" },
  { href: "/contact", label: "Contact" },
];

function scrollToSection(href: string) {
  if (href.startsWith("#")) {
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [resellerOpen, setResellerOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const resellerRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const { openModal } = useCTAModal();
  const { theme, toggleTheme } = useTheme();
  const ripple = useRipple();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", mobileOpen);
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.classList.remove("mobile-menu-open");
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (servicesRef.current && !servicesRef.current.contains(target)) setServicesOpen(false);
      if (resellerRef.current && !resellerRef.current.contains(target)) setResellerOpen(false);
      if (loginRef.current && !loginRef.current.contains(target)) setLoginOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    setServicesOpen(false);
    setResellerOpen(false);
    setLoginOpen(false);
    setMobileServicesOpen(false);
    if (href.startsWith("#")) {
      const path = href.slice(1);
      if (path) scrollToSection(href);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "py-3 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
            : "py-5 bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => handleNavClick("#home")}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              aria-label="TalkSasa Home"
            >
              <Image
                src="/st.png"
                alt="TalkSasa"
                width={180}
                height={52}
                sizes="(max-width: 640px) 140px, 180px"
                className="h-9 sm:h-11 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden xl:flex items-center gap-0.5 2xl:gap-1">
              {/* Home link */}
              <Link
                href="/"
                className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>

              {/* Services with mega menu */}
              <div
                className="relative"
                ref={servicesRef}
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  onClick={() => setServicesOpen((o) => !o)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    servicesOpen ? "text-foreground bg-white/5" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Services
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", servicesOpen && "rotate-180")}
                  />
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <ServicesMegaMenu
                      key="services-mega"
                      onNavigate={() => setServicesOpen(false)}
                      onViewAll={() => handleNavClick("#services")}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Reseller dropdown */}
              <div
                className="relative"
                ref={resellerRef}
                onMouseEnter={() => setResellerOpen(true)}
                onMouseLeave={() => setResellerOpen(false)}
              >
                <button
                  onClick={() => setResellerOpen((o) => !o)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    resellerOpen ? "text-foreground bg-white/5" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Reseller
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", resellerOpen && "rotate-180")}
                  />
                </button>

                <AnimatePresence>
                  {resellerOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-64 rounded-xl glass border border-border shadow-xl overflow-hidden"
                    >
                      <div className="p-2">
                        {resellerItems.map((item) => {
                          const isExternal = item.href.startsWith("http");
                          const Comp = isExternal ? "a" : Link;
                          return (
                            <Comp
                              key={item.title}
                              href={item.href}
                              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                              onClick={() => setResellerOpen(false)}
                              className="flex gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
                            >
                              <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary group-hover:bg-primary/20">
                                <item.icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-foreground text-sm">{item.title}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                              </div>
                            </Comp>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navItems.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={link.href.startsWith("#") ? (e) => { e.preventDefault(); handleNavClick(link.href); } : undefined}
                  className="px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right: Theme toggle, Login, Get Started */}
            <div className="hidden xl:flex items-center gap-2 2xl:gap-3">
              <button
                type="button"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                onClick={toggleTheme}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div
                className="relative"
                ref={loginRef}
                onMouseEnter={() => setLoginOpen(true)}
                onMouseLeave={() => setLoginOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setLoginOpen((o) => !o)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-border transition-colors",
                    loginOpen ? "text-foreground bg-white/5" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LogIn className="h-4 w-4" aria-hidden />
                  Log in
                  <ChevronDown className={cn("h-4 w-4 transition-transform", loginOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {loginOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-1 w-52 rounded-xl glass border border-border shadow-xl overflow-hidden"
                    >
                      <div className="p-2">
                        {loginItems.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setLoginOpen(false)}
                            className="block px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                size="default"
                className="btn-ripple bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 border-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={(e) => { ripple.onClick(e as unknown as React.MouseEvent<HTMLElement>); trackCTAClick("navbar_get_started"); openModal(); }}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile menu button - hamburger animates to X */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="xl:hidden relative p-2 text-foreground w-11 h-11 flex items-center justify-center touch-target"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="sr-only">{mobileOpen ? "Close" : "Menu"}</span>
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <motion.span
                  className="absolute left-0 w-6 h-0.5 bg-current rounded-full origin-center"
                  style={{ top: 2 }}
                  animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute left-0 w-6 h-0.5 bg-current rounded-full origin-center"
                  style={{ top: "50%", marginTop: -1 }}
                  animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.15 }}
                />
                <motion.span
                  className="absolute left-0 w-6 h-0.5 bg-current rounded-full origin-center"
                  style={{ bottom: 2 }}
                  animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 xl:hidden bg-background/95 backdrop-blur-xl overflow-y-auto overscroll-contain safe-bottom"
          >
            <div className="flex flex-col min-h-full pt-24 pb-8 px-4 sm:px-6">
              {/* Home */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="block py-4 text-lg font-medium text-foreground border-b border-border"
                >
                  Home
                </Link>
              </motion.div>

              {/* Services mega menu (mobile) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="border-b border-border"
              >
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen((o) => !o)}
                  className="flex w-full items-center justify-between py-4 text-lg font-medium text-foreground"
                >
                  Services
                  <ChevronDown
                    className={cn("h-5 w-5 transition-transform", mobileServicesOpen && "rotate-180")}
                  />
                </button>
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pb-4 space-y-5"
                    >
                      {megaMenuGroups.map((group) => (
                        <div key={group.id}>
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary px-1">
                            {group.label}
                          </p>
                          <p className="text-xs text-muted-foreground px-1 mb-2">{group.tagline}</p>
                          <div className="space-y-1 pl-2">
                            {group.items.map((item) => {
                              const isExternal = item.href.startsWith("http");
                              const Comp = isExternal ? "a" : Link;
                              return (
                                <Comp
                                  key={item.title}
                                  href={item.href}
                                  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                  onClick={() => setMobileOpen(false)}
                                  className="block py-3 text-sm text-muted-foreground hover:text-foreground"
                                >
                                  {item.title}
                                </Comp>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      <Link
                        href="/#services"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick("#services");
                        }}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary pl-2"
                      >
                        View all services
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Reseller */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="border-b border-border">
                  <div className="py-4 text-lg font-medium text-foreground">Reseller</div>
                  <div className="pl-4 pb-2 space-y-2">
                    <Link
                      href="/reseller-hosting"
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Reseller Hosting
                    </Link>
                    <Link
                      href="/sms-reseller"
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      SMS Reseller
                    </Link>
                  </div>
                </div>
              </motion.div>

              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * (i + 3) }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.startsWith("#")) {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }
                      setMobileOpen(false);
                    }}
                    className="block py-4 text-lg font-medium text-foreground border-b border-border"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="flex items-center gap-3 py-4 border-b border-border"
              >
                <span className="text-sm text-muted-foreground">Theme</span>
                <button
                  type="button"
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  onClick={() => { toggleTheme(); setMobileOpen(false); }}
                  className="p-2 rounded-lg bg-muted text-foreground"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="mt-6 pt-4 border-t border-border space-y-3"
              >
                <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">Log in</span>
                {loginItems.map((item) => (
                  <Button
                    key={item.label}
                    asChild
                    variant="outline"
                    size="default"
                    className="w-full min-h-11"
                  >
                    <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>
                      {item.label}
                    </a>
                  </Button>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-auto pt-8"
              >
                <Button size="lg" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 border-0" onClick={() => { setMobileOpen(false); trackCTAClick("mobile_get_started"); openModal(); }}>
                  Get Started
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
