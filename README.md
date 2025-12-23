# 🚪 DataGate

**DataGate** is a secure data access gateway and dashboard that enables controlled, role-based access to database tables and columns without requiring users to write SQL queries. It helps teams explore data safely while keeping sensitive fields protected.

---

## ✨ Features

- 🔐 Role-based access control (RBAC) at table & column level  
- 📊 Dashboard UI to explore data without writing SQL  
- 🗂️ Support for MySQL & PostgreSQL  
- ⚡ High-performance backend with Go & Fiber  
- 🌐 Modern frontend built with Next.js  
- 🧩 Admin controls to decide:
  - Which tables a user/role can access  
  - Which columns are visible per table  
- 📝 Audit logs for access tracking  
- 🔄 API-first architecture  

---

## 🏗️ Architecture

```
[ data-gate-fe (Next.js) ]  --->  [ data-gate-be (Go Fiber) ]  --->  [ SQL DB ]
                                        |
                                 [ Auth & RBAC ]
```

---

## 🛠️ Tech Stack

**Backend – `data-gate-be`**
- Go
- Fiber
- MySQL / PostgreSQL
- JWT Authentication

**Frontend – `data-gate-fe`**
- Next.js
- Tailwind CSS / Shadcn UI

**Others**
- REST APIs

---

## 📁 Repository Structure

```
datagate/
│
├── data-gate-be/   # Go Fiber backend
│   ├── main.go
│   ├── routes/
│   ├── service/
│   ├── models/
│   └── middleware/
│
├── data-gate-fe/   # Next.js frontend
│   ├── app/
│   ├── components/
│   └── pages/
│
└── README.md
```

---

## 🚀 Getting Started

### ✅ Prerequisites
- Go ≥ 1.21  
- Node.js ≥ 18  
- MySQL / PostgreSQL  
- Git  

---

## 📥 Clone the Repository

```bash
git clone https://github.com/your-username/datagate.git
cd datagate
```

---

## ⚙️ Backend Setup (`data-gate-be`)

```bash
cd data-gate-be
go mod tidy
```

Create a `.env` file:

```env
APP_PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=datagate
DB_PASSWORD=datagate
DB_NAME=datagate
JWT_SECRET=supersecret
```

Run the server:

```bash
go run main.go
```

Backend runs at:  
👉 http://localhost:8080

---

## 🎨 Frontend Setup (`data-gate-fe`)

```bash
cd ../data-gate-fe
npm install
npm run dev
```

Frontend runs at:  
👉 http://localhost:3000

---

## 🔑 Core Concepts

### 👤 Users & Roles
Each user is assigned a role (e.g., `admin`, `analyst`, `viewer`).

### 🗃️ Access Rules
Admins configure:
- Allowed tables per role  
- Visible columns per table  

Users only see what they’re permitted to see — sensitive fields stay hidden.

---

## 📚 Example Use Cases

- Business teams viewing data without SQL access  
- Restricting sensitive fields like `email`, `phone`, `salary`  
- Centralized data access across multiple databases  
- Internal data exploration dashboard  

---

## 📡 API Example

```http
GET /api/v1/data/orders
Authorization: Bearer <token>
```

Returns data with only allowed columns based on role.

---

## 🛡️ Security

- JWT-based authentication  
- Column-level data access control  
- Secrets managed via environment variables  
- No raw SQL access for end users  

---

## 🗺️ Roadmap

- [ ] SSO integration  
- [ ] Visual query builder  
- [ ] Performance & caching layer  
- [ ] Multi-tenant support  

---

## 🤝 Contributing

Contributions are welcome!  
Fork the repo and open a PR with improvements.

---

## 📄 License

MIT License
