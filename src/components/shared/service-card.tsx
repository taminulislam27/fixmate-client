import Link from "next/link";
import { ArrowRight, Clock, MapPin, UserRound, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stars } from "./stars";
import { money } from "@/lib/utils";

export interface ServiceLite {
  _id: string;
  title: string;
  category: string;
  image: string;
  basePrice: number;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  estimatedDuration?: string;
  avgRating?: number;
  reviewCount?: number;
}

/** Equal width + height card. Fixed image ratio, clamped title, footer pinned to the bottom. */
export function ServiceCard({ s }: { s: ServiceLite }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={s.image}
          alt={s.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          {s.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3.25rem] font-display text-lg font-bold leading-snug">{s.title}</h3>
        <div className="mt-2 min-h-[1.5rem]">
          <Stars value={s.avgRating || 0} count={s.reviewCount || 0} />
        </div>
        <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2"><Wrench className="h-4 w-4 shrink-0 text-accent" /> {s.serviceMode}</li>
          <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-accent" /> <span className="truncate">{s.serviceArea}</span></li>
          <li className="flex items-center gap-2"><UserRound className="h-4 w-4 shrink-0 text-accent" /> <span className="truncate">{s.technicianName}</span></li>
          {s.estimatedDuration && (
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0 text-accent" /> {s.estimatedDuration}</li>
          )}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Starting at</p>
            <p className="font-display text-2xl font-extrabold text-primary dark:text-accent">{money(s.basePrice)}</p>
          </div>
          <Button asChild size="sm">
            <Link href={`/services/${s._id}`}>
              View Details <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
