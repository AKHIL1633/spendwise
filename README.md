# SpendWise 💰

> A full-stack personal finance tracker built with **Next.js 14**, **TypeScript**, **NextAuth.js**, and **Prisma + PostgreSQL**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-brightgreen?style=flat-square)](https://spendwise.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square)](https://nextjs.org/)

## ✨ Features

- **Authentication** — Secure login/register with NextAuth.js (JWT sessions)
- **Transaction Tracking** — Add income & expense with category, date, and notes
- **Stats Dashboard** — Live totals for income, expenses, net balance
- **Category Pie Chart** — Visual breakdown of spending by category
- **Monthly Bar Chart** — 6-month income vs expense trend (Recharts)
- **Protected Routes** — Middleware guards all dashboard pages
- **REST API** — Typed Next.js Route Handlers with session validation

## 🛠️ Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Framework      | Next.js 14 (App Router)             |
| Language       | TypeScript (strict mode)            |
| Auth           | NextAuth.js v4 (JWT + Credentials)  |
| Database       | PostgreSQL via Prisma ORM           |
| Charts         | Recharts                            |
| Styling        | Tailwind CSS                        |
| Cloud DB       | Supabase (free tier)                |
| CI/CD          | GitHub Actions → Vercel             |

## 🚀 Getting Started

```bash
git clone https://github.com/AKHIL1633/spendwise.git
cd spendwise
npm install
```

### Set up environment
```bash
cp .env.example .env.local
# Fill in DATABASE_URL from Supabase and a NEXTAUTH_SECRET
```

### Connect database
```bash
npx prisma db push   # Create tables
npx prisma studio    # View data
```

### Run
```bash
npm run dev
# Open http://localhost:3000
# Demo login: demo@spendwise.app / demo1234
```

## 🌐 API Reference

| Method | Endpoint                 | Description              |
|--------|--------------------------|--------------------------|
| GET    | `/api/transactions`      | Fetch all + stats/charts |
| POST   | `/api/transactions`      | Create transaction       |
| DELETE | `/api/transactions/:id`  | Delete transaction       |

## 📄 License

MIT © P Akhil
