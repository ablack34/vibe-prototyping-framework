# VIBE Web Surface — container image (Phase 1 / deployment de-risk).
#
# Bakes in the two host tools server.mjs shells out to:
#   - GitHub CLI (`gh`)              — runs as the service identity via GH_TOKEN
#   - Python + MarkItDown            — Office/PDF -> Markdown at source ingest
#
# Build from the REPO ROOT (the server imports ../scripts/gates-lib.mjs):
#   docker build -f surface/Dockerfile -t vibe-surface .
# Run (token passed from the host env, never baked into the image):
#   docker run --rm -e GH_TOKEN -e PORT=4310 -p 4310:4310 vibe-surface
FROM node:20-bookworm-slim

# --- GitHub CLI + Python toolchain ---
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
       ca-certificates curl gnupg git python3 python3-pip python3-venv \
  && mkdir -p -m 755 /etc/apt/keyrings \
  && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
       -o /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
       > /etc/apt/sources.list.d/github-cli.list \
  && apt-get update \
  && apt-get install -y --no-install-recommends gh \
  && rm -rf /var/lib/apt/lists/*

# --- MarkItDown (isolated venv; Debian marks the system env externally-managed) ---
RUN python3 -m venv /opt/markitdown \
  && /opt/markitdown/bin/pip install --no-cache-dir "markitdown[docx,pptx,xlsx,pdf]"
ENV MARKITDOWN_PYTHON=/opt/markitdown/bin/python

WORKDIR /app
COPY . /app

ENV PORT=4310
EXPOSE 4310
CMD ["node", "surface/server.mjs"]
