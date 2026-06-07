"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search, LayoutGrid } from "lucide-react";
import { SiteLogo } from "@/components/website/site-logo";
import { TopBar } from "@/components/website/top-bar";
import { DiscoverButton } from "@/components/website/discover-button";
import { cn } from "@/lib/utils";
import { NAV } from "@/content/site";
import { parseSiteSettings } from "@/lib/site-settings";
import { NavDropdown } from "@/components/website/nav-dropdown";
import { NavDropdownMobile } from "@/components/website/nav-dropdown-mobile";

const CHILD_DESC: Record<string, string> = {
  "For Clinics": "Fast onboarding, essential modules, affordable",
  "For Hospitals": "Integrated departments, leadership dashboards",
  Blog: "Healthcare technology insights",
  "Case Studies": "Real results from real facilities",
  FAQ: "Answers to common questions",
  "About Us": "Our mission, vision and values",
  Contact: "Get in touch with our team",
  Resources: "Guides and tools for digital transformation",
};

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; desc: string }[];
};

function hasDropdown(item: NavItem) {
  return Boolean(item.children && item.children.length > 0);
}

export function Header({
  menuItems,
  settings = {},
}: {
  menuItems?: NavItem[];
  settings?: Record<string, unknown>;
}) {
  const site = parseSiteSettings(settings);
  const nav = (menuItems?.length ? menuItems : NAV).map((item) => ({
    ...item,
    children: item.children?.map((c) => ({
      ...c,
      desc: c.desc || CHILD_DESC[c.label] || "",
    })),
  }));
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const openItem = nav.find((item) => item.label === openMenu && hasDropdown(item));

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const linkClass = (href: string) =>
    cn(
      "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
      isActive(href)
        ? "text-[#2563EB]"
        : "text-[#001A41] hover:text-[#2563EB]"
    );

  return (
    <header className="sticky top-0 z-[100] w-full">
      {isHome && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            isScrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
          )}
        >
          <TopBar settings={settings} />
        </div>
      )}

      <div
        onMouseLeave={() => setOpenMenu(null)}
        className={cn(
          "relative border-b border-slate-200/80 bg-white transition-all duration-300",
          isScrolled
            ? "shadow-[0_8px_30px_rgba(10,42,139,0.1)]"
            : "shadow-sm"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <SiteLogo
              name={site.site_name}
              logoUrl={site.site_logo || undefined}
              showTagline={!isHome}
              tagline={site.site_tagline || "Bridging Technology & Care"}
            />
          </Link>

          <nav className="hidden lg:block" aria-label="Main navigation">
            <ul className="flex list-none items-center gap-1 p-0 m-0">
              {nav.map((item) => (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(hasDropdown(item) ? item.label : null)}
                >
                  {hasDropdown(item) ? (
                    <button
                      type="button"
                      aria-expanded={openMenu === item.label}
                      aria-haspopup="true"
                      onClick={() =>
                        setOpenMenu(openMenu === item.label ? null : item.label)
                      }
                      className={cn(
                        "flex items-center gap-1",
                        linkClass(item.href),
                        openMenu === item.label && "text-[#2563EB]"
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          openMenu === item.label && "rotate-180"
                        )}
                      />
                    </button>
                  ) : (
                    <Link href={item.href} className={linkClass(item.href)}>
                      {item.label}
                    </Link>
                  )}

                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
            <button
              type="button"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#001A41] transition hover:bg-slate-100"
            >
              <Search className="h-5 w-5" />
            </button>
            {site.watch_demo_text && (
              <Link
                href={site.watch_demo_link || "/contact"}
                className="hidden shrink-0 whitespace-nowrap text-sm font-semibold text-[#001A41] transition hover:text-[#2563EB] lg:inline-flex"
              >
                {site.watch_demo_text}
              </Link>
            )}
            <DiscoverButton
              href={site.request_demo_link || "/contact"}
              label={site.request_demo_text || "Request Demo"}
              className="hidden shrink-0 lg:inline-flex"
            />
            <button
              type="button"
              aria-label="Menu grid"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[#001A41] transition hover:bg-slate-100"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>

          <button
            className="rounded-lg p-2 text-[#001A41] lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {openItem && (
            <NavDropdown
              key={openItem.label}
              parent={{ label: openItem.label, href: openItem.href }}
              children={openItem.children!}
              onClose={() => setOpenMenu(null)}
              isActive={isActive}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-100 bg-white lg:hidden"
            >
              <nav aria-label="Mobile navigation" className="p-4">
                <ul className="flex list-none flex-col gap-1 p-0 m-0">
                  {nav.map((item) => (
                    <li key={item.label}>
                      {hasDropdown(item) ? (
                        <>
                          <Link
                            href={item.href}
                            className="block rounded-lg px-4 py-3 text-sm font-semibold text-[#001A41] hover:bg-slate-50"
                          >
                            {item.label}
                          </Link>
                          <NavDropdownMobile
                            children={item.children!}
                            parentHref={item.href}
                          />
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className="block rounded-lg px-4 py-3 text-sm font-semibold text-[#001A41] hover:bg-slate-50"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 px-4">
                  <DiscoverButton
                    href={site.request_demo_link || "/contact"}
                    label={site.request_demo_text || "Request Demo"}
                  />
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
