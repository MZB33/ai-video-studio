This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Docker + Redis + PM2 Startup

This project includes a Docker Compose setup and PM2 ecosystem file for running the app, worker, and Redis together.

### 1. Build and run with Docker Compose

```bash
cd c:\Users\Dell\ai-video-app
docker compose up --build
```

This starts three services:
- `redis` — Redis instance for BullMQ job queue
- `app` — Next.js application
- `worker` — image restore worker process

### 2. Environment variables

Create a `.env` or `.env.local` file with the following values as needed:

```env
REDIS_URL=redis://redis:6379
MODEL_API_URL=
MODEL_API_KEY=
REPLICATE_API_TOKEN=
REPLICATE_MODEL_VERSION=
```

### 3. Run with PM2

Install PM2 globally if needed:

```bash
npm install -g pm2
```

Start both app and worker:

```bash
cd c:\Users\Dell\ai-video-app
npx pm2 start ecosystem.config.js --env production
```

### 4. Systemd service

A sample systemd unit is provided at `systemd/ai-video-app.service`.
Adjust `WorkingDirectory` to your install location and then run:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ai-video-app
sudo systemctl start ai-video-app
```

### Troubleshooting

- If Redis cannot connect, confirm `REDIS_URL` is set correctly and Redis is running on `redis:6379` or your configured host.
- If the worker does not process jobs, make sure the worker process is running with:
  ```bash
  npx pm2 list
  ```
  or check Docker service logs with:
  ```bash
  docker compose logs worker
  ```
- If the app fails to enqueue jobs, verify the `/api/image-restore/jobs` endpoint is reachable and that `REDIS_URL` is available to both the app and worker.
- For sharp fallback issues, install `sharp`:
  ```bash
  npm install sharp
  ```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
