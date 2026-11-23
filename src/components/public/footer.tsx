import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { XIcon } from "@/components/shared/x-icon";

const POPULAR = ["Smartphone", "Laptop & PC", "AC", "Refrigerator"];

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm leading-relaxed text-white/70">
            Verified technicians, live job tracking and pay-after-service. Repairs without the guesswork.
          </p>
          <div className="flex gap-2">
            {[
              { label: "X", node: <XIcon className="h-4 w-4" /> },
              { label: "Facebook", node: <Facebook className="h-4 w-4" /> },
              { label: "Instagram", node: <Instagram className="h-4 w-4" /> },
              { label: "LinkedIn", node: <Linkedin className="h-4 w-4" /> },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {s.node}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-accent">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li><Link className="hover:text-white" href="/">Home</Link></li>
            <li><Link className="hover:text-white" href="/services">Services</Link></li>
            <li><Link className="hover:text-white" href="/about">About &amp; How It Works</Link></li>
            <li><Link className="hover:text-white" href="/sign-up">Become a Technician</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-accent">Popular Categories</h4>
          <ul className="space-y-2.5 text-sm text-white/75">
            {POPULAR.map((c) => (
              <li key={c}>
                <Link className="hover:text-white" href={`/services?category=${encodeURIComponent(c)}`}>
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-accent">Contact</h4>
          <ul className="space-y-3 text-sm text-white/75">
            <li className="flex items-start gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> support@fixmate.dev</li>
            <li className="flex items-start gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> +880 1700 000 000</li>
            <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> House 21, Road 8, Dhanmondi, Dhaka 1209</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} FixMate. All rights reserved.</p>
          <p>Smart device &amp; home appliance repairs, done right.</p>
        </div>
      </div>
    </footer>
  );
}
