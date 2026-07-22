<div align="center">
  <img src="public/logo.png" alt="NeighbourHub AI Logo" width="80" />
  
  # NeighbourHub AI
  
  ### Your Neighbourhood, Smarter with AI
  
  **Book trusted local services · Report civic issues · Connect with your community**

  [![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://typescriptlang.org)
  [![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?logo=prisma)](https://prisma.io)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
  [![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

  [Live Demo](https://neighbourhub-ai.vercel.app) · [Report Bug](https://github.com/vaishnavichaudhari910/neighbourhub-ai/issues) · [Request Feature](https://github.com/vaishnavichaudhari910/neighbourhub-ai/issues)

</div>

---

## 📸 Screenshots

### 🏠 Landing Page

<img width="1915" height="866" alt="image" src="https://github.com/user-attachments/assets/cdf16b1b-a297-4e6a-b664-619070a183f5" />


---

### 🔐 Login & Register
<img width="1912" height="868" alt="image" src="https://github.com/user-attachments/assets/d36f3c6f-920f-44cb-9935-4823fba2f028" />


---

### 🔍 Services Listing
<img width="1917" height="872" alt="image" src="https://github.com/user-attachments/assets/9da59c3b-21f9-4c82-9e3c-ed1466b01ca3" />


---

### 👤 Provider Profile
<img width="1917" height="870" alt="image" src="https://github.com/user-attachments/assets/326576e7-4a8f-4862-b39f-d9a82ce34878" />


---

### 📅 Booking Flow
> *Replace with actual screenshot*

![Booking Flow — Step 1: Time Slot](https://placehold.co/1280x720/0f172a/60a5fa?text=Booking+Flow+—+Step+1%3A+Time+Slot)

![Booking Flow — Step 2: Address](https://placehold.co/1280x720/0f172a/60a5fa?text=Booking+Flow+—+Step+2%3A+Address)

![Booking Flow — Step 3: Payment](https://placehold.co/1280x720/0f172a/60a5fa?text=Booking+Flow+—+Step+3%3A+Payment)

![Booking Confirmed](https://placehold.co/1280x720/0f172a/60a5fa?text=Booking+Confirmed+%F0%9F%8E%89)

---

### 📊 Citizen Dashboard
> *Replace with actual screenshot*

![Citizen Dashboard](https://placehold.co/1280x720/0f172a/60a5fa?text=Citizen+Dashboard+—+Overview+%26+Stats)

---

### 📋 My Bookings
> *Replace with actual screenshot*

![My Bookings](https://placehold.co/1280x720/0f172a/60a5fa?text=My+Bookings+—+Status+Tracking)

---

### ⚙️ Profile & Settings
> *Replace with actual screenshot*

![Profile Settings](https://placehold.co/1280x720/0f172a/60a5fa?text=Profile+%26+Settings+Page)

---

### 🔧 Provider Dashboard
> *Replace with actual screenshot*

![Provider Dashboard](https://placehold.co/1280x720/0f172a/60a5fa?text=Provider+Dashboard+—+Earnings+%26+Stats)

---

### 📦 Provider — My Services
> *Replace with actual screenshot*

![Provider Services](https://placehold.co/1280x720/0f172a/60a5fa?text=Provider+Services+—+Add+%2F+Edit+%2F+Delete)

---

### ✅ Provider — Booking Management
> *Replace with actual screenshot*

![Provider Bookings](https://placehold.co/1280x720/0f172a/60a5fa?text=Provider+Bookings+—+Accept+%2F+Reject)

---

### 🌙 Dark Mode
> *Replace with actual screenshot*

![Dark Mode](https://placehold.co/1280x720/1e293b/60a5fa?text=Full+Dark+Mode+Support)

---

## ✨ Features

### 👥 Role-Based System
- **Citizen** — Browse services, book providers, track booking status, manage profile
- **Provider** — Add/manage services, accept/reject bookings, track earnings
- **Admin** — Full platform control *(Phase 4)*

### 🔐 Authentication
- Custom JWT auth with `jose` — no NextAuth dependency
- Secure HTTP-only cookie sessions
- Role-based route protection via middleware
- Password hashing with bcryptjs

### 🔍 Service Discovery
- Search by name, category, price range, rating, city
- Real-time filter updates with TanStack Query
- Verified provider badges
- Availability toggle per service

### 📅 Booking Flow
- 4-step wizard: Time Slot → Address → Payment → Confirmation
- Mock payment with coupon codes (SAVE10, FIRST20, NH50)
- GST calculation (18%)
- Booking ID generated on confirmation

### 📊 Dashboards
- **Citizen:** Overview cards, monthly Recharts activity graph, booking history with status badges
- **Provider:** Earnings stats, pending requests alert, service management, booking accept/reject/start/complete

### ⚙️ Profile & Settings
- Avatar upload via Cloudinary (face-crop, auto-quality)
- Personal info update (name, phone)
- Address management with default address
- Password change with validation
- Light / Dark / System theme toggle

### 🔄 Booking Status Flow
```
PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
PENDING → CANCELLED (with reason)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| UI Components | shadcn/ui |
| Animations | Framer Motion |
| Data Fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Maps | React Leaflet (OpenStreetMap) |
| ORM | Prisma v6 |
| Database | PostgreSQL (Neon serverless) |
| Auth | Jose JWT (custom) |
| Password | bcryptjs |
| Images | Cloudinary REST API |
| Theme | next-themes |
| Notifications | Sonner |
| Deployment | Vercel |

---

## 🗂️ Project Structure

```
neighbourhub-ai/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── public/
│   └── home.png               # Hero image
├── scripts/
│   └── verify-providers.js    # One-time migration script
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login, Register, Forgot Password
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (citizen)/         # Protected citizen pages
│   │   │   ├── dashboard/
│   │   │   ├── bookings/
│   │   │   └── profile/
│   │   ├── (landing)/         # Public pages
│   │   │   ├── page.tsx       # Home
│   │   │   ├── services/
│   │   │   ├── providers/
│   │   │   └── booking/
│   │   ├── (provider)/        # Protected provider pages
│   │   │   └── provider/
│   │   │       ├── dashboard/
│   │   │       ├── services/
│   │   │       └── bookings/
│   │   └── api/               # REST API routes
│   │       ├── auth/
│   │       ├── bookings/
│   │       ├── categories/
│   │       ├── provider/
│   │       ├── services/
│   │       ├── upload/
│   │       └── users/
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, Sidebars
│   │   ├── providers/         # ThemeProvider, QueryProvider
│   │   └── ui/                # shadcn/ui components
│   ├── features/
│   │   └── landing/           # Landing page sections
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Prisma, Auth, Utils
│   └── types/                 # TypeScript types
└── next.config.ts
```

---

## 🗄️ Database Schema

```
User ──────┬──── Provider ──── Service ──── Booking
           │                                   │
           ├──── Address                        │
           │                                   │
           └──── Booking ─────────────────────-┘
```

**Models:** User · Provider · Category · Service · Booking · Address

---

## 📡 API Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login → role-based redirect | ❌ |
| POST | `/api/auth/logout` | Logout + clear cookie | ✅ |
| GET | `/api/auth/me` | Get current session user | ✅ |
| GET | `/api/services` | List services (search + filters) | ❌ |
| GET | `/api/services/:id` | Get single service | ❌ |
| GET | `/api/categories` | List all categories | ❌ |
| GET | `/api/providers/:id` | Get provider profile | ❌ |
| POST | `/api/bookings` | Create new booking | ✅ CITIZEN |
| GET | `/api/bookings` | Get citizen's bookings | ✅ CITIZEN |
| GET | `/api/provider/bookings` | Get provider's bookings | ✅ PROVIDER |
| PATCH | `/api/provider/bookings/:id` | Accept/reject/update booking | ✅ PROVIDER |
| GET | `/api/provider/services` | Get provider's services | ✅ PROVIDER |
| POST | `/api/provider/services` | Create new service | ✅ PROVIDER |
| PATCH | `/api/provider/services/:id` | Edit service | ✅ PROVIDER |
| DELETE | `/api/provider/services/:id` | Delete service | ✅ PROVIDER |
| GET | `/api/provider/stats` | Provider earnings + stats | ✅ PROVIDER |
| GET | `/api/users/me` | Get user profile | ✅ |
| PATCH | `/api/users/me` | Update profile / password | ✅ |
| GET | `/api/users/addresses` | Get saved addresses | ✅ |
| POST | `/api/users/addresses` | Save new address | ✅ |
| POST | `/api/upload` | Upload image to Cloudinary | ✅ |
| GET | `/api/health` | DB health check | ❌ |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) recommended — free tier)
- Cloudinary account (free tier)

### 1. Clone the repo

```bash
git clone https://github.com/vaishnavichaudhari910/neighbourhub-ai.git
cd neighbourhub-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create `.env` and `.env.local`:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Auth
NEXTAUTH_SECRET="your-32-character-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database setup

```bash
npx prisma migrate dev --name init
npx prisma db seed
node scripts/verify-providers.js
```

### 5. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### Test accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Citizen | citizen@test.com | Citizen@123 |
| Provider | provider@test.com | Provider@123 |

---

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add all environment variables
4. Set build command: `prisma generate && next build`
5. Deploy!

---

## 📋 Scripts

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npx prisma studio    # Open DB GUI
npx prisma migrate dev   # Run migrations
npx prisma db seed   # Seed database
node scripts/verify-providers.js  # Verify all providers
```

---

## 🗺️ Roadmap

- [x] **Phase 1** — Auth, Landing, Services, Booking wizard, Citizen Dashboard, Profile
- [x] **Phase 2** — Role-based routing, Provider Dashboard, Service CRUD, Booking accept/reject
- [ ] **Phase 3** — Reviews system, Real-time chat (Socket.IO), Community feed, Complaints
- [ ] **Phase 4** — AI assistant, Smart recommendations, Admin dashboard, Analytics
- [ ] **Phase 5** — PWA, Multi-language (EN/HI/MR), Push notifications, Performance

---

## 🤝 Contributing

1. Fork the project
2. Create your branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'feat: add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

## 👩‍💻 Author

**Vaishnavi Chaudhari**

[![GitHub](https://img.shields.io/badge/GitHub-vaishnavichaudhari910-black?logo=github)](https://github.com/vaishnavichaudhari910)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin)](https://linkedin.com/in/your-profile)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-purple)](https://your-portfolio.com)

---

## 🙏 Acknowledgements

[Next.js](https://nextjs.org) · [shadcn/ui](https://ui.shadcn.com) · [Prisma](https://prisma.io) · [Neon](https://neon.tech) · [Cloudinary](https://cloudinary.com) · [TanStack Query](https://tanstack.com/query) · [Framer Motion](https://framer.com/motion) · [Vercel](https://vercel.com)

---

<div align="center">
  <strong>⭐ Star this repo if you found it helpful!</strong>
  <br/>
  Built with ❤️ by Vaishnavi Chaudhari · Pune, India
</div>
