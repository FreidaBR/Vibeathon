#!/usr/bin/env node
/**
 * Start both API server and Vite dev server.
 * Cross-platform - works on Windows, Mac, Linux.
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const serverDir = path.join(root, 'server');

console.log('\n  Starting Vibeathon...\n');
console.log('  [1/2] API server  -> http://localhost:3001');
console.log('  [2/2] Web app     -> http://localhost:5173\n');
console.log('  Open http://localhost:5173 in your browser.\n');

const isWindows = process.platform === 'win32';

const api = spawn('node', ['index.js'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: isWindows,
});

const vite = spawn('npx', ['vite'], {
  cwd: root,
  stdio: 'inherit',
  shell: isWindows,
});

const exit = (code) => {
  api.kill('SIGTERM');
  vite.kill('SIGTERM');
  process.exit(code || 0);
};

api.on('error', (err) => {
  console.error('Failed to start API server:', err.message);
  exit(1);
});

vite.on('error', (err) => {
  console.error('Failed to start Vite:', err.message);
  exit(1);
});

api.on('exit', (code) => {
  if (code !== 0 && code !== null) exit(code);
});

vite.on('exit', (code) => exit(code));

process.on('SIGINT', () => exit(0));
process.on('SIGTERM', () => exit(0));
