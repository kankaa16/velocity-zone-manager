# Velocity Zone Manager

A full-stack GIS application for managing autonomous mower zones across large commercial properties. The platform allows operators to manage properties, draw mowing zones, assign mower fleets, import/export GeoJSON, and monitor zone coverage through an interactive map.

Built as part of the **Ottermap × TerraSync AI-Augmented Builder **.

---

## Features

### Authentication
- JWT Authentication
- User Signup & Login
- Protected API routes
- Persistent login

### Property Management
- Create, update and delete properties
- Search properties by name
- Filter by property type
- Property summary dashboard

### Zone Management
- Draw polygon zones on map
- Edit existing zones
- Delete zones
- Assign mower count
- Change zone type & status
- Automatic acreage calculation
- Live fleet recommendation

### GIS
- OpenLayers integration
- GeoJSON Import
- GeoJSON Export
- Polygon editing
- India-wide seeded dataset

### Validation
- Rejects zones with zero assigned mowers
- Computes acreage directly from polygon geometry
- Detects understaffed zones dynamically
- Property summary endpoint

---

# Tech Stack

## Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- OpenLayers
- Axios

## Backend

- Python Flask
- Flask SQLAlchemy
- Flask JWT Extended
- PostgreSQL
- JSONB (GeoJSON storage)
- Shapely

## Infrastructure

- Docker
- Docker Compose
- PostgreSQL 16

---

# Project Structure

```
velocity_zone_manager
│
├── client
│   ├── src
│   ├── public
│   ├── Dockerfile
│   └── package.json
│
├── server
│   ├── app
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── extensions.py
│   │
│   ├── app.py
│   ├── seed.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

# API

## Authentication

```
POST /auth/signup
POST /auth/login
```

---

## Properties

```
GET    /properties
POST   /properties

GET    /properties/:id
PUT    /properties/:id
DELETE /properties/:id
```

---

## Zones

```
GET    /properties/:id/zones
POST   /properties/:id/zones

GET    /zones/:id
PUT    /zones/:id
DELETE /zones/:id
```

---

## GeoJSON

```
POST /properties/:id/zones/import
GET  /properties/:id/zones/export
```

---

## Summary

```
GET /properties/:id/zones/summary
```

Returns

- Total Zones
- Total Acreage
- Total Assigned Mowers
- Understaffed Zones

---

# Database

## User

| Field | Type |
|------|------|
| id | Integer |
| name | String |
| email | String |
| password | String |

---

## Property

| Field | Type |
|------|------|
| id | Integer |
| name | String |
| type | String |
| total_acreage | Float |
| notes | Text |

---

## Zone

| Field | Type |
|------|------|
| id | Integer |
| property_id | FK |
| name | String |
| zone_type | String |
| mower_count | Integer |
| status | String |
| geometry | JSONB |

---

# Geometry Storage

Zone geometries are stored as **GeoJSON inside PostgreSQL JSONB**.

I chose JSONB because it keeps the setup lightweight while still allowing direct storage and retrieval of GeoJSON objects without requiring PostGIS. Since the project mainly focuses on CRUD operations, imports/exports, and polygon-based calculations using Shapely, JSONB was sufficient and kept the Docker setup simple.

For production-scale spatial querying and indexing, PostGIS would be the better choice.

---

# Business Rules

### Zone Validation

Creating or updating a zone with

```
mower_count = 0
```

returns

```
400 Bad Request

A zone must have at least one assigned mower.
```

---

### Understaffed Detection

A zone is considered understaffed when

```
acreage > mower_count × 2
```

This value is computed dynamically and is never stored in the database.

---

# Seed Data

The database is automatically seeded on startup.

Seed includes:

- Demo user
- 227 properties
- 1655 zones
- GeoJSON polygons
- Random mower assignments
- Properties across major Indian cities

Demo Credentials

```
Email:
k@gmail.com

Password:
k12345
```

---

# Running the Project

## Prerequisites

- Docker
- Docker Compose

---

Clone

```bash
git clone <repository-url>

cd velocity_zone_manager
```

---

Start

```bash
docker-compose up --build
```

---

Frontend

```
http://localhost:5174
```

Backend

```
http://localhost:5001
```

Health Check

```
GET /health
```

---

Stop

```bash
docker-compose down
```

Reset database

```bash
docker-compose down -v
```

---

# Environment Variables

```
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=postgres
DB_PORT=5432
DB_NAME=velocity_db

SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
```

---

# AI Workflow

## 1. Which AI tools did you use?

I primarily used Codex as a coding assistant during development. I used it to speed up frontend development, generate realistic seed data for the database, and help draft the project README. All core backend logic, API design, business rules, validation, and application architecture were implemented and verified by me, with any AI-generated content reviewed and adapted before use.

---

## 2. One AI output you accepted without modification

I used Codex to generate a large set of realistic seed data for properties and zones across major Indian cities. The generated dataset matched the required schema, so I used it with only small modifications.

---

## 3. One AI output you rejected

An early Docker Compose config generated by AI had incorrect port mappings and networking assumptions, which caused the frontend to connect to the wrong backend. I rewrote the Compose configuration, fixed the environment variables, and verified everything by rebuilding the project from scratch.

---

## 4. One part you completed without AI

The OpenLayers integration was implemented manually. Drawing polygons, editing geometries, syncing changes with the backend, and handling map interactions required understanding OpenLayers' event lifecycle through documentation and experimentation rather than relying on AI-generated code. Moreover, the backend API implementation was completed without AI. This included designing the database models, implementing CRUD endpoints, JWT authentication, business validation, GeoJSON import/export, and the property summary endpoint.

---

# Future Improvements


- Zone overlap detection
- Mowing path simulation
- Unit tests using pytest
- Role-based access control
- Real-time updates using WebSockets

---

# built by : kanka
