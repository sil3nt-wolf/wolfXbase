# wolfXbase — MongoDB Management Dashboard

> **Self-hosted MongoDB management, built for developers who move fast.**
> By **WOLF TECH ~ Silent Wolf**

![wolfXbase](https://i.ibb.co/SwYFJBQN/Screenshot-2026-04-14-165928.png)

---

## What is wolfXbase?

**wolfXbase** is a sleek, self-hosted MongoDB dashboard that lets you connect to any MongoDB instance, explore your databases and collections, browse documents in real time, and manage users — all from a clean, neon-themed web interface.

Built with a cyberpunk aesthetic and zero bloat, wolfXbase is designed to be fast, private, and entirely under your control. No cloud lock-in, no subscription fees — just your data, your server, your rules.

---

## Live Instance

The official hosted instance is live at:

**[https://database.xwolf.space](https://database.xwolf.space)**

Deployed on a private VPS running Node.js on port `3001` behind an Nginx reverse proxy with SSL via Let's Encrypt (Certbot). The service runs as a `systemd` unit for reliability and auto-restart on failure.

---

## Features

- **Multi-app connections** — connect to multiple MongoDB instances simultaneously
- **Database & collection browser** — navigate databases, collections, and documents with pagination
- **Document viewer** — formatted JSON view of all stored documents
- **User management** — manage dashboard access with admin and user roles
- **Real-time stats** — storage sizes, document counts, and connection status at a glance
- **Atlas Data API-compatible HTTP API** — drop-in REST endpoint for your apps
- **Secure authentication** — session-based login protecting all dashboard routes
- **Neon cyberpunk UI** — Orbitron + Share Tech Mono fonts, pure black background, neon green accents
- **Self-hostable** — runs anywhere Node.js runs; no cloud dependencies

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Node.js + Express |
| Database driver | MongoDB Node.js Driver |
| Auth | Express sessions |
| Deployment | VPS + systemd + Nginx + Certbot (Let's Encrypt) |

---

## Getting Started

### Requirements

- Node.js v18 or later
- npm v8 or later
- A running MongoDB instance (local or remote)
- Linux VPS (Ubuntu 20.04+ recommended for production)

### Install & Run

```bash
git clone https://github.com/sil3nt-wolf/wolf-mongoDB.git
cd wolf-mongoDB

# Install server dependencies
npm install

# Install and build the client
cd client && npm install && npm run build && cd ..

# Start the server
node server.js
```

The dashboard will be available at `http://localhost:3001`.

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3001
SESSION_SECRET=replace-with-a-long-random-secret
```

> Never commit your `.env` file — it is already listed in `.gitignore`.

---

## Dashboard Preview

![wolfXbase Databases View](attached_assets/image_1776123574227.png)

Browse your databases and collections, view paginated documents in formatted JSON, and navigate seamlessly between apps — all from one dashboard.

---

## Connecting a Database

1. Log in to the dashboard
2. Go to **Apps** → **New App**
3. Paste your MongoDB connection string, e.g.:
   ```
   mongodb://user:password@host:27018/dbname?authSource=admin
   ```
4. Save — wolfXbase connects instantly and shows your databases, collections, and documents

---

## Deployment (VPS with systemd)

### 1. Clone to your server

```bash
git clone https://github.com/sil3nt-wolf/wolf-mongoDB.git /opt/mongodash
cd /opt/mongodash
npm install
cd client && npm install && npm run build && cd ..
```

### 2. Create a systemd service

```ini
# /etc/systemd/system/mongodash.service
[Unit]
Description=wolfXbase MongoDB Dashboard
After=network.target

[Service]
WorkingDirectory=/opt/mongodash
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
systemctl enable mongodash
systemctl start mongodash
```

### 3. Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name your.domain.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your.domain.com
```

---

## Updating

```bash
cd /opt/mongodash
git pull origin main
cd client && npm run build && cd ..
systemctl restart mongodash
```

---

## HTTP API

wolfXbase exposes an **Atlas Data API-compatible** REST endpoint for external apps.

**Base URL:**
```
https://your.domain.com/app/data-api/endpoint/data/v1/action/{action}
```

**Example — insert a document:**

```bash
curl -X POST "https://your.domain.com/app/data-api/endpoint/data/v1/action/insertOne" \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "database": "myapp",
    "collection": "users",
    "document": { "name": "Alice", "email": "alice@example.com" }
  }'
```

Full API reference is available in the **Docs** section of the dashboard.

---

## License

See [LICENSE](LICENSE) for full terms.

---

## Built by

**WOLF TECH ~ Silent Wolf**
Support: [support@wolftech.dev](mailto:support@wolftech.dev)
Live dashboard: [https://database.xwolf.space](https://database.xwolf.space)
