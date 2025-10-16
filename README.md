# 🏡 Property Tracker

A simple web app for tracking properties and their estimated valuations over time.  
Built with **React, TypeScript, Prisma, and Express**.

---

## ✨ Features

- 🏠 List of all properties with latest valuation and % growth since the last one  
- 📈 Property detail view showing full valuation history and a **line chart** of growth or decline  
- ➕ Add new properties (name + address)  
- 💰 Add new valuations (amount + date)  
- 🗄️ Persistent storage with SQLite via Prisma ORM  
- ⚡ Fast, minimal frontend built with React + Vite

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React, TypeScript, Vite, React Query, React Router, React Hook Form, Zod, Recharts |
| Backend | Node.js, Express, Prisma |
| Database | SQLite |
| Validation | Zod |
| Styling | Simple custom CSS |

---

## 🚀 Getting Started

Clone the repository
```bash
git clone https://github.com/<your-username>/property-tracker.git
cd property-tracker

Install dependencies
```bash
Backend
cd server
npm install
npx prisma generate
npm run dev



