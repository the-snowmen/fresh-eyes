#!/usr/bin/env node
// fresh-eyes — SessionStart state digest.
//
// Emits a compact status digest ONLY when the project already has fresh-eyes
// review state (./fresh-eyes/ with _app.md or a _synthesis-*.md). Prints
// nothing anywhere else — this hook never nags projects that don't use
// fresh-eyes. Zero deps, silent on any failure, always exits 0.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const MAX_OUT = 1600; // hard cap on injected bytes
const GIT_TIMEOUT_MS = 1200;

function read(p, cap) {
  try {
    const st = fs.lstatSync(p);
    if (st.isSymbolicLink() || !st.isFile()) return '';
    const fd = fs.openSync(p, fs.constants.O_RDONLY);
    try {
      const size = Math.min(st.size, cap);
      const buf = Buffer.alloc(size);
      fs.readSync(fd, buf, 0, size, 0);
      return buf.toString('utf8');
    } finally {
      fs.closeSync(fd);
    }
  } catch (e) {
    return '';
  }
}

function git(dir, args) {
  try {
    return execFileSync('git', ['-C', dir].concat(args), {
      timeout: GIT_TIMEOUT_MS,
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 65536,
    }).toString('utf8').trim();
  } catch (e) {
    return null;
  }
}

function isDir(p) {
  try { return fs.statSync(p).isDirectory(); } catch (e) { return false; }
}

function hasState(feDir) {
  try {
    if (fs.statSync(path.join(feDir, '_app.md')).isFile()) return true;
  } catch (e) { /* no card */ }
  try {
    return fs.readdirSync(feDir).some((f) => /^_synthesis-.+\.md$/.test(f));
  } catch (e) {
    return false;
  }
}

function resolveRoot() {
  const candidates = [];
  if (process.env.CLAUDE_PROJECT_DIR && isDir(process.env.CLAUDE_PROJECT_DIR)) {
    candidates.push(process.env.CLAUDE_PROJECT_DIR);
  }
  candidates.push(process.cwd());
  for (const c of candidates) {
    if (hasState(path.join(c, 'fresh-eyes'))) return c;
  }
  const top = git(process.cwd(), ['rev-parse', '--show-toplevel']);
  if (top && hasState(path.join(top, 'fresh-eyes'))) return top;
  return null;
}

// 4th bold number in the "| **Average** | ... |" scoreboard row = Overall avg.
function averageOverall(synthText) {
  const row = (synthText.match(/^\|\s*\*\*Average\*\*.*$/m) || [])[0];
  if (!row) return null;
  const nums = [...row.matchAll(/\*\*\s*([0-9]+(?:\.[0-9]+)?)\s*\*\*/g)].map((m) => parseFloat(m[1]));
  return nums.length >= 4 && Number.isFinite(nums[3]) ? nums[3] : null;
}

function sliceSection(doc, heading) {
  const start = doc.indexOf(heading);
  if (start === -1) return '';
  const rest = doc.slice(start + heading.length);
  const next = rest.search(/^## /m);
  return next === -1 ? rest : rest.slice(0, next);
}

function numberedRows(section) {
  return (section.match(/^\|\s*\d+\s*\|.*$/gm) || []);
}

function rowNumber(row) {
  return parseInt((row.match(/^\|\s*(\d+)\s*\|/) || [])[1], 10);
}

try {
  const root = resolveRoot();
  if (!root) process.exit(0);
  const fe = path.join(root, 'fresh-eyes');

  const entries = (() => { try { return fs.readdirSync(fe); } catch (e) { return []; } })();

  // The name is repo-file content headed for model context — keep it a short label.
  const appName = (((read(path.join(fe, '_app.md'), 4096).match(/^#\s*App card:\s*(.+)$/m) || [])[1] || '')
    .replace(/[^\w .,:()@/+-]/g, ' ').trim().slice(0, 64))
    || path.basename(root);

  // Versions are usually YYYY-MM-DD(-suffix), but --version allows arbitrary
  // labels — order by date prefix when present, file mtime otherwise.
  const versionsOf = (re, prefix) => entries
    .map((f) => (f.match(re) || [])[1])
    .filter(Boolean)
    .map((v) => {
      const d = (v.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1];
      let key = d ? Date.parse(d) : NaN;
      if (!Number.isFinite(key)) {
        try { key = fs.lstatSync(path.join(fe, `${prefix}${v}.md`)).mtimeMs; } catch (e) { key = 0; }
      }
      return { v, key };
    })
    .sort((a, b) => (b.key - a.key) || b.v.localeCompare(a.v)); // newest first
  const synthVersions = versionsOf(/^_synthesis-(.+)\.md$/, '_synthesis-');
  const decVersions = versionsOf(/^_decisions-(.+)\.md$/, '_decisions-');
  const newest = synthVersions[0] ? synthVersions[0].v : null;
  const decNewest = decVersions[0] ? decVersions[0].v : null;

  const nowAvg = newest ? averageOverall(read(path.join(fe, `_synthesis-${newest}.md`), 8192)) : null;
  const prevAvg = synthVersions[1]
    ? averageOverall(read(path.join(fe, `_synthesis-${synthVersions[1].v}.md`), 8192)) : null;
  let trend = null;
  if (nowAvg != null && prevAvg != null) {
    const d = nowAvg - prevAvg;
    trend = `${prevAvg} → ${nowAvg} (${d >= 0 ? '+' : ''}${Math.round(d * 10) / 10})`;
  } else if (nowAvg != null) {
    trend = String(nowAvg);
  }

  let pending = null;
  let fixTotal = null;
  let appliedCount = 0;
  if (decNewest) {
    const doc = read(path.join(fe, `_decisions-${decNewest}.md`), 32768);
    const fixNums = numberedRows(sliceSection(doc, '## Decisions'))
      .filter((r) => /FIX-now/i.test(r)).map(rowNumber).filter(Number.isFinite);
    const appliedNums = numberedRows(sliceSection(doc, '## Applied'))
      .map(rowNumber).filter(Number.isFinite);
    appliedCount = appliedNums.length;
    fixTotal = fixNums.length;
    pending = fixNums.filter((n) => !appliedNums.includes(n)).length;
  }

  let daysAgo = null;
  let commitsSince = null;
  const lastDate = newest && (newest.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1];
  if (lastDate) {
    const ms = Date.now() - Date.parse(`${lastDate}T00:00:00`);
    if (Number.isFinite(ms)) daysAgo = Math.max(0, Math.floor(ms / 86400000));
    const out = git(root, ['rev-list', '--count', `--since=${lastDate}T23:59:59`, 'HEAD']);
    const n = out === null ? NaN : parseInt(out, 10);
    if (Number.isFinite(n)) commitsSince = n;
  }

  let next;
  if (!newest) next = '/fresh-eyes:fresh-eyes-review';
  else if (decNewest === newest && pending > 0) {
    next = appliedCount > 0 ? '/fresh-eyes:fresh-eyes-apply --continue' : '/fresh-eyes:fresh-eyes-apply';
  } else if (!decNewest || decVersions[0].key < synthVersions[0].key) next = '/fresh-eyes:fresh-eyes-decide';
  else next = '/fresh-eyes:fresh-eyes-run';

  const lines = [
    '[fresh-eyes] This project has fresh-eyes review state in ./fresh-eyes/.',
    `App: ${appName} · last review: ${newest || 'none yet (app card only)'}` +
      (daysAgo != null
        ? ` (${daysAgo}d ago${commitsSince != null ? `, ${commitsSince} commits since` : ''})`
        : ''),
    trend ? `Score: overall ${trend} (cast average)` : null,
    decNewest != null && pending != null
      ? `Open: ${pending} of ${fixTotal} FIX-now items in _decisions-${decNewest}.md not yet in the Applied table`
      : null,
    `Suggested next: ${next}`,
    '(Status digest only — fresh-eyes commands are expensive browser runs; do not invoke unless the user asks.)',
  ].filter(Boolean);

  process.stdout.write(lines.join('\n').slice(0, MAX_OUT));
} catch (e) {
  // silent-fail, always
}
process.exit(0);
