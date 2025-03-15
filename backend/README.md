
# GlobeTrotter API Server

This is the backend server for the GlobeTrotter geography quiz game.

## Setup

1. Copy `.env.example` to `.env` and update the values as needed
2. Install dependencies: `npm install`
3. Start the server: `npm run dev`

## Database Seeding

To populate the database with initial destinations:

```
node utils/seeder.js
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Log in or create a user
- `GET /api/auth/me` - Get current authenticated user

### Destinations

- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/random` - Get a random destination
- `GET /api/destinations/:id` - Get a specific destination

### Users

- `GET /api/users/:id` - Get a user by ID
- `PUT /api/users/stats` - Update user game stats

### Challenges

- `POST /api/challenges` - Create a new challenge
- `GET /api/challenges/:id` - Get a challenge by ID
- `GET /api/challenges/link/:shareId` - Get a challenge by share ID
- `POST /api/challenges/:id/participate` - Participate in a challenge
- `GET /api/challenges/user/:userId` - Get challenges created by a user

## Authentication

The API uses JWT for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your_token_here
```

## Models

- User: Stores user information and game statistics
- Destination: Stores geography locations with clues and facts
- Challenge: Manages challenge information and participants
