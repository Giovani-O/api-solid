# API Solid - Gym Management System

A GymPass-style API built with Fastify, TypeScript, and Prisma for managing gyms, check-ins, and user authentication.

## Features

### User Management
- [x] User registration with email and password
- [x] User authentication with JWT (access token + refresh token)
- [x] Profile retrieval for authenticated users
- [x] Role-based access control (ADMIN, MEMBER)

### Gym Management
- [x] Create gyms with location coordinates (ADMIN only)
- [x] Search gyms by name (paginated)
- [x] Find nearby gyms based on user location

### Check-in System
- [x] Check-in at gyms with location validation (100m radius)
- [x] View check-in history (paginated)
- [x] View check-in metrics (total count)
- [x] Validate check-ins within 20 minutes (ADMIN only)

## Business Rules

- Users cannot register with duplicate emails
- Users can only check in once per day per gym
- Check-ins require proximity to gym (100 meters)
- Check-in validation only possible within 20 minutes of creation
- Gym creation restricted to ADMIN role
- Check-in validation restricted to ADMIN role

## Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Fastify 5
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with refresh tokens
- **Validation:** Zod
- **Testing:** Vitest (unit + e2e)
- **Linting/Formatting:** Biome
- **Build:** tsup

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Register new user |
| POST | `/sessions` | Authenticate user |
| PATCH | `/token/refresh` | Refresh JWT token |
| GET | `/me` | Get user profile |

### Gyms
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/gyms` | Create gym | ADMIN |
| GET | `/gyms/nearby` | Find nearby gyms | USER |
| GET | `/gyms/search` | Search gyms by query | USER |

### Check-ins
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/gyms/:gymId/check-ins` | Create check-in | USER |
| GET | `/check-ins/history` | Get user check-in history | USER |
| GET | `/check-ins/metrics` | Get user check-in metrics | USER |
| PATCH | `/check-ins/:checkInId/validate` | Validate check-in | ADMIN |

## Installation

### Prerequisites
- Node.js 24+
- PostgreSQL
- npm

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd api-solid
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/api-solid?schema=public"
JWT_SECRET="your-secret-key"
NODE_ENV="dev"
PORT=3333
```

4. **Start PostgreSQL (using Docker)**
```bash
docker-compose up -d
```

5. **Run database migrations**
```bash
npx prisma migrate dev
```

6. **Generate Prisma client**
```bash
npx prisma generate
```

## Running the Application

### Development
```bash
npm run dev
```
Server runs on `http://localhost:3333`

### Production Build
```bash
npm run build
npm start
```

## Testing

### Run all tests
```bash
npm test
```

### Unit tests only
```bash
npm run test:unit
npm run test:unit:watch  # watch mode
```

### E2E tests only
```bash
npm run test:e2e
npm run test:e2e:watch  # watch mode
```

### Test with coverage
```bash
npm run test:coverage
```

### Test UI
```bash
npm run test:ui
```

## Code Quality

### Linting
```bash
npx @biomejs/biome lint
```

### Formatting
```bash
npx @biomejs/biome format --write
```

## Database

### Open Prisma Studio
```bash
npm run db:studio
```

## Project Structure

```
api-solid/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── src/
│   ├── http/
│   │   ├── controllers/    # Request handlers
│   │   └── middlewares/    # Auth & role middleware
│   ├── services/           # Business logic
│   │   └── factories/      # Service factories
│   ├── repositories/       # Data access layer
│   │   ├── in-memory/      # Test repositories
│   │   └── prisma/         # Prisma repositories
│   ├── utils/              # Helper functions
│   ├── env.ts              # Environment validation
│   ├── app.ts              # Fastify app setup
│   └── server.ts           # Server entry point
├── tests/                  # Test files
└── package.json
```

## CI/CD

GitHub Actions workflows:
- **Unit Tests:** Runs on push/PR
- **E2E Tests:** Runs on PR with PostgreSQL container

## License

ISC