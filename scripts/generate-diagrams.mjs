// Generates SVG diagrams for the thesis and converts them to PNG so the
// docx generator can embed them as images. All diagrams are hand-coded SVG —
// no external mermaid/plantuml install required.
//
// Run: node scripts/generate-diagrams.mjs

import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'thesis-figures');
mkdirSync(OUT_DIR, { recursive: true });

// ─── style helpers ────────────────────────────────────────────────────────────
const C = {
  primary: '#5b4bff',
  primaryFill: '#eceaff',
  accent: '#06b6a3',
  accentFill: '#dcf6f0',
  warning: '#f59e0b',
  danger: '#ef4444',
  ink: '#101828',
  muted: '#475467',
  border: '#cbd5e1',
  bg: '#ffffff',
  surface: '#f8fafc',
};

function svg(width, height, body, bg = C.bg) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <style>
    text { font-family: 'Helvetica', 'Arial', sans-serif; fill: ${C.ink}; }
    .title { font-size: 20px; font-weight: 700; }
    .label { font-size: 14px; }
    .small { font-size: 12px; fill: ${C.muted}; }
    .mono { font-family: 'Menlo', 'Consolas', monospace; font-size: 12px; }
    .arrow { stroke: ${C.muted}; stroke-width: 1.5; fill: none; marker-end: url(#arrow); }
    .arrow-thick { stroke: ${C.primary}; stroke-width: 2; fill: none; marker-end: url(#arrowP); }
    .box { fill: ${C.bg}; stroke: ${C.border}; stroke-width: 1.5; }
    .box-primary { fill: ${C.primaryFill}; stroke: ${C.primary}; stroke-width: 1.5; }
    .box-accent { fill: ${C.accentFill}; stroke: ${C.accent}; stroke-width: 1.5; }
    .actor-circle { fill: ${C.bg}; stroke: ${C.ink}; stroke-width: 2; }
    .usecase { fill: ${C.bg}; stroke: ${C.primary}; stroke-width: 1.5; }
  </style>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="${C.muted}"/>
    </marker>
    <marker id="arrowP" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="${C.primary}"/>
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="${bg}"/>
  ${body}
</svg>`;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function box(x, y, w, h, label, opts = {}) {
  const klass = opts.cls ?? 'box';
  const r = opts.r ?? 8;
  const labels = String(label).split('\n').map(esc);
  const lineH = 16;
  const startY = y + h / 2 - ((labels.length - 1) * lineH) / 2 + 5;
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" class="${klass}"/>
    ${labels
      .map(
        (l, i) =>
          `<text x="${x + w / 2}" y="${startY + i * lineH}" text-anchor="middle" class="label">${l}</text>`
      )
      .join('')}
  </g>`;
}

function arrow(x1, y1, x2, y2, label = '', cls = 'arrow') {
  let g = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
  if (label) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    g += `<rect x="${mx - label.length * 4 - 6}" y="${my - 11}" width="${label.length * 8 + 12}" height="18" fill="${C.bg}" />
          <text x="${mx}" y="${my + 3}" text-anchor="middle" class="small">${esc(label)}</text>`;
  }
  return g;
}

function title(t, x = 20, y = 28) {
  return `<text x="${x}" y="${y}" class="title">${esc(t)}</text>`;
}

async function write(name, svgString) {
  const svgPath = resolve(OUT_DIR, name + '.svg');
  const pngPath = resolve(OUT_DIR, name + '.png');
  writeFileSync(svgPath, svgString);
  await sharp(Buffer.from(svgString)).png({ quality: 95 }).toFile(pngPath);
  console.log('✓', name);
}

// ─── 1. System Architecture ──────────────────────────────────────────────────
const architecture = svg(
  900,
  560,
  [
    title('System Architecture (3-tier)'),
    // client tier
    box(40, 80, 820, 110, '', { cls: 'box-primary' }),
    `<text x="60" y="110" class="label" font-weight="700">Client Tier — Browser</text>`,
    box(70, 130, 200, 50, 'React UI\n(Next.js App Router)'),
    box(290, 130, 200, 50, 'MediaPipe Pose\n(WASM, on-device CV)'),
    box(510, 130, 200, 50, 'AuthContext\n(JWT cookie)'),
    box(720, 130, 130, 50, 'Tailwind\nDesign System'),
    // API tier
    box(40, 230, 820, 110, '', { cls: 'box-accent' }),
    `<text x="60" y="260" class="label" font-weight="700">API Tier — Next.js Route Handlers (Node runtime)</text>`,
    box(70, 280, 160, 50, 'Auth & Roles\n(withRole HOF)'),
    box(250, 280, 160, 50, 'Workout API\n+ Stats Aggregator'),
    box(430, 280, 160, 50, 'Coach + Messaging\nAPI'),
    box(610, 280, 160, 50, 'Admin + Audit'),
    box(790, 280, 60, 50, 'Stripe\nWebhook'),
    // data tier
    box(40, 380, 820, 130, ''),
    `<text x="60" y="410" class="label" font-weight="700">Data Tier</text>`,
    box(70, 430, 200, 60, 'MongoDB\nUsers · Sessions · Plans'),
    box(290, 430, 200, 60, 'MongoDB\nCoachClient · Notes · Messages'),
    box(510, 430, 180, 60, 'MongoDB\nAudit · RateLimit · Tokens'),
    box(710, 430, 140, 60, 'OpenAI API\n(Pro tier only)', { cls: 'box-primary' }),
    // arrows
    arrow(450, 190, 450, 230, '', 'arrow-thick'),
    arrow(450, 340, 450, 380, '', 'arrow-thick'),
    `<text x="20" y="540" class="small">Vertical arrows show request/response between tiers; cross-tier security via JWT in HTTP-only cookies.</text>`,
  ].join('\n')
);
await write('fig_architecture', architecture);

// ─── 2. ER Diagram ────────────────────────────────────────────────────────────
const er = svg(
  980,
  680,
  [
    title('Entity-Relationship Diagram'),
    // User entity
    box(40, 70, 220, 220, '', { cls: 'box-primary' }),
    `<text x="50" y="95" class="label" font-weight="700">User</text>`,
    `<text x="50" y="118" class="mono">_id: ObjectId (PK)</text>`,
    `<text x="50" y="138" class="mono">email: string (unique)</text>`,
    `<text x="50" y="158" class="mono">password: hashed</text>`,
    `<text x="50" y="178" class="mono">role: enum</text>`,
    `<text x="50" y="198" class="mono">coachApplication: subdoc</text>`,
    `<text x="50" y="218" class="mono">coachProfile: subdoc</text>`,
    `<text x="50" y="238" class="mono">subscription: subdoc</text>`,
    `<text x="50" y="258" class="mono">emailVerified: bool</text>`,
    `<text x="50" y="278" class="mono">suspendedAt: Date|null</text>`,
    // WorkoutSession
    box(310, 70, 220, 130, ''),
    `<text x="320" y="95" class="label" font-weight="700">WorkoutSession</text>`,
    `<text x="320" y="118" class="mono">userId: ObjectId (FK)</text>`,
    `<text x="320" y="138" class="mono">exerciseType: enum</text>`,
    `<text x="320" y="158" class="mono">repCount, formScore</text>`,
    `<text x="320" y="178" class="mono">duration, calories, tempo</text>`,
    arrow(260, 130, 310, 130, '1..n'),
    // CoachClient
    box(580, 70, 220, 130, '', { cls: 'box-accent' }),
    `<text x="590" y="95" class="label" font-weight="700">CoachClient</text>`,
    `<text x="590" y="118" class="mono">coachId: ObjectId (FK)</text>`,
    `<text x="590" y="138" class="mono">clientId: ObjectId (FK)</text>`,
    `<text x="590" y="158" class="mono">status: enum</text>`,
    `<text x="590" y="178" class="mono">requestedBy: enum</text>`,
    arrow(260, 150, 580, 150, 'coach/client'),
    // CoachNote
    box(580, 230, 220, 110, ''),
    `<text x="590" y="255" class="label" font-weight="700">CoachNote</text>`,
    `<text x="590" y="278" class="mono">coachId, clientId (FK)</text>`,
    `<text x="590" y="298" class="mono">sessionId: ObjectId|null</text>`,
    `<text x="590" y="318" class="mono">body: string</text>`,
    arrow(690, 200, 690, 230, ''),
    // Message
    box(40, 360, 220, 130, ''),
    `<text x="50" y="385" class="label" font-weight="700">Message</text>`,
    `<text x="50" y="408" class="mono">coachId, clientId (FK)</text>`,
    `<text x="50" y="428" class="mono">fromId, toId (FK)</text>`,
    `<text x="50" y="448" class="mono">body: string</text>`,
    `<text x="50" y="468" class="mono">readAt: Date|null</text>`,
    arrow(150, 290, 150, 360, ''),
    // AuditLog
    box(310, 360, 220, 130, ''),
    `<text x="320" y="385" class="label" font-weight="700">AuditLog</text>`,
    `<text x="320" y="408" class="mono">actorId: ObjectId (FK)</text>`,
    `<text x="320" y="428" class="mono">action: enum</text>`,
    `<text x="320" y="448" class="mono">targetType, targetId</text>`,
    `<text x="320" y="468" class="mono">meta: any</text>`,
    arrow(420, 290, 420, 360, ''),
    // VerificationToken
    box(580, 360, 220, 130, ''),
    `<text x="590" y="385" class="label" font-weight="700">VerificationToken</text>`,
    `<text x="590" y="408" class="mono">userId: ObjectId (FK)</text>`,
    `<text x="590" y="428" class="mono">purpose: enum</text>`,
    `<text x="590" y="448" class="mono">tokenHash: string</text>`,
    `<text x="590" y="468" class="mono">expiresAt: Date (TTL)</text>`,
    // WorkoutPlan
    box(40, 540, 220, 110, ''),
    `<text x="50" y="565" class="label" font-weight="700">WorkoutPlan</text>`,
    `<text x="50" y="588" class="mono">userId (FK)</text>`,
    `<text x="50" y="608" class="mono">type: ai_gen|custom</text>`,
    `<text x="50" y="628" class="mono">weeklySchedule: array</text>`,
    arrow(150, 290, 150, 540, ''),
    // Exercise
    box(310, 540, 220, 110, ''),
    `<text x="320" y="565" class="label" font-weight="700">Exercise</text>`,
    `<text x="320" y="588" class="mono">name, category</text>`,
    `<text x="320" y="608" class="mono">muscleGroups[]</text>`,
    `<text x="320" y="628" class="mono">isCustom, createdBy</text>`,
    `<text x="820" y="660" class="small">FK = foreign-key reference; subdoc = embedded document; TTL = time-to-live index.</text>`,
  ].join('\n')
);
await write('fig_er_diagram', er);

// ─── 3. Use Case Diagram ─────────────────────────────────────────────────────
function actor(x, y, label) {
  return `<g>
    <circle cx="${x}" cy="${y}" r="14" class="actor-circle"/>
    <line x1="${x}" y1="${y + 14}" x2="${x}" y2="${y + 50}" stroke="${C.ink}" stroke-width="2"/>
    <line x1="${x - 18}" y1="${y + 28}" x2="${x + 18}" y2="${y + 28}" stroke="${C.ink}" stroke-width="2"/>
    <line x1="${x}" y1="${y + 50}" x2="${x - 16}" y2="${y + 80}" stroke="${C.ink}" stroke-width="2"/>
    <line x1="${x}" y1="${y + 50}" x2="${x + 16}" y2="${y + 80}" stroke="${C.ink}" stroke-width="2"/>
    <text x="${x}" y="${y + 105}" text-anchor="middle" class="label" font-weight="700">${esc(label)}</text>
  </g>`;
}
function uc(cx, cy, w, h, label) {
  return `<g>
    <ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${h / 2}" class="usecase"/>
    <text x="${cx}" y="${cy + 4}" text-anchor="middle" class="label">${esc(label)}</text>
  </g>`;
}
const useCase = svg(
  1100,
  720,
  [
    title('Use Case Diagram'),
    // boundary
    `<rect x="180" y="70" width="740" height="620" fill="none" stroke="${C.border}" stroke-width="2" rx="20"/>`,
    `<text x="550" y="95" text-anchor="middle" class="label" font-weight="700">FitFlow Platform</text>`,

    // Trainee actor (left)
    actor(80, 200, 'Trainee'),
    uc(310, 160, 200, 40, 'Register / Log in'),
    uc(310, 230, 200, 40, 'Run Live Workout'),
    uc(310, 300, 200, 40, 'View Progress'),
    uc(310, 370, 200, 40, 'Browse / Request Coach'),
    uc(310, 440, 200, 40, 'Send Message'),
    uc(310, 510, 200, 40, 'Manage Subscription'),
    arrow(94, 220, 210, 160),
    arrow(94, 220, 210, 230),
    arrow(94, 220, 210, 300),
    arrow(94, 220, 210, 370),
    arrow(94, 220, 210, 440),
    arrow(94, 220, 210, 510),

    // Coach actor (right)
    actor(1020, 200, 'Coach'),
    uc(770, 160, 200, 40, 'Submit Application'),
    uc(770, 230, 200, 40, 'Accept / Decline Req.'),
    uc(770, 300, 200, 40, 'View Client Detail'),
    uc(770, 370, 200, 40, 'Write Private Note'),
    uc(770, 440, 200, 40, 'Reply to Message'),
    uc(770, 510, 200, 40, 'Edit Public Profile'),
    arrow(1006, 220, 870, 160),
    arrow(1006, 220, 870, 230),
    arrow(1006, 220, 870, 300),
    arrow(1006, 220, 870, 370),
    arrow(1006, 220, 870, 440),
    arrow(1006, 220, 870, 510),

    // Admin actor (bottom)
    actor(550, 600, 'Admin'),
    uc(310, 580, 200, 40, 'Manage Users'),
    uc(770, 580, 200, 40, 'Review Coach Apps'),
    uc(550, 660, 200, 40, 'Audit Log'),
    arrow(536, 615, 410, 590),
    arrow(564, 615, 670, 590),
    arrow(550, 645, 550, 660),
  ].join('\n')
);
await write('fig_usecase', useCase);

// ─── 4. DFD Level 0 ──────────────────────────────────────────────────────────
const dfd0 = svg(
  900,
  400,
  [
    title('DFD Level-0 (Context Diagram)'),
    // central process
    `<circle cx="450" cy="220" r="80" fill="${C.primaryFill}" stroke="${C.primary}" stroke-width="2"/>`,
    `<text x="450" y="215" text-anchor="middle" class="label" font-weight="700">0.0</text>`,
    `<text x="450" y="235" text-anchor="middle" class="label">FitFlow Platform</text>`,
    // entities
    box(40, 180, 140, 80, 'Trainee'),
    box(720, 180, 140, 80, 'Coach'),
    box(380, 80, 140, 50, 'Admin'),
    box(380, 320, 140, 50, 'Stripe'),
    // flows
    arrow(180, 200, 370, 200, 'session, msg'),
    arrow(370, 240, 180, 240, 'progress, replies'),
    arrow(720, 200, 530, 200, 'notes, msg'),
    arrow(530, 240, 720, 240, 'client data'),
    arrow(450, 130, 450, 140, 'mod actions'),
    arrow(450, 300, 450, 320, 'webhook'),
  ].join('\n')
);
await write('fig_dfd_level0', dfd0);

// ─── 5. DFD Level 1 ──────────────────────────────────────────────────────────
function process(x, y, w, h, label) {
  const lines = label.split('\n').map(esc);
  return `<g>
    <ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" fill="${C.primaryFill}" stroke="${C.primary}" stroke-width="1.5"/>
    ${lines.map((l, i, a) => `<text x="${x + w / 2}" y="${y + h / 2 + (i - (a.length - 1) / 2) * 14 + 5}" text-anchor="middle" class="label">${l}</text>`).join('')}
  </g>`;
}
function store(x, y, w, h, label) {
  return `<g>
    <line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="${C.ink}" stroke-width="1.5"/>
    <line x1="${x}" y1="${y + h}" x2="${x + w}" y2="${y + h}" stroke="${C.ink}" stroke-width="1.5"/>
    <text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle" class="label">${esc(label)}</text>
  </g>`;
}
const dfd1 = svg(
  1100,
  720,
  [
    title('DFD Level-1 (Major Processes)'),
    // entities (corners)
    box(40, 100, 140, 60, 'Trainee'),
    box(40, 540, 140, 60, 'Admin'),
    box(920, 100, 140, 60, 'Coach'),
    box(920, 540, 140, 60, 'Stripe'),
    // processes
    process(260, 90, 180, 80, '1.1\nAuthentication'),
    process(480, 90, 180, 80, '1.2\nWorkout Session'),
    process(700, 90, 180, 80, '1.3\nProgress Aggregation'),
    process(260, 280, 180, 80, '1.4\nCoach Link'),
    process(700, 280, 180, 80, '1.5\nCoach Review'),
    process(480, 470, 180, 80, '1.6\nMessaging'),
    process(260, 470, 180, 80, '1.7\nAdministration'),
    process(700, 470, 180, 80, '1.8\nBilling'),
    // stores
    store(440, 600, 220, 50, 'D1: Users'),
    store(180, 200, 200, 40, 'D2: Sessions'),
    store(700, 200, 200, 40, 'D3: CoachClient/Notes'),
    store(440, 380, 220, 40, 'D4: Messages'),
    store(180, 660, 200, 40, 'D5: AuditLog'),
    // arrows (sample subset to keep readable)
    arrow(180, 130, 260, 130),
    arrow(180, 130, 260, 510),
    arrow(440, 130, 480, 130),
    arrow(660, 130, 700, 130),
    arrow(440, 320, 700, 320),
    arrow(880, 130, 920, 130),
    arrow(880, 320, 920, 130),
    arrow(880, 510, 920, 570),
    arrow(560, 220, 480, 170),
    arrow(800, 220, 700, 170),
    arrow(550, 380, 480, 470),
    arrow(280, 700, 280, 660),
  ].join('\n')
);
await write('fig_dfd_level1', dfd1);

// ─── 6. DFD Level 2 (Live Workout) ───────────────────────────────────────────
const dfd2 = svg(
  1100,
  500,
  [
    title('DFD Level-2 (Live Workout Pipeline)'),
    box(40, 200, 120, 70, 'Trainee\n(Camera)'),
    process(200, 200, 130, 70, '2.1\nCapture'),
    process(370, 200, 130, 70, '2.2\nPose\nDetection'),
    process(540, 200, 130, 70, '2.3\nExercise\nClassify'),
    process(710, 200, 130, 70, '2.4\nState Machine'),
    process(540, 350, 130, 70, '2.5\nForm\nAnalysis'),
    process(710, 350, 130, 70, '2.6\nMetric\nPersist'),
    store(880, 360, 180, 50, 'D2: Sessions'),
    arrow(160, 235, 200, 235, 'frames'),
    arrow(330, 235, 370, 235, 'rgb'),
    arrow(500, 235, 540, 235, 'landmarks'),
    arrow(670, 235, 710, 235, 'enum'),
    arrow(605, 270, 605, 350, 'reps'),
    arrow(670, 385, 710, 385, 'score'),
    arrow(840, 385, 880, 385, 'POST'),
    `<text x="20" y="470" class="small">All boxed processes execute in the browser. Only process 2.6 makes a network call.</text>`,
  ].join('\n')
);
await write('fig_dfd_level2', dfd2);

// ─── 7. Sequence: Login + Role Redirect ──────────────────────────────────────
function lifeline(x, label) {
  return `<g>
    <rect x="${x - 60}" y="60" width="120" height="36" class="box-primary"/>
    <text x="${x}" y="83" text-anchor="middle" class="label" font-weight="700">${label}</text>
    <line x1="${x}" y1="96" x2="${x}" y2="640" stroke="${C.muted}" stroke-width="1" stroke-dasharray="4 4"/>
  </g>`;
}
function msg(x1, x2, y, label, dir = '→') {
  const reverse = x1 > x2;
  return `<g>
    <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" class="arrow"/>
    <text x="${(x1 + x2) / 2}" y="${y - 6}" text-anchor="middle" class="small">${label}</text>
  </g>`;
}
function activation(x, y1, y2) {
  return `<rect x="${x - 5}" y="${y1}" width="10" height="${y2 - y1}" fill="${C.primaryFill}" stroke="${C.primary}"/>`;
}
const seqLogin = svg(
  1000,
  680,
  [
    title('Sequence: Login + Role-Based Redirect'),
    lifeline(120, 'User'),
    lifeline(320, 'Login Page'),
    lifeline(520, '/api/auth/login'),
    lifeline(720, 'MongoDB'),
    lifeline(900, 'Role Home'),
    msg(120, 320, 130, 'enter creds + submit'),
    msg(320, 520, 170, 'POST {email, password}'),
    activation(520, 170, 350),
    msg(520, 720, 200, 'findOne(email)'),
    msg(720, 520, 230, 'user doc'),
    msg(520, 520, 270, 'comparePassword (bcrypt)'),
    msg(520, 520, 310, 'check suspendedAt'),
    msg(520, 320, 350, 'Set-Cookie: token (JWT)'),
    msg(320, 120, 400, 'data.user (with role)'),
    activation(320, 400, 480),
    msg(320, 320, 440, 'router.push(homeFor(role))'),
    msg(320, 900, 500, 'navigate /dashboard | /coach | /admin'),
    activation(900, 500, 580),
    `<text x="20" y="660" class="small">homeFor() in src/lib/roleHome.ts is the single source of truth for role landing pages.</text>`,
  ].join('\n')
);
await write('fig_seq_login', seqLogin);

// ─── 8. Sequence: Live Workout Save ──────────────────────────────────────────
const seqWorkout = svg(
  1000,
  680,
  [
    title('Sequence: Live Workout (Camera → CV → Save)'),
    lifeline(120, 'User'),
    lifeline(300, 'Live UI'),
    lifeline(480, 'PoseDetector'),
    lifeline(660, 'Detector\n(Squat/Push/Plank)'),
    lifeline(870, '/api/workout-\nsessions'),
    msg(120, 300, 130, 'click Start'),
    activation(300, 130, 600),
    msg(300, 480, 170, 'initialize(video)'),
    activation(480, 170, 580),
    msg(480, 480, 210, 'MediaPipe loop @30fps'),
    msg(480, 660, 250, 'onResults(landmarks)'),
    activation(660, 250, 560),
    msg(660, 660, 290, 'updateState(angles)'),
    msg(660, 660, 320, 'analyzeForm() → EMA score'),
    msg(660, 300, 360, 'metrics {reps, score, …}'),
    msg(300, 300, 400, 'render UI (rep counter)'),
    msg(120, 300, 460, 'click Stop'),
    msg(300, 870, 500, 'POST {exerciseType, repCount, …}'),
    activation(870, 500, 580),
    msg(870, 300, 560, '201 Created (sessionId)'),
    `<text x="20" y="660" class="small">No video frames leave the device. Only aggregated numerical metrics are persisted.</text>`,
  ].join('\n')
);
await write('fig_seq_workout', seqWorkout);

// ─── 9. Sequence: Coach Application ──────────────────────────────────────────
const seqCoach = svg(
  1000,
  640,
  [
    title('Sequence: Coach Application + Approval'),
    lifeline(110, 'Applicant'),
    lifeline(290, 'Register'),
    lifeline(470, '/api/auth/\nregister'),
    lifeline(660, 'Admin'),
    lifeline(870, '/api/admin/\ncoach-apps'),
    msg(110, 290, 130, 'pick "Coach", write bio'),
    msg(290, 470, 170, 'POST {role: coach, bio}'),
    activation(470, 170, 280),
    msg(470, 470, 210, 'create user (role: pending_coach)'),
    msg(470, 470, 240, 'email admins (notification)'),
    msg(470, 290, 280, '201 Created'),
    msg(660, 870, 360, 'GET /coach-applications'),
    activation(870, 360, 560),
    msg(870, 660, 400, '[applicants]'),
    msg(660, 870, 440, 'PATCH {action: approve}'),
    msg(870, 870, 480, 'role := coach\ncoachProfile.bio := app.bio'),
    msg(870, 870, 520, 'audit log entry'),
    msg(870, 660, 560, '200 OK'),
    `<text x="20" y="610" class="small">Admin can also reject; reason is required and emailed to applicant.</text>`,
  ].join('\n')
);
await write('fig_seq_coach', seqCoach);

// ─── 10. Activity: Coach-Trainee Link ────────────────────────────────────────
function diamond(x, y, label) {
  return `<g>
    <polygon points="${x},${y - 30} ${x + 70},${y} ${x},${y + 30} ${x - 70},${y}" fill="${C.bg}" stroke="${C.warning}" stroke-width="2"/>
    ${label.split('\n').map((l, i, a) => `<text x="${x}" y="${y + (i - (a.length - 1) / 2) * 14 + 5}" text-anchor="middle" class="label">${esc(l)}</text>`).join('')}
  </g>`;
}
function startEnd(x, y, label, fill = C.ink) {
  return `<g><circle cx="${x}" cy="${y}" r="14" fill="${fill}"/><text x="${x}" y="${y + 35}" text-anchor="middle" class="label">${esc(label)}</text></g>`;
}
function pill(x, y, w, label) {
  return `<g><rect x="${x - w / 2}" y="${y - 22}" width="${w}" height="44" rx="22" class="box-accent"/><text x="${x}" y="${y + 5}" text-anchor="middle" class="label">${esc(label)}</text></g>`;
}
const activity = svg(
  900,
  900,
  [
    title('Activity: Coach-Trainee Link Lifecycle'),
    startEnd(450, 80, 'Start'),
    pill(450, 160, 280, 'Trainee browses /coaches'),
    arrow(450, 95, 450, 138),
    pill(450, 230, 280, 'Trainee sends link request'),
    arrow(450, 182, 450, 208),
    diamond(450, 320, 'Coach\ndecides'),
    arrow(450, 252, 450, 290),
    pill(280, 410, 220, 'Coach declines'),
    pill(620, 410, 220, 'Coach accepts'),
    arrow(390, 320, 280, 388, 'No'),
    arrow(510, 320, 620, 388, 'Yes'),
    pill(280, 480, 220, 'Status: declined'),
    pill(620, 480, 220, 'Status: active'),
    arrow(280, 432, 280, 458),
    arrow(620, 432, 620, 458),
    pill(620, 560, 280, 'Trainee gets dashboard access'),
    arrow(620, 502, 620, 538),
    pill(620, 640, 280, 'Messaging unlocked'),
    arrow(620, 582, 620, 618),
    diamond(620, 740, 'End link?'),
    arrow(620, 662, 620, 710),
    pill(380, 800, 200, 'Coach ends link'),
    pill(620, 800, 200, 'Continue'),
    arrow(580, 740, 380, 778, 'Yes'),
    arrow(660, 740, 660, 778, 'No'),
    pill(380, 870, 200, 'Status: ended'),
    arrow(380, 822, 380, 848),
    startEnd(280, 540, 'End', C.danger),
    arrow(280, 502, 280, 525),
  ].join('\n')
);
await write('fig_activity_link', activity);

// ─── 11. State Machine: Squat Detector ───────────────────────────────────────
function state(x, y, w, h, label) {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${C.primaryFill}" stroke="${C.primary}" stroke-width="2"/>
    ${label.split('\n').map((l, i, a) => `<text x="${x + w / 2}" y="${y + h / 2 + (i - (a.length - 1) / 2) * 14 + 5}" text-anchor="middle" class="label">${esc(l)}</text>`).join('')}
  </g>`;
}
function curve(x1, y1, cx, cy, x2, y2, label) {
  return `<g>
    <path d="M${x1},${y1} Q${cx},${cy} ${x2},${y2}" stroke="${C.muted}" stroke-width="1.5" fill="none" marker-end="url(#arrow)"/>
    <text x="${cx}" y="${cy}" text-anchor="middle" class="small">${esc(label)}</text>
  </g>`;
}
const stateMachine = svg(
  1000,
  500,
  [
    title('State Machine: Squat Rep Detector'),
    startEnd(80, 250, 'Start'),
    state(180, 200, 140, 100, 'IDLE\n(no detection)'),
    state(400, 100, 140, 100, 'READY\n(angle > 160°)'),
    state(620, 200, 140, 100, 'DOWN\n(angle < 100°)'),
    state(400, 320, 140, 100, 'UP\n(angle > 160°)\nrepCount++'),
    arrow(94, 250, 180, 250),
    curve(320, 230, 360, 130, 400, 150, 'visibility OK'),
    curve(540, 130, 580, 130, 620, 230, 'descent'),
    curve(620, 280, 580, 380, 540, 380, 'ascent (rep!)'),
    curve(400, 380, 360, 320, 320, 280, 'reset'),
    `<text x="20" y="470" class="small">Hip-knee-ankle angle drives transitions. EMA-smoothed form score is updated each frame regardless of state.</text>`,
  ].join('\n')
);
await write('fig_state_squat', stateMachine);

// ─── 12. Class Diagram ───────────────────────────────────────────────────────
function classBox(x, y, name, attrs, methods) {
  const headerH = 30;
  const lineH = 16;
  const aH = attrs.length * lineH + 14;
  const mH = methods.length * lineH + 14;
  const totalH = headerH + aH + mH;
  return `<g>
    <rect x="${x}" y="${y}" width="240" height="${totalH}" fill="${C.bg}" stroke="${C.ink}" stroke-width="1.5"/>
    <rect x="${x}" y="${y}" width="240" height="${headerH}" fill="${C.primaryFill}"/>
    <text x="${x + 120}" y="${y + 20}" text-anchor="middle" class="label" font-weight="700">${esc(name)}</text>
    <line x1="${x}" y1="${y + headerH}" x2="${x + 240}" y2="${y + headerH}" stroke="${C.ink}"/>
    ${attrs.map((a, i) => `<text x="${x + 10}" y="${y + headerH + 18 + i * lineH}" class="mono">${esc(a)}</text>`).join('')}
    <line x1="${x}" y1="${y + headerH + aH}" x2="${x + 240}" y2="${y + headerH + aH}" stroke="${C.ink}"/>
    ${methods.map((m, i) => `<text x="${x + 10}" y="${y + headerH + aH + 18 + i * lineH}" class="mono">${esc(m)}</text>`).join('')}
  </g>`;
}
const classDiagram = svg(
  1100,
  680,
  [
    title('Class Diagram (Key Models & Services)'),
    classBox(40, 70, 'User', [
      '+ email: string', '+ role: UserRole', '+ password: hashed',
      '+ subscription: Sub', '+ coachProfile: Profile?', '+ emailVerified: bool',
    ], ['+ findById()', '+ updateRole()', '+ suspend()']),
    classBox(310, 70, 'WorkoutSession', [
      '+ userId: ObjectId', '+ exerciseType: enum', '+ repCount: number',
      '+ formScore: number', '+ duration: number',
    ], ['+ aggregate30d()', '+ create()']),
    classBox(580, 70, 'CoachClient', [
      '+ coachId: ObjectId', '+ clientId: ObjectId', '+ status: enum',
      '+ requestedBy: enum',
    ], ['+ accept()', '+ decline()', '+ end()']),
    classBox(850, 70, 'Message', [
      '+ coachId, clientId', '+ fromId, toId', '+ body: string', '+ readAt: Date?',
    ], ['+ thread()', '+ markRead()']),

    classBox(40, 380, 'PoseDetector', [
      '- pose: MediaPipe', '- camera: Camera', '- onResultsCb',
    ], ['+ initialize(video)', '+ onResults(cb)', '+ stop()']),
    classBox(310, 380, 'SquatDetector', [
      '- state: enum', '- repCount: number', '- formScore: number',
    ], ['+ process(results)', '+ getMetrics()', '+ reset()']),
    classBox(580, 380, 'EntitlementHelper', [
      '+ tier: free|pro', '+ status: enum',
    ], ['+ effectiveTier()', '+ can(feature)', '+ getUserSubscription()']),
    classBox(850, 380, 'AuthService', [
      '+ JWT_SECRET', '+ TokenPayload',
    ], ['+ generateToken()', '+ verifyToken()', '+ withRole()']),

    // relationships
    arrow(280, 130, 310, 130, '1..n'),
    arrow(550, 130, 580, 130, 'links'),
    arrow(820, 130, 850, 130, 'sends'),
    arrow(280, 410, 310, 410, 'feeds'),
  ].join('\n')
);
await write('fig_class_diagram', classDiagram);

// ─── 13. Gantt Chart ─────────────────────────────────────────────────────────
function ganttBar(x, y, w, label, color = C.primary) {
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="22" fill="${color}" rx="3" opacity="0.85"/>
    <text x="${x + 8}" y="${y + 16}" class="small" fill="white" font-weight="700">${label}</text>
  </g>`;
}
const gantt = (() => {
  const left = 200;
  const right = 1080;
  const totalWeeks = 48;
  const ppw = (right - left) / totalWeeks;
  const tick = (w) => left + w * ppw;
  const phases = [
    ['Initial Phase', 1, 11, C.muted],
    ['Requirement Analysis', 12, 15, C.primary],
    ['System Design', 16, 20, C.primary],
    ['Front-end Skeleton', 21, 28, C.accent],
    ['Back-end + CV Pipeline', 29, 36, C.accent],
    ['Coach + Admin Surfaces', 37, 40, C.warning],
    ['Messaging, Billing, Polish', 41, 44, C.warning],
    ['Deployment + Hardening', 45, 46, C.danger],
    ['Final Report + Demo', 47, 48, C.danger],
  ];
  const rowH = 36;
  const top = 80;
  const ticks = [];
  for (let w = 0; w <= 48; w += 4) {
    ticks.push(`<line x1="${tick(w)}" y1="${top - 8}" x2="${tick(w)}" y2="${top + phases.length * rowH}" stroke="${C.border}" stroke-width="0.5"/>
                <text x="${tick(w)}" y="${top - 14}" text-anchor="middle" class="small">W${w}</text>`);
  }
  return svg(
    1140,
    480,
    [
      title('Project Plan — Gantt Chart (48 weeks)'),
      ...ticks,
      ...phases.map(([label, start, end, color], i) =>
        [
          `<text x="190" y="${top + i * rowH + 18}" text-anchor="end" class="small">${label}</text>`,
          ganttBar(tick(start), top + i * rowH + 4, (end - start + 1) * ppw, `W${start}–${end}`, color),
        ].join('')
      ),
    ].join('\n')
  );
})();
await write('fig_gantt', gantt);

// ─── 14. Deployment Diagram ──────────────────────────────────────────────────
const deployment = svg(
  1000,
  500,
  [
    title('Deployment Diagram'),
    box(40, 80, 220, 200, '', { cls: 'box-primary' }),
    `<text x="60" y="105" class="label" font-weight="700">User Device</text>`,
    box(70, 130, 160, 50, 'Browser\n(Chrome / Safari)'),
    box(70, 200, 160, 60, 'WebCam\n+ MediaPipe WASM'),

    box(310, 80, 280, 200, '', { cls: 'box-accent' }),
    `<text x="330" y="105" class="label" font-weight="700">Application Host (Vercel)</text>`,
    box(340, 130, 220, 50, 'Next.js Edge Middleware\n(role-aware routing)'),
    box(340, 200, 220, 60, 'Next.js API Routes\n(Node runtime)'),

    box(640, 80, 320, 200, ''),
    `<text x="660" y="105" class="label" font-weight="700">External Services</text>`,
    box(660, 130, 280, 40, 'MongoDB Atlas (M10)'),
    box(660, 180, 280, 40, 'Stripe (Billing + Webhook)'),
    box(660, 230, 280, 40, 'OpenAI API (Pro tier only)'),

    arrow(260, 180, 310, 180, 'HTTPS'),
    arrow(590, 180, 640, 180, 'TCP/TLS'),
    arrow(640, 230, 590, 230, 'webhook'),

    box(40, 320, 920, 130, ''),
    `<text x="60" y="345" class="label" font-weight="700">Operational Tooling</text>`,
    box(70, 370, 200, 60, 'GitHub\n(source + CI)'),
    box(290, 370, 200, 60, 'OpenAPI spec\n(/api/openapi)'),
    box(510, 370, 200, 60, 'Structured logs\n(JSON in prod)'),
    box(730, 370, 210, 60, 'Mongo TTL collections\n(rate limits, tokens)'),
  ].join('\n')
);
await write('fig_deployment', deployment);

console.log('\nAll diagrams written to', OUT_DIR);
