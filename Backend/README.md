# Konark Industry — FastAPI Backend

Production-ready Python backend for the Konark Industry e-commerce platform.
Built with FastAPI + MongoDB (via Beanie ODM) + async throughout.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | FastAPI 0.115 |
| Database | MongoDB + Beanie ODM |
| Async driver | Motor |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Email | aiosmtplib (Gmail SMTP) |
| Server | Uvicorn |
| Container | Docker + docker-compose |

---

## Local Setup (Manual)

```bash
# 1. Clone the monorepo and enter the Backend folder
git clone <repo-url>
cd KONARK-INDUSTRY/Backend

# 2. Create and activate virtual environment
python -m venv venv
source venv/bin/activate          # Linux / Mac
# venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Open .env and fill in:
#   SECRET_KEY  — run: python -c "import secrets; print(secrets.token_hex(32))"
#   MONGODB_URL — use Atlas URI for production
#   SMTP_PASSWORD — Gmail App Password (see below)

# 5. Create admin user
python scripts/create_admin.py

# 6. Seed all 19 products into MongoDB
python scripts/seed_products.py

# 7. Start the development server
uvicorn app.main:app --reload --port 8000
```

API is available at:
- **Swagger UI** → http://localhost:8000/api/docs
- **ReDoc**       → http://localhost:8000/api/redoc
- **Health**      → http://localhost:8000/api/health

---

## Docker Setup (Recommended for Production)

```bash
# Start API + MongoDB + Mongo Express with one command
docker-compose up -d

# Run seed scripts inside the container
docker exec konark-api python scripts/create_admin.py
docker exec konark-api python scripts/seed_products.py
```

| Service | URL |
|---------|-----|
| API | http://localhost:8000/api/docs |
| Mongo Express | http://localhost:8081 (admin / konark2024) |

---

## MongoDB Atlas (Production)

1. Go to https://cloud.mongodb.com → create a free M0 cluster
2. Create a database user with username + password
3. Whitelist your server IP (or 0.0.0.0/0 for dev)
4. Get your connection string and set in `.env`:

```
MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net
MONGODB_DB_NAME=konark_industry
```

---

## Gmail App Password (for SMTP)

Gmail SMTP requires an App Password, not your regular account password.

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to **App Passwords** → Select app: Mail → Select device: Other
4. Copy the 16-character password
5. Set `SMTP_PASSWORD=xxxx xxxx xxxx xxxx` in `.env`

---

## API Endpoints

### Auth  `/api/v1/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | Public | Create customer account |
| POST | `/login` | Public | Login, returns JWT pair |
| POST | `/refresh` | Public | Refresh access token |
| GET | `/me` | User | Get profile |
| PUT | `/me` | User | Update profile |
| POST | `/logout` | Public | Client-side logout |

### Products  `/api/v1/products`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Public | List with filters |
| GET | `/{slug}` | Public | Single product |
| POST | `/` | Admin | Create product |
| PUT | `/{slug}` | Admin | Update product |
| DELETE | `/{slug}` | Admin | Soft delete |

### Enquiries  `/api/v1/enquiries`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Public | Submit enquiry |
| GET | `/` | Admin | List with filters |
| GET | `/{id}` | Admin | Single enquiry |
| PATCH | `/{id}` | Admin | Update status / notes |
| DELETE | `/{id}` | Admin | Hard delete |

### Orders  `/api/v1/orders`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Optional | Place order (guest or user) |
| GET | `/` | User/Admin | List orders |
| GET | `/{order_number}` | User/Admin | Single order |
| PATCH | `/{order_number}/status` | Admin | Update status |

### Service Bookings  `/api/v1/services`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/bookings` | Public | Create booking |
| GET | `/bookings` | Admin | List with filters |
| GET | `/bookings/{id}` | Admin | Single booking |
| PATCH | `/bookings/{id}` | Admin | Assign technician / status |
| DELETE | `/bookings/{id}` | Admin | Hard delete |

### Admin  `/api/v1/admin`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/stats` | Admin | Dashboard KPIs |
| GET | `/recent-activity` | Admin | Last 10 events |
| GET | `/customers` | Admin | List all customers |
| PATCH | `/customers/{id}/toggle` | Admin | Activate / deactivate |

---

## Business Rules

- **GST**: 18% added to product subtotal
- **Delivery**: Free for orders ≥ ₹5,000; ₹199 below that
- **Order numbers**: `KI-YYYY-NNNNN` (e.g. KI-2024-00042)
- **Booking numbers**: `KB-YYYY-NNNNN` (e.g. KB-2024-00007)
- **Passwords**: bcrypt-hashed, never stored plain
- **Soft delete**: Products are marked `is_active=False`, not removed

---

## Environment Variables

See `.env.example` for the full list with descriptions.

---

## Running Tests

```bash
pip install -r requirements-dev.txt
pytest tests/ -v
```
