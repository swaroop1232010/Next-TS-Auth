## Prerequisites

- Node.js 20.x (Recommended)

## Installation

**Using Yarn (Recommended)**

```sh
yarn install
yarn dev
```

**Using Npm**

```sh
npm i
npm run dev
```

## Build

```sh
yarn build
# or
npm run build
```

**NOTE:**

#### Add the following in your .env file

```sh
# App
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_SERVER_URL=http://localhost:8083
NEXT_PUBLIC_ASSET_URL=https://api-dev-minimal-v6.vercel.app

# Mapbox
NEXT_PUBLIC_MAPBOX_API_KEY=

# FIREBASE
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APPID=

# MongoDB connection
DATABASE_URI=

# JWT
JWT_SECRET_KEY=
```
