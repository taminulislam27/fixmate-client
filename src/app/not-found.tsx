import Link from "next/link";
import { Home, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="relative mb-8">
        <span className="font-display text-[8rem] font-extrabold leading-none text-primary/15 sm:text-[11rem]">404</span>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-20 w-20 rotate-[-18deg] items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg">
            <Wrench className="h-10 w-10" strokeWidth={2.5} />
          </span>
        </span>
      </div>
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">This page needs a repair</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you are looking for does not exist, was moved, or is no longer available.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">
          <Home /> Back to Home
        </Link>
      </Button>
    </main>
  );
}
