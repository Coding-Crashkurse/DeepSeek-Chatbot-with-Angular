### Fullstack DeepSeek Chatbot

A full-stack chatbot project using the **DeepSeek R1** model with Ollama, featuring:

- Angular frontend
- FastAPI backend
- Postgres database
- Nginx reverse proxy
- Ollama for model inference

---

### Docker Compose Services

**nginx**

- Listens on ports 80 & 443
- Loads SSL certs from `/etc/letsencrypt` on the host (read-only mount)
- Proxies requests to the Angular frontend, FastAPI backend, and Ollama

**ollama**

- Runs the deepseek-r1 model
- Exposes port 11435 for the backend to call

**db (Postgres)**

- Internal database store (not publicly exposed)

**backend (FastAPI)**

- Provides API routes for chatbot requests
- Calls Ollama for inference

**frontend (Angular)**

- Single-page app, served via Nginx

---

### Workflow

1. **Nginx** handles incoming requests on ports 80 (HTTP) or 443 (HTTPS).
2. The **Angular** frontend is at the root path.
3. The **backend** is proxied at `/api/`.
4. **Ollama** is proxied at `/ollama/`.
5. The **backend** calls Ollama to generate chat responses with the deepseek-r1:7b model.

---

### Deployment Steps

```shell
# 1) Install Certbot (Snap-Based)
sh ./setup_certs.sh
# Installs snapd, removes old Certbot, and sets up Certbot from snap.

# 2) Stop Any Host-Level Nginx
sudo systemctl stop nginx
sudo systemctl disable nginx
# Ensures Docker can bind ports 80/443.

# 3) Obtain SSL Certificate
sudo certbot certonly --nginx -d yourdomain.com
# Or use --webroot if preferred, ensuring certs end up in /etc/letsencrypt/live/yourdomain.com

# 4) Deploy Docker Compose
sh ./deploy.sh
# Replaces "yourdomain.com" in default.conf.production, then starts all containers (nginx, backend, etc.)

# 5) Pull the DeepSeek Model
sh ./download.sh
# Enter the model name (e.g. deepseek-r1:7b). It downloads into the ollama container.
```

Have fun :-)
