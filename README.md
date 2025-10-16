# 🏡 Property Tracker

A simple web app for tracking properties and their estimated valuations over time.  
Built with **React, TypeScript, Prisma, and Express**.

---

## 📸 Preview
![Property Tracker Screenshot](preview/screenshot1.png)
![Property Tracker Screenshot](preview/screenshot2.png)

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

### 1️⃣ Setting up the repository
```bash
git clone

### Backend
cd server
npm install
npx prisma generate
npm run dev

### Frontend
cd ../web
npm install
npm run dev




