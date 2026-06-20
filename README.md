# PackGo — Travel Company Website

> Your Journey, Our Passion

A full-stack travel booking website built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **MongoDB/Mongoose**.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and set your `MONGODB_URI` and `NEXTAUTH_SECRET`.

### 3. Seed the database
```bash
node scripts/seed.mjs
```
This creates:
- **Admin user**: `admin@packgo.com` / `admin123`
- **8 travel packages** with full details
- **Sample itinerary** for Golden Triangle Tour

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth + register
│   │   ├── plans/         # CRUD travel plans
│   │   ├── itineraries/   # CRUD itineraries
│   │   └── admin/         # Admin stats + users
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Login / Register
│   ├── plan/[slug]/       # Plan detail page
│   ├── packages/          # All packages listing
│   ├── destinations/      # Destinations page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── page.tsx           # Homepage
├── components/
│   ├── layout/            # Navbar, Footer, MainLayout
│   ├── home/              # Hero, PlanCard, sections
│   └── ui/                # BookNowButton, etc.
├── lib/
│   ├── db.ts              # MongoDB connection
│   └── utils.ts           # Helpers, WhatsApp URL builder
└── models/
    ├── User.ts             # User schema
    ├── TravelPlan.ts       # Travel plan schema
    ├── Itinerary.ts        # Day-by-day itinerary schema
    └── Enquiry.ts          # Booking enquiry schema
```

---

## ✨ Features

### Public Website
- 🏠 **Homepage** — Hero, category showcase, featured & trending packages, testimonials, newsletter
- 📦 **Packages page** — Filter by category, search, sort, paginated grid
- 🗺️ **Plan detail page** — Full details, day-by-day itinerary accordion, booking card
- 📲 **WhatsApp booking** — Pre-filled message with plan details → `+91 9544661551`
- 📍 **Destinations page** — Visual destination grid
- 📞 **Contact page** — WhatsApp-powered contact form
- ℹ️ **About page** — Company story and stats

### Authentication
- JWT-based via NextAuth
- Login / Register pages
- Admin role protection on API routes and dashboard

### Admin Dashboard (`/admin`)
- 📊 **Dashboard** — Stats overview, recent enquiries, category breakdown
- 📦 **Plans** — Create / view / deactivate packages with full form
- 🗓️ **Itineraries** — Add day-by-day itinerary days to packages
- 👥 **Users** — View all registered users with preferences

### Technical
- ✅ Mobile-first responsive design
- ✅ Framer Motion animations throughout
- ✅ MongoDB with 4 optimized schemas + indexes
- ✅ Type-safe with TypeScript throughout
- ✅ Image optimization via Next.js Image
- ✅ Server components + client components balanced

---

## 🔧 Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET` | Random secret for JWT signing |
| `NEXTAUTH_URL` | App URL (e.g. http://localhost:3000) |
| `WHATSAPP_NUMBER` | WhatsApp number for bookings |

---

## 📱 WhatsApp Booking

When a user clicks **"Book via WhatsApp"**, they are redirected to:
```
https://wa.me/9544661551?text=<pre-filled message with plan details>
```

The pre-filled message includes:
- Package name
- Destination
- Duration
- Price per person

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js |
| Forms | React Hook Form |
| Notifications | react-hot-toast |
