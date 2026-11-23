# FixMate: Smart Device & Home Appliance Repair Booking (Client)

FixMate is a role-based repair service platform. Verified **technicians** list repair services, **customers** browse them, send repair requests, follow each job step by step and **pay only after the job is completed**. **Admins** approve listings, manage users and monitor jobs and Stripe revenue.

- **Live site:** [FixMate](https://fixmate-client-pink.vercel.app/)
- **Server repo:** [fixmate-server](https://github.com/taminulislam27/fixmate-server)
- **API (live):** [live-api](https://fixmate-server-psi.vercel.app/)

## Test accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@fixmate.dev` | `Admin123` |
| Technician | `tech1@fixmate.dev` | `Demo1234` |
| Technician | `tech2@fixmate.dev` | `Demo1234` |
| Customer | `customer@fixmate.dev` | `Demo1234` |

Stripe test card: `4242 4242 4242 4242`, any future date, any CVC.

## Key features

- **Auth:** BetterAuth + MongoDB adapter, `role / phone / area / bio` as additional fields. Admin cannot be chosen at sign-up (also enforced by a server hook). Password rules: 6+ chars, upper and lower case.
- **Route protection:** middleware (no session -> `/sign-in?redirect=...`) plus server-side role checks in every dashboard layout. A logged-in user is never sent to login on reload.
- **Public site:** Home (hero search, 6 latest services, How it Works, categories, why choose us), Browse Services, Service Details, About.
- **Challenge 1:** search, category and mode filters and sort run **in MongoDB** via URL query params (`/services?category=AC`), so they survive reload.
- **Role-restricted repair request:** logged-out -> sign in and come back; technician/admin -> disabled with notice; customer -> validated form. Duplicate active requests are refused by the server.
- **Dashboards (collapsible sidebar, role-based menu, reusable stat cards, charts):** customer (overview, bookings, payments), technician (overview, add service with ImgBB, my services CRUD + availability toggle, requests with valid actions per status and a final-amount modal), admin (overview, users and roles, service approval, all bookings, transactions with total revenue).
- **Stripe Checkout (test mode):** Pay Now appears only for completed + unpaid jobs. The success page asks the server to verify the session; the server saves the payment exactly once (unique `stripeSessionId` + webhook).
- **Optional features chosen:** **Rating & Review** (stars on cards and details page) and **Job Timeline Tracker** (visual tracker built from `statusHistory`). Server-side pagination and dark/light mode are included too.
- **Polish:** loading skeletons, custom 404 and error pages, toasts for every action, empty states, confirmation modals, new X logo in the footer, responsive from mobile to desktop.

## Tech stack and packages

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui (Radix primitives), BetterAuth, MongoDB driver, `jose` (JWT signing), Recharts, Sonner (toasts), lucide-react, next-themes, class-variance-authority, clsx, tailwind-merge, tailwindcss-animate, jspdf.

## How auth reaches the Express API

BetterAuth owns the session. `GET /api/token` (Next route) signs a 15 minute JWT (`HS256`, `JWT_SECRET`) for the logged-in user. The browser sends it as `Authorization: Bearer ...` to the Express server, which verifies it and re-reads the user's **role from MongoDB** on every request.

## Local setup

```bash
npm install
cp .env.example .env.local     # fill in the values
npm run dev                    # http://localhost:3000
```

Environment variables (`.env.local`):

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI`, `DB_NAME` | MongoDB connection (same DB as the server) |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | BetterAuth secret and base URL |
| `JWT_SECRET` | **Must equal** the server's `JWT_SECRET` |
| `NEXT_PUBLIC_API_URL` | Express server URL |
| `NEXT_PUBLIC_APP_URL` | This site's URL (BetterAuth trusted origin) |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB image uploads |
| `SEED_*` | Demo account emails and passwords for the seed script |

### Seed demo data (do this once, in this order)

```bash
npm run seed            # client repo: creates admin, 2 technicians, 1 customer
# then in the server repo:
npm run seed            # 14 services (+1 pending), bookings in every status, payments
```

## Deploying to Vercel

1. Import the repo, add every variable above, set `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL` to the production domain.
2. In the **server** project, set `CLIENT_URL` to the production client URL (CORS).
3. Redeploy both. Open a private route and reload to confirm you stay signed in.
