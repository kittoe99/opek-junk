#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

const TOKEN = process.env.GH_TOKEN;
if (!TOKEN) {
  console.error('Set GH_TOKEN env var before running npm run push');
  process.exit(1);
}
const OWNER = 'kittoe99';
const REPO = 'opek-junk';
const BRANCH = 'master';
const MSG = process.argv[2] || 'Fast push from CLI';

function api(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.github.com',
      path: endpoint,
      method,
      headers: {
        'Authorization': 'Bearer ' + TOKEN,
        'User-Agent': 'opek-push',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve({ raw: data, status: res.statusCode }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function pushFile(filePath, baseDir) {
  const fullPath = path.join(baseDir, filePath);
  if (!fs.existsSync(fullPath)) return '  (missing) ' + filePath;
  const content = Buffer.from(fs.readFileSync(fullPath, 'utf8')).toString('base64');

  const getRes = await api('GET', '/repos/' + OWNER + '/' + REPO + '/contents/' + filePath + '?ref=' + BRANCH);
  const sha = getRes.sha;

  const payload = { message: MSG, content: content, branch: BRANCH };
  if (sha) payload.sha = sha;

  const pushRes = await api('PUT', '/repos/' + OWNER + '/' + REPO + '/contents/' + filePath, payload);
  return pushRes.content ? '  ' + filePath : '  ' + filePath + ' - FAILED (' + (pushRes.status || pushRes.message || '') + ')';
}

async function main() {
  const baseDir = process.cwd();
  const [, , ...args] = process.argv;
  let files;

  if (args.length > 0) {
    files = args;
  } else {
    try {
      const { execSync } = require('child_process');
      const diff = execSync('git diff --name-only HEAD', { cwd: baseDir }).toString().trim();
      files = diff ? diff.split('\n') : [];
    } catch {
      console.log('Usage: npm run push -- <file1> <file2> ...');
      process.exit(1);
    }
  }

  if (files.length === 0) { console.log('No files.'); return; }
  console.log('Pushing ' + files.length + ' files...');
  const results = await Promise.all(files.map((f) => pushFile(f, baseDir)));
  results.filter(Boolean).forEach((r) => console.log(r));
  console.log('Done.');
}

main().catch(console.error);
