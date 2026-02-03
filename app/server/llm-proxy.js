import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { URL } from 'node:url';

if (typeof fetch !== 'function') {
  console.error('Node.js 18+ is required (fetch not available).');
  process.exit(1);
}

const loadEnvFile = (filename) => {
  const filePath = path.resolve(process.cwd(), filename);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
};

loadEnvFile('.env.local');
loadEnvFile('.env');

const PORT = Number(process.env.LLM_PROXY_PORT || 8787);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const UPSTREAM_BASE = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const MAX_BODY_BYTES = Number(process.env.LLM_PROXY_MAX_BODY_BYTES || 1_000_000);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes('*')) return true;
  return ALLOWED_ORIGINS.includes(origin);
};

const setCors = (res, origin) => {
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const readBody = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  let size = 0;

  req.on('data', (chunk) => {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      reject(new Error('Request body too large'));
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });

  req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  req.on('error', reject);
});

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  setCors(res, origin);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = new URL(req.url || '/', 'http://localhost');
  if (req.method !== 'POST' || url.pathname !== '/api/llm/chat/completions') {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  if (!isAllowedOrigin(origin)) {
    res.statusCode = 403;
    res.end('Origin not allowed');
    return;
  }

  if (!OPENAI_API_KEY) {
    res.statusCode = 500;
    res.end('Server missing OPENAI_API_KEY');
    return;
  }

  let body;
  try {
    body = await readBody(req);
  } catch (err) {
    res.statusCode = 413;
    res.end('Payload too large');
    return;
  }

  try {
    const upstreamUrl = new URL('/chat/completions', UPSTREAM_BASE).toString();
    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body
    });

    const responseText = await upstreamResponse.text();
    res.statusCode = upstreamResponse.status;
    res.setHeader('Content-Type', upstreamResponse.headers.get('content-type') || 'application/json');
    res.end(responseText);
  } catch (err) {
    console.error('Upstream request failed:', err);
    res.statusCode = 502;
    res.end('Upstream request failed');
  }
});

server.listen(PORT, () => {
  console.log(`LLM proxy listening on http://localhost:${PORT}`);
});
