

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
<img width="1917" height="871" alt="image" src="https://github.com/user-attachments/assets/e5b8ba58-d55e-4d53-b82e-d2283e046f3b" />

<img width="1917" height="865" alt="image" src="https://github.com/user-attachments/assets/076c6f64-ea33-413c-b6c2-dc28d7ec45d4" />
<img width="1917" height="857" alt="image" src="https://github.com/user-attachments/assets/63d02589-90fa-4bf1-9334-eab42fd94c41" />
<img width="1917" height="863" alt="image" src="https://github.com/user-attachments/assets/52ca9b7a-ec35-485a-aebf-be49c82ebc84" />
<img width="1917" height="872" alt="image" src="https://github.com/user-attachments/assets/9aacfb54-2e28-4ab8-81f3-5720b4711fc9" />

---

### 📊 Citizen Dashboard
<img width="1917" height="881" alt="image" src="https://github.com/user-attachments/assets/ccfde307-4039-4697-aaec-dd2f5484df46" />

---

### 📋 My Bookings
<img width="1916" height="866" alt="image" src="https://github.com/user-attachments/assets/8f8cae74-8dcb-46d5-b01f-71e6135da60d" />




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


<div align="center">
  <strong>⭐ Star this repo if you found it helpful!</strong>
  <br/>
  Built with ❤️ by Vaishnavi Chaudhari · Pune, India
</div>
