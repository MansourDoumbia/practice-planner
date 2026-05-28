const { useState, useEffect, useRef } = React;

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED_USERS = [
  { id: "u1", name: "Coach Rivera", email: "coach@crew.com", phone: "555-0101", role: "coach", housingLocation: "Boathouse", isDriver: false, carCapacity: 0, password: "coach123" },
  { id: "u2", name: "Alex Morgan", email: "secretary@crew.com", phone: "555-0102", role: "secretary", housingLocation: "North Dorm", isDriver: true, carCapacity: 4, password: "sec123" },
  { id: "u3", name: "Jordan Lee", email: "jordan@crew.com", phone: "555-0201", role: "athlete", housingLocation: "South Dorm", isDriver: true, carCapacity: 3, password: "pass123" },
  { id: "u4", name: "Sam Patel", email: "sam@crew.com", phone: "555-0202", role: "athlete", housingLocation: "West Apartments", isDriver: false, carCapacity: 0, password: "pass123" },
  { id: "u5", name: "Casey Kim", email: "casey@crew.com", phone: "555-0203", role: "athlete", housingLocation: "North Dorm", isDriver: true, carCapacity: 5, password: "pass123" },
  { id: "u6", name: "Riley Chen", email: "riley@crew.com", phone: "555-0204", role: "athlete", housingLocation: "South Dorm", isDriver: false, carCapacity: 0, password: "pass123" },
  { id: "u7", name: "Morgan Davis", email: "morgan@crew.com", phone: "555-0205", role: "athlete", housingLocation: "West Apartments", isDriver: true, carCapacity: 4, password: "pass123" },
  { id: "u8", name: "Taylor Brown", email: "taylor@crew.com", phone: "555-0206", role: "athlete", housingLocation: "East Village", isDriver: false, carCapacity: 0, password: "pass123" },
  { id: "u9", name: "Jamie Wilson", email: "jamie@crew.com", phone: "555-0207", role: "athlete", housingLocation: "East Village", isDriver: true, carCapacity: 2, password: "pass123" },
  { id: "u10", name: "Drew Thompson", email: "drew@crew.com", phone: "555-0208", role: "athlete", housingLocation: "North Dorm", isDriver: false, carCapacity: 0, password: "pass123" },
];

const today = new Date();
const d = (daysFromNow, hr = 6, min = 0) => {
  const dt = new Date(today); dt.setDate(dt.getDate() + daysFromNow);
  dt.setHours(hr, min, 0, 0); return dt.toISOString();
};

const SEED_PRACTICES = [
  { id: "p1", date: d(1), time: "06:00", location: "Riverside Boathouse", notes: "Morning erg + water work", createdBy: "u1" },
  { id: "p2", date: d(3), time: "06:00", location: "Riverside Boathouse", notes: "Long distance piece", createdBy: "u1" },
  { id: "p3", date: d(5), time: "16:30", location: "Riverside Boathouse", notes: "Race simulation", createdBy: "u1" },
  { id: "p4", date: d(-2), time: "06:00", location: "Riverside Boathouse", notes: "Completed practice", createdBy: "u1" },
];

const SEED_ATTENDANCE = [
  { id: "a1", practiceId: "p1", athleteId: "u3", status: "confirmed", reason: "" },
  { id: "a2", practiceId: "p1", athleteId: "u4", status: "confirmed", reason: "" },
  { id: "a3", practiceId: "p1", athleteId: "u5", status: "confirmed", reason: "" },
  { id: "a4", practiceId: "p1", athleteId: "u6", status: "declined", reason: "Doctor appointment" },
  { id: "a5", practiceId: "p1", athleteId: "u7", status: "confirmed", reason: "" },
  { id: "a6", practiceId: "p1", athleteId: "u8", status: "confirmed", reason: "" },
  { id: "a7", practiceId: "p1", athleteId: "u9", status: "confirmed", reason: "" },
  { id: "a8", practiceId: "p1", athleteId: "u10", status: "no_response", reason: "" },
];

const SEED_BOATS = [
  { id: "b1", name: "Varsity 8+", type: "Eight", seatCount: 8, requiresCoxswain: true },
  { id: "b2", name: "JV 8+", type: "Eight", seatCount: 8, requiresCoxswain: true },
  { id: "b3", name: "Varsity 4+", type: "Four", seatCount: 4, requiresCoxswain: true },
  { id: "b4", name: "Double Scull", type: "Double", seatCount: 2, requiresCoxswain: false },
];

const SEAT_LABELS_8 = ["Coxswain", "Stroke", "7", "6", "5", "4", "3", "2", "Bow"];
const SEAT_LABELS_4 = ["Coxswain", "Stroke", "3", "2", "Bow"];
const SEAT_LABELS_2 = ["Stroke", "Bow"];

const getSeatLabels = (boat) => {
  if (!boat) return [];
  if (boat.seatCount === 8) return boat.requiresCoxswain ? SEAT_LABELS_8 : SEAT_LABELS_8.slice(1);
  if (boat.seatCount === 4) return boat.requiresCoxswain ? SEAT_LABELS_4 : SEAT_LABELS_4.slice(1);
  return SEAT_LABELS_2;
};

const SEED_LINEUPS = [
  {
    id: "l1", practiceId: "p1", boatId: "b1",
    assignments: [
      { seat: "Coxswain", athleteId: "u3" },
      { seat: "Stroke", athleteId: "u4" },
      { seat: "7", athleteId: "u5" },
      { seat: "6", athleteId: "u7" },
      { seat: "5", athleteId: "u8" },
      { seat: "4", athleteId: "u9" },
      { seat: "3", athleteId: "" },
      { seat: "2", athleteId: "" },
      { seat: "Bow", athleteId: "" },
    ]
  }
];

const SEED_RIDES = [
  {
    id: "r1", practiceId: "p1",
    rides: [
      { driverId: "u3", passengerIds: ["u4", "u6"], pickupLocation: "South Dorm / West Apartments", pickupTime: "05:30 AM" },
      { driverId: "u5", passengerIds: ["u10"], pickupLocation: "North Dorm", pickupTime: "05:35 AM" },
      { driverId: "u7", passengerIds: ["u8", "u9"], pickupLocation: "West Apartments / East Village", pickupTime: "05:25 AM" },
    ]
  }
];

const SEED_ANNOUNCEMENTS = [
  { id: "an1", senderId: "u1", message: "Great work this week! Remember hydration and sleep before race day.", recipientGroup: "entire_team", timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: "an2", senderId: "u2", message: "Ride sheets for Thursday are posted. Please confirm your pickup time with your driver.", recipientGroup: "confirmed", timestamp: new Date(Date.now() - 3600000).toISOString() },
];

const STORAGE_KEY = "practicePlannerData";

const DEFAULT_APP_DATA = {
  users: SEED_USERS,
  practices: SEED_PRACTICES,
  attendance: SEED_ATTENDANCE,
  boats: SEED_BOATS,
  lineups: SEED_LINEUPS,
  rides: SEED_RIDES,
  announcements: SEED_ANNOUNCEMENTS,
  templates: [],
  reports: [],
};

const loadAppData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_APP_DATA;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_APP_DATA, ...parsed };
  } catch (error) {
    console.warn("Failed to load app data from localStorage:", error);
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_APP_DATA;
  }
};

const saveAppData = (data) => {
  try {
    const sanitized = sanitizeAll(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (error) {
    console.warn("Failed to save app data to localStorage:", error);
  }
};

const sanitizeAll = (value) => {
  if (typeof value === "string") return sanitizeString(value);
  if (Array.isArray(value)) return value.map(sanitizeAll);
  if (value && typeof value === "object") {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = sanitizeAll(val);
    }
    return result;
  }
  return value;
};

const sanitizeString = (value) => {
  if (typeof value !== "string") return value;
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim();
};

const sanitizeObject = (source) => {
  const result = {};
  for (const [key, value] of Object.entries(source)) {
    result[key] = typeof value === "string" ? sanitizeString(value) : value;
  }
  return result;
};

const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("");
};

const verifyPassword = async (password, storedPassword) => {
  if (!storedPassword) return false;
  const hashed = await hashPassword(password);
  return hashed === storedPassword || storedPassword === password;
};

const isHashedPassword = (password) => typeof password === "string" && /^[0-9a-f]{64}$/.test(password);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};
const fmtTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
const fmtTs = (iso) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

const initials = (name = "") => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

const AVATAR_COLORS = ["#185FA5","#1D9E75","#D85A30","#D4537E","#7F77DD","#BA7517","#639922","#E24B4A"];
const avatarColor = (id = "") => AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0a1628;
    --navy2: #112240;
    --navy3: #1d3461;
    --accent: #4fc3f7;
    --accent2: #00e5ff;
    --gold: #ffd54f;
    --red: #ef5350;
    --green: #66bb6a;
    --orange: #ffa726;
    --text: #e8edf5;
    --text2: #8fa3c0;
    --text3: #4a6080;
    --border: rgba(79,195,247,0.15);
    --border2: rgba(79,195,247,0.28);
    --card: rgba(17,34,64,0.85);
    --card2: rgba(10,22,40,0.9);
    --radius: 10px;
    --radius-lg: 14px;
    font-family: 'DM Sans', sans-serif;
  }

  body { background: var(--navy); color: var(--text); min-height: 100vh; }

  .app { display: flex; min-height: 100vh; }

  /* sidebar */
  .sidebar {
    width: 220px; flex-shrink: 0;
    background: var(--card2);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; bottom: 0;
    z-index: 100;
    transition: transform 0.25s;
  }
  .sidebar-logo {
    padding: 1.5rem 1.25rem 1rem;
    border-bottom: 1px solid var(--border);
  }
  .sidebar-logo h1 { font-size: 1.1rem; font-weight: 600; color: var(--accent); letter-spacing: 0.02em; }
  .sidebar-logo p { font-size: 0.72rem; color: var(--text2); margin-top: 2px; }
  .sidebar-user {
    padding: 0.85rem 1.25rem;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 0.6rem;
  }
  .avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 600; flex-shrink: 0; }
  .avatar-sm { width: 26px; height: 26px; font-size: 0.65rem; }
  .avatar-lg { width: 44px; height: 44px; font-size: 1rem; }
  .sidebar-user-info { flex: 1; min-width: 0; }
  .sidebar-user-info p { font-size: 0.8rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sidebar-user-info span { font-size: 0.68rem; color: var(--text2); text-transform: capitalize; }
  .sidebar-nav { flex: 1; padding: 0.75rem 0; overflow-y: auto; }
  .sidebar-nav a {
    display: flex; align-items: center; gap: 0.65rem;
    padding: 0.55rem 1.25rem;
    font-size: 0.82rem; color: var(--text2);
    cursor: pointer; border-left: 2px solid transparent;
    transition: all 0.15s;
    text-decoration: none;
  }
  .sidebar-nav a:hover { color: var(--text); background: rgba(79,195,247,0.06); }
  .sidebar-nav a.active { color: var(--accent); border-left-color: var(--accent); background: rgba(79,195,247,0.09); }
  .sidebar-nav .section-label { font-size: 0.65rem; color: var(--text3); letter-spacing: 0.08em; text-transform: uppercase; padding: 0.9rem 1.25rem 0.3rem; }
  .sidebar-logout {
    padding: 1rem 1.25rem; border-top: 1px solid var(--border);
    font-size: 0.8rem; color: var(--text2); cursor: pointer;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .sidebar-logout:hover { color: var(--red); }

  /* mobile nav */
  .mobile-nav {
    display: none; position: fixed; bottom: 0; left: 0; right: 0;
    background: var(--card2); border-top: 1px solid var(--border);
    z-index: 100; padding: 0.5rem 0 env(safe-area-inset-bottom);
  }
  .mobile-nav-inner { display: flex; justify-content: space-around; }
  .mobile-nav-btn {
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    font-size: 0.6rem; color: var(--text2); cursor: pointer; padding: 0.3rem 0.5rem;
    background: none; border: none;
  }
  .mobile-nav-btn.active { color: var(--accent); }
  .mobile-nav-btn i { font-size: 1.3rem; }

  /* main content */
  .main { margin-left: 220px; flex: 1; padding: 1.75rem; min-height: 100vh; }
  .page-header { margin-bottom: 1.5rem; }
  .page-header h2 { font-size: 1.4rem; font-weight: 600; }
  .page-header p { font-size: 0.83rem; color: var(--text2); margin-top: 3px; }

  /* cards */
  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 1.25rem;
    margin-bottom: 1rem;
  }
  .card-title { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.9rem; color: var(--text); display: flex; align-items: center; gap: 0.5rem; }
  .card-title i { color: var(--accent); font-size: 1rem; }
  .card-sm { padding: 1rem; }

  /* stats row */
  .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem; }
  .stat-card { background: var(--card2); border: 1px solid var(--border); border-radius: var(--radius); padding: 0.9rem 1rem; }
  .stat-card .label { font-size: 0.68rem; color: var(--text2); text-transform: uppercase; letter-spacing: 0.06em; }
  .stat-card .value { font-size: 1.6rem; font-weight: 600; margin-top: 3px; }
  .stat-card .value.green { color: var(--green); }
  .stat-card .value.red { color: var(--red); }
  .stat-card .value.gold { color: var(--gold); }
  .stat-card .value.accent { color: var(--accent); }

  /* tables */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
  thead th { padding: 0.6rem 0.75rem; text-align: left; font-size: 0.68rem; font-weight: 500; color: var(--text2); text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid var(--border); white-space: nowrap; }
  tbody td { padding: 0.65rem 0.75rem; border-bottom: 1px solid rgba(79,195,247,0.06); vertical-align: middle; }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover td { background: rgba(79,195,247,0.04); }

  /* badges */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 9px; border-radius: 99px; font-size: 0.68rem; font-weight: 500; }
  .badge-green { background: rgba(102,187,106,0.15); color: var(--green); }
  .badge-red { background: rgba(239,83,80,0.15); color: var(--red); }
  .badge-gold { background: rgba(255,213,79,0.15); color: var(--gold); }
  .badge-accent { background: rgba(79,195,247,0.15); color: var(--accent); }
  .badge-muted { background: rgba(143,163,192,0.12); color: var(--text2); }

  /* buttons */
  .btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.45rem 1rem; border-radius: var(--radius);
    font-size: 0.82rem; font-weight: 500; cursor: pointer;
    border: 1px solid transparent; transition: all 0.15s;
    font-family: inherit;
  }
  .btn-primary { background: var(--accent); color: var(--navy); border-color: var(--accent); }
  .btn-primary:hover { background: var(--accent2); border-color: var(--accent2); }
  .btn-ghost { background: transparent; color: var(--text2); border-color: var(--border2); }
  .btn-ghost:hover { color: var(--text); border-color: var(--accent); }
  .btn-danger { background: transparent; color: var(--red); border-color: rgba(239,83,80,0.3); }
  .btn-danger:hover { background: rgba(239,83,80,0.1); }
  .btn-success { background: transparent; color: var(--green); border-color: rgba(102,187,106,0.3); }
  .btn-success:hover { background: rgba(102,187,106,0.1); }
  .btn-sm { padding: 0.3rem 0.7rem; font-size: 0.75rem; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* forms */
  .form-group { margin-bottom: 0.9rem; }
  .form-group label { display: block; font-size: 0.75rem; color: var(--text2); margin-bottom: 0.35rem; }
  .form-group input, .form-group select, .form-group textarea {
    width: 100%; background: var(--card2); border: 1px solid var(--border2);
    border-radius: var(--radius); padding: 0.5rem 0.75rem;
    color: var(--text); font-size: 0.83rem; font-family: inherit;
    transition: border-color 0.15s;
  }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
    outline: none; border-color: var(--accent);
  }
  .form-group select option { background: var(--navy2); }
  .form-group textarea { resize: vertical; min-height: 80px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

  /* toggle */
  .toggle-wrap { display: flex; align-items: center; gap: 0.6rem; }
  .toggle { position: relative; width: 38px; height: 22px; }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .toggle-slider {
    position: absolute; inset: 0;
    background: var(--border2); border-radius: 99px; cursor: pointer;
    transition: 0.2s;
  }
  .toggle-slider:before {
    content: ""; position: absolute; width: 16px; height: 16px;
    left: 3px; top: 3px; background: white; border-radius: 50%;
    transition: 0.2s;
  }
  .toggle input:checked + .toggle-slider { background: var(--accent); }
  .toggle input:checked + .toggle-slider:before { transform: translateX(16px); }

  /* practice card */
  .practice-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 1.1rem 1.25rem;
    margin-bottom: 0.75rem;
  }
  .practice-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
  .practice-card-meta { display: flex; gap: 1rem; margin-top: 0.5rem; flex-wrap: wrap; }
  .practice-meta-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.78rem; color: var(--text2); }
  .practice-card-actions { display: flex; gap: 0.5rem; margin-top: 0.85rem; flex-wrap: wrap; }

  /* lineup builder */
  .seat-row {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.55rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 0.4rem;
    background: var(--card2);
    transition: all 0.15s;
  }
  .seat-row:hover { border-color: var(--border2); }
  .seat-label { font-size: 0.72rem; color: var(--text2); width: 70px; flex-shrink: 0; }
  .seat-athlete { flex: 1; font-size: 0.82rem; }
  .seat-empty { color: var(--text3); font-style: italic; }

  /* ride card */
  .ride-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 1.1rem 1.25rem;
    margin-bottom: 0.75rem;
  }
  .ride-card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
  .passengers-list { display: flex; flex-direction: column; gap: 0.35rem; margin-top: 0.5rem; }
  .passenger-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--text2); }

  /* announcement */
  .announcement-item {
    border-left: 2px solid var(--accent);
    padding: 0.75rem 1rem;
    margin-bottom: 0.75rem;
    background: rgba(79,195,247,0.04);
    border-radius: 0 var(--radius) var(--radius) 0;
  }
  .announcement-item p { font-size: 0.83rem; line-height: 1.5; }
  .announcement-item .meta { font-size: 0.72rem; color: var(--text2); margin-top: 0.4rem; }

  /* toast */
  .toast {
    position: fixed; top: 1.25rem; right: 1.25rem;
    background: var(--card2); border: 1px solid var(--border2);
    border-radius: var(--radius); padding: 0.75rem 1rem;
    font-size: 0.83rem; z-index: 9999;
    display: flex; align-items: center; gap: 0.5rem;
    max-width: 300px; animation: slideIn 0.2s ease;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  }
  .toast.success { border-color: rgba(102,187,106,0.4); color: var(--green); }
  .toast.error { border-color: rgba(239,83,80,0.4); color: var(--red); }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

  /* modal backdrop */
  .modal-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
    z-index: 200; display: flex; align-items: center; justify-content: center;
    padding: 1rem;
  }
  .modal {
    background: var(--navy2); border: 1px solid var(--border2);
    border-radius: var(--radius-lg); padding: 1.5rem; width: 100%;
    max-width: 480px; max-height: 85vh; overflow-y: auto;
  }
  .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
  .modal-header h3 { font-size: 1rem; font-weight: 600; }
  .modal-footer { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.25rem; border-top: 1px solid var(--border); padding-top: 1rem; }

  /* login */
  .login-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--navy);
    background-image: radial-gradient(ellipse at 20% 50%, rgba(79,195,247,0.06) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(0,229,255,0.04) 0%, transparent 50%);
  }
  .login-box { background: var(--card2); border: 1px solid var(--border2); border-radius: var(--radius-lg); padding: 2rem; width: 100%; max-width: 380px; }
  .login-logo { text-align: center; margin-bottom: 1.75rem; }
  .login-logo h1 { font-size: 1.5rem; font-weight: 600; color: var(--accent); }
  .login-logo p { font-size: 0.8rem; color: var(--text2); margin-top: 4px; }
  .quick-logins { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem; }
  .quick-login-btn {
    flex: 1; min-width: 80px; padding: 0.4rem 0.5rem; font-size: 0.72rem;
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
    color: var(--text2); cursor: pointer; transition: all 0.15s; font-family: inherit;
    text-align: center;
  }
  .quick-login-btn:hover { border-color: var(--accent); color: var(--accent); }
  .quick-logins-label { font-size: 0.68rem; color: var(--text3); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.06em; }

  /* attendance dots */
  .att-dots { display: flex; gap: 3px; flex-wrap: wrap; }
  .att-dot { width: 8px; height: 8px; border-radius: 50%; }
  .att-dot-green { background: var(--green); }
  .att-dot-red { background: var(--red); }
  .att-dot-muted { background: var(--text3); }

  /* drag area */
  .drag-over { border-color: var(--accent) !important; background: rgba(79,195,247,0.08) !important; }

  /* divider */
  .divider { border: none; border-top: 1px solid var(--border); margin: 1rem 0; }

  /* section */
  .section { margin-bottom: 2rem; }
  .section-title { font-size: 0.72rem; color: var(--text2); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem; }

  /* chip */
  .chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 99px; font-size: 0.72rem; background: rgba(79,195,247,0.1); color: var(--accent); border: 1px solid rgba(79,195,247,0.2); }

  /* empty state */
  .empty-state { text-align: center; padding: 2.5rem 1rem; color: var(--text2); }
  .empty-state i { font-size: 2.5rem; color: var(--text3); margin-bottom: 0.75rem; }
  .empty-state p { font-size: 0.85rem; }

  /* responsive */
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); }
    .main { margin-left: 0; padding: 1rem; padding-bottom: 5rem; }
    .mobile-nav { display: block; }
    .form-row { grid-template-columns: 1fr; }
    .stats-row { grid-template-columns: repeat(2, 1fr); }
  }

  .hamburger {
    display: none; position: fixed; top: 1rem; left: 1rem; z-index: 150;
    background: var(--card2); border: 1px solid var(--border); border-radius: var(--radius);
    width: 36px; height: 36px; cursor: pointer; align-items: center; justify-content: center;
    color: var(--text);
  }
  @media (max-width: 768px) { .hamburger { display: flex; } }
  @media (max-width: 768px) { .main { padding-top: 3.5rem; } }
`;

// ─── APP STATE ────────────────────────────────────────────────────────────────
const useStore = () => {
  const storedData = loadAppData();
  const [users, setUsers] = useState(() => storedData.users);
  const [practices, setPractices] = useState(() => storedData.practices);
  const [attendance, setAttendance] = useState(() => storedData.attendance);
  const [boats, setBoats] = useState(() => storedData.boats);
  const [lineups, setLineups] = useState(() => storedData.lineups);
  const [templates, setTemplates] = useState(() => storedData.templates || []);
  const [rides, setRides] = useState(() => storedData.rides);
  const [announcements, setAnnouncements] = useState(() => storedData.announcements);
  const [reports, setReports] = useState(() => storedData.reports || []);

  useEffect(() => {
    const needsHashing = users.some(u => u.password && !isHashedPassword(u.password));
    if (!needsHashing) return;
    const migrate = async () => {
      const hashedUsers = await Promise.all(users.map(async (u) => ({
        ...u,
        password: isHashedPassword(u.password) ? u.password : await hashPassword(sanitizeString(u.password || "")),
      })));
      setUsers(hashedUsers);
    };
    migrate();
  }, []);

  useEffect(() => {
    saveAppData({ users, practices, attendance, boats, lineups, rides, announcements, templates, reports });
  }, [users, practices, attendance, boats, lineups, rides, announcements, templates, reports]);

  const getUser = (id) => users.find(u => u.id === id);
  const athletes = users.filter(u => u.role === "athlete");

  const getAttendance = (practiceId, athleteId) =>
    attendance.find(a => a.practiceId === practiceId && a.athleteId === athleteId);

  const setAttendanceStatus = (practiceId, athleteId, status, reason = "") => {
    setAttendance(prev => {
      const existing = prev.find(a => a.practiceId === practiceId && a.athleteId === athleteId);
      if (existing) {
        return prev.map(a =>
          a.practiceId === practiceId && a.athleteId === athleteId
            ? { ...a, status, reason } : a
        );
      }
      return [...prev, { id: `a${Date.now()}`, practiceId, athleteId, status, reason }];
    });
  };

  const getPracticeRide = (practiceId) => rides.find(r => r.practiceId === practiceId);
  const getPracticeLineups = (practiceId) => lineups.filter(l => l.practiceId === practiceId);

  const getUserLineup = (userId) => {
    for (const l of lineups) {
      const a = l.assignments.find(a => a.athleteId === userId);
      if (a) return { lineup: l, seat: a.seat };
    }
    return null;
  };

  const getUserRide = (userId) => {
    for (const sheet of rides) {
      for (const ride of sheet.rides) {
        if (ride.driverId === userId) return { type: "driver", ride, sheet };
        if (ride.passengerIds.includes(userId)) return { type: "passenger", ride, sheet };
      }
    }
    return null;
  };

  return {
    users, setUsers, practices, setPractices,
    attendance, setAttendance, boats, setBoats,
    lineups, setLineups, templates, setTemplates,
    rides, setRides, announcements, setAnnouncements,
    reports, setReports,
    getUser, athletes, getAttendance, setAttendanceStatus,
    getPracticeRide, getPracticeLineups, getUserLineup, getUserRide,
  };
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = ({ toast }) => toast ? (
  <div className={`toast ${toast.type}`}>
    <i className={`ti ${toast.type === "success" ? "ti-check" : "ti-alert-circle"}`}></i>
    {toast.msg}
  </div>
) : null;

const useToast = () => {
  const [toast, setToast] = useState(null);
  const show = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, footer }) => (
  <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div className="modal-header">
        <h3>{title}</h3>
        <button className="btn btn-ghost btn-sm" onClick={onClose}><i className="ti ti-x"></i></button>
      </div>
      {children}
      {footer && <div className="modal-footer">{footer}</div>}
    </div>
  </div>
);

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin, users }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const doLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === email);
    if (!user) {
      setErr("Invalid email or password");
      return;
    }
    verifyPassword(pass, user.password)
      .then(match => {
        if (match) { setErr(""); onLogin(user); }
        else setErr("Invalid email or password");
      })
      .catch(() => setErr("Invalid email or password"));
  };

  const quick = (u) => onLogin(u);

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <h1>⚡ Kharon</h1>
          <p>Rowing team management</p>
        </div>
        <p className="quick-logins-label">Quick login (demo)</p>
        <div className="quick-logins">
          {[
            { label: "Coach", u: users.find(u => u.role === "coach") },
            { label: "Secretary", u: users.find(u => u.role === "secretary") },
            { label: "Athlete", u: users.find(u => u.role === "athlete") },
          ].map(({ label, u }) => (
            <button key={label} className="quick-login-btn" onClick={() => quick(u)}>{label}</button>
          ))}
        </div>
        <hr className="divider" />
        <form onSubmit={doLogin}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@crew.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" />
          </div>
          {err && <p style={{ color: "var(--red)", fontSize: "0.78rem", marginBottom: "0.75rem" }}>{err}</p>}
          <button className="btn btn-primary" style={{ width: "100%" }} type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const ATHLETE_NAV = [
  { icon: "ti-layout-dashboard", label: "Dashboard", key: "home" },
  { icon: "ti-calendar", label: "Practices", key: "practices" },
  { icon: "ti-rowing", label: "My Lineup", key: "lineup" },
  { icon: "ti-car", label: "My Ride", key: "ride" },
  { icon: "ti-users", label: "Housing / Transport", key: "housing" },
  { icon: "ti-speakerphone", label: "Announcements", key: "announcements" },
  { icon: "ti-alert-triangle", label: "Report Missing", key: "report" },
];
const SECRETARY_NAV = [
  { icon: "ti-layout-dashboard", label: "Dashboard", key: "home" },
  { icon: "ti-users", label: "Team Members", key: "team" },
  { icon: "ti-clipboard-check", label: "Attendance", key: "attendance" },
  { icon: "ti-car", label: "Ride Sheets", key: "rides" },
  { icon: "ti-speakerphone", label: "Announcements", key: "announcements" },
];
const COACH_NAV = [
  { icon: "ti-layout-dashboard", label: "Dashboard", key: "home" },
  { icon: "ti-calendar", label: "Practices", key: "practices" },
  { icon: "ti-sail", label: "Boats", key: "boats" },
  { icon: "ti-list-numbers", label: "Lineup Builder", key: "lineup" },
  { icon: "ti-template", label: "Templates", key: "templates" },
  { icon: "ti-speakerphone", label: "Announcements", key: "announcements" },
];

const navByRole = { athlete: ATHLETE_NAV, secretary: SECRETARY_NAV, coach: COACH_NAV };

const Sidebar = ({ user, page, setPage, onLogout, open, setOpen }) => {
  const nav = navByRole[user.role] || [];
  return (
    <nav className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-logo">
        <h1>⚡ Kharon</h1>
        <p>Crew Team Management</p>
      </div>
      <div className="sidebar-user">
        <div className="avatar" style={{ background: avatarColor(user.id), color: "white" }}>{initials(user.name)}</div>
        <div className="sidebar-user-info">
          <p>{user.name}</p>
          <span>{user.role}</span>
        </div>
      </div>
      <div className="sidebar-nav">
        {nav.map(item => (
          <a key={item.key} className={page === item.key ? "active" : ""}
            onClick={() => { setPage(item.key); setOpen(false); }}>
            <i className={`ti ${item.icon}`}></i> {item.label}
          </a>
        ))}
      </div>
      <div className="sidebar-logout" onClick={onLogout}>
        <i className="ti ti-logout"></i> Sign out
      </div>
    </nav>
  );
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    confirmed: ["badge-green", "ti-check", "Confirmed"],
    declined: ["badge-red", "ti-x", "Declined"],
    no_response: ["badge-muted", "ti-clock", "No response"],
  };
  const [cls, icon, label] = map[status] || map.no_response;
  return <span className={`badge ${cls}`}><i className={`ti ${icon}`}></i>{label}</span>;
};

// ─── ATHLETE DASHBOARD ────────────────────────────────────────────────────────
const AthleteDashboard = ({ user, store, show }) => {
  const { practices, getAttendance, setAttendanceStatus, lineups, getUser, getUserLineup, getUserRide, rides, announcements, users, reports, setReports } = store;
  const upcomingPractices = practices.filter(p => new Date(p.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
  const confirmed = upcomingPractices.filter(p => getAttendance(p.id, user.id)?.status === "confirmed").length;

  return (
    <div>
      <div className="page-header">
        <h2>Welcome, {user.name.split(" ")[0]} 👋</h2>
        <p>Here's your team overview</p>
      </div>
      <div className="stats-row">
        <div className="stat-card"><div className="label">Upcoming</div><div className="value accent">{upcomingPractices.length}</div></div>
        <div className="stat-card"><div className="label">Confirmed</div><div className="value green">{confirmed}</div></div>
        <div className="stat-card"><div className="label">Pending</div><div className="value gold">{upcomingPractices.length - confirmed}</div></div>
      </div>
      <div className="section">
        <p className="section-title">Next Practice</p>
        {upcomingPractices[0] ? (
          <PracticeCard practice={upcomingPractices[0]} user={user} getAttendance={getAttendance} setAttendanceStatus={setAttendanceStatus} show={show} />
        ) : <div className="empty-state"><i className="ti ti-calendar-off"></i><p>No upcoming practices</p></div>}
      </div>
      <div className="section">
        <p className="section-title">Latest Announcement</p>
        {announcements.length ? (
          <div className="announcement-item">
            <p>{announcements[announcements.length - 1].message}</p>
            <div className="meta">From {getUser(announcements[announcements.length - 1].senderId)?.name} · {fmtTs(announcements[announcements.length - 1].timestamp)}</div>
          </div>
        ) : <div className="empty-state"><p>No announcements yet</p></div>}
      </div>
    </div>
  );
};

// ─── PRACTICE CARD (athlete) ──────────────────────────────────────────────────
const PracticeCard = ({ practice, user, getAttendance, setAttendanceStatus, show }) => {
  const att = getAttendance(practice.id, user.id);
  const [declining, setDeclining] = useState(false);
  const [reason, setReason] = useState(att?.reason || "");
  const isPast = new Date(practice.date) < new Date();

  return (
    <div className="practice-card">
      <div className="practice-card-header">
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{fmtDate(practice.date)}</div>
          <div className="practice-card-meta">
            <span className="practice-meta-item"><i className="ti ti-clock"></i>{fmtTime(practice.time)}</span>
            <span className="practice-meta-item"><i className="ti ti-map-pin"></i>{practice.location}</span>
          </div>
          {practice.notes && <p style={{ fontSize: "0.78rem", color: "var(--text2)", marginTop: "0.4rem" }}>{practice.notes}</p>}
        </div>
        <StatusBadge status={att?.status || "no_response"} />
      </div>
      {!isPast && (
        <div className="practice-card-actions">
          {declining ? (
            <div style={{ display: "flex", gap: "0.5rem", flex: 1, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <input value={reason} onChange={e => setReason(e.target.value)}
                  placeholder="Reason (optional)"
                  style={{ width: "100%", background: "var(--card2)", border: "1px solid var(--border2)", borderRadius: "var(--radius)", padding: "0.45rem 0.75rem", color: "var(--text)", fontSize: "0.8rem", fontFamily: "inherit" }} />
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => { setAttendanceStatus(practice.id, user.id, "declined", reason); setDeclining(false); show("Marked as declined"); }}>Confirm decline</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setDeclining(false)}>Cancel</button>
            </div>
          ) : (
            <>
              <button className="btn btn-success btn-sm" onClick={() => { setAttendanceStatus(practice.id, user.id, "confirmed"); show("Attendance confirmed!"); }}>
                <i className="ti ti-check"></i> Confirm
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => setDeclining(true)}>
                <i className="ti ti-x"></i> Decline
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ─── ATHLETE PRACTICES ────────────────────────────────────────────────────────
const AthletePractices = ({ user, store, show }) => {
  const { practices, getAttendance, setAttendanceStatus } = store;
  const sorted = [...practices].sort((a, b) => new Date(a.date) - new Date(b.date));
  return (
    <div>
      <div className="page-header"><h2>Practices</h2><p>Confirm or decline your attendance</p></div>
      {sorted.length === 0 && <div className="empty-state"><i className="ti ti-calendar-off"></i><p>No practices scheduled</p></div>}
      {sorted.map(p => <PracticeCard key={p.id} practice={p} user={user} getAttendance={getAttendance} setAttendanceStatus={setAttendanceStatus} show={show} />)}
    </div>
  );
};

// ─── ATHLETE LINEUP ───────────────────────────────────────────────────────────
const AthleteLineup = ({ user, store }) => {
  const { lineups, practices, boats, getUser } = store;
  const myLineups = [];
  for (const l of lineups) {
    if (l.assignments.some(a => a.athleteId === user.id)) myLineups.push(l);
  }
  return (
    <div>
      <div className="page-header"><h2>My Lineups</h2><p>Your boat seat assignments</p></div>
      {myLineups.length === 0 && <div className="empty-state"><i className="ti ti-rowing"></i><p>No lineups assigned yet</p></div>}
      {myLineups.map(l => {
        const practice = practices.find(p => p.id === l.practiceId);
        const boat = boats.find(b => b.id === l.boatId);
        const myAssignment = l.assignments.find(a => a.athleteId === user.id);
        return (
          <div key={l.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <div style={{ fontWeight: 600 }}>{boat?.name}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text2)", marginTop: "2px" }}>{practice ? fmtDate(practice.date) : ""}</div>
              </div>
              <span className="chip"><i className="ti ti-armchair"></i> {myAssignment?.seat}</span>
            </div>
            {l.assignments.map(a => (
              <div key={a.seat} className="seat-row" style={a.athleteId === user.id ? { borderColor: "var(--accent)", background: "rgba(79,195,247,0.08)" } : {}}>
                <span className="seat-label">{a.seat}</span>
                <span className="seat-athlete">{a.athleteId ? getUser(a.athleteId)?.name : <span className="seat-empty">—</span>}</span>
                {a.athleteId === user.id && <span className="badge badge-accent">You</span>}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

// ─── ATHLETE RIDE ─────────────────────────────────────────────────────────────
const AthleteRide = ({ user, store }) => {
  const { rides, practices, getUser } = store;
  const myRides = [];
  for (const sheet of rides) {
    for (const ride of sheet.rides) {
      if (ride.driverId === user.id || ride.passengerIds.includes(user.id)) {
        myRides.push({ sheet, ride });
      }
    }
  }
  return (
    <div>
      <div className="page-header"><h2>My Rides</h2><p>Your transportation assignments</p></div>
      {myRides.length === 0 && <div className="empty-state"><i className="ti ti-car"></i><p>No ride assignments yet</p></div>}
      {myRides.map(({ sheet, ride }, i) => {
        const practice = practices.find(p => p.id === sheet.practiceId);
        const driver = getUser(ride.driverId);
        const isDriver = ride.driverId === user.id;
        return (
          <div key={i} className="ride-card">
            <div className="ride-card-header">
              <div className="avatar" style={{ background: avatarColor(ride.driverId), color: "white" }}>{initials(driver?.name)}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{isDriver ? "You are driving" : `Driver: ${driver?.name}`}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text2)" }}>{practice ? fmtDate(practice.date) : ""}</div>
              </div>
              {isDriver && <span className="badge badge-accent" style={{ marginLeft: "auto" }}>Driver</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.82rem" }}>
              <div><span style={{ color: "var(--text2)" }}>Pickup</span><div style={{ marginTop: "2px" }}>{ride.pickupLocation}</div></div>
              <div><span style={{ color: "var(--text2)" }}>Time</span><div style={{ marginTop: "2px" }}>{ride.pickupTime}</div></div>
            </div>
            <div className="passengers-list" style={{ marginTop: "0.75rem" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Passengers</div>
              {ride.passengerIds.map(pid => (
                <div key={pid} className="passenger-row">
                  <div className="avatar avatar-sm" style={{ background: avatarColor(pid), color: "white" }}>{initials(getUser(pid)?.name)}</div>
                  {getUser(pid)?.name} {pid === user.id && <span className="badge badge-accent btn-sm">You</span>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── ATHLETE HOUSING ──────────────────────────────────────────────────────────
const AthleteHousing = ({ user, store, show }) => {
  const { setUsers } = store;
  const [housing, setHousing] = useState(user.housingLocation || "");
  const [isDriver, setIsDriver] = useState(user.isDriver || false);
  const [cap, setCap] = useState(user.carCapacity || 0);

  const save = () => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, housingLocation: sanitizeString(housing), isDriver, carCapacity: Number(cap) } : u));
    // update current user ref too — user prop passed from parent so show toast
    show("Housing info updated!");
  };

  return (
    <div>
      <div className="page-header"><h2>Housing & Transport</h2><p>Update your info for ride coordination</p></div>
      <div className="card">
        <div className="card-title"><i className="ti ti-home"></i>Housing Location</div>
        <div className="form-group">
          <label>Where do you live?</label>
          <input value={housing} onChange={e => setHousing(e.target.value)} placeholder="e.g. North Dorm, 123 Main St..." />
        </div>
        <hr className="divider" />
        <div className="card-title"><i className="ti ti-car"></i>Transportation</div>
        <div className="form-group">
          <div className="toggle-wrap">
            <label className="toggle">
              <input type="checkbox" checked={isDriver} onChange={e => setIsDriver(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
            <span style={{ fontSize: "0.85rem" }}>I am an available driver</span>
          </div>
        </div>
        {isDriver && (
          <div className="form-group">
            <label>Car capacity (passengers)</label>
            <input type="number" min={1} max={9} value={cap} onChange={e => setCap(e.target.value)} />
          </div>
        )}
        <button className="btn btn-primary" onClick={save}><i className="ti ti-device-floppy"></i>Save</button>
      </div>
    </div>
  );
};

// ─── ATHLETE REPORT ───────────────────────────────────────────────────────────
const AthleteReport = ({ user, store, show }) => {
  const { athletes, practices, setReports } = store;
  const [practiceId, setPracticeId] = useState(practices[0]?.id || "");
  const [missingId, setMissingId] = useState("");
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!missingId) return;
    setReports(prev => [...prev, { id: `rep${Date.now()}`, practiceId, reportedByAthleteId: user.id, missingAthleteId: missingId, notes: sanitizeString(notes), timestamp: new Date().toISOString() }]);
    setNotes(""); setMissingId("");
    show("Report submitted");
  };

  return (
    <div>
      <div className="page-header"><h2>Report Missing Teammate</h2><p>Alert the team if someone is missing</p></div>
      <div className="card">
        <div className="form-group">
          <label>Practice</label>
          <select value={practiceId} onChange={e => setPracticeId(e.target.value)}>
            {practices.map(p => <option key={p.id} value={p.id}>{fmtDate(p.date)} — {p.location}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Missing teammate</label>
          <select value={missingId} onChange={e => setMissingId(e.target.value)}>
            <option value="">Select athlete...</option>
            {athletes.filter(a => a.id !== user.id).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any additional context..." />
        </div>
        <button className="btn btn-primary" onClick={submit} disabled={!missingId}><i className="ti ti-send"></i>Submit report</button>
      </div>
    </div>
  );
};

// ─── SECRETARY DASHBOARD ──────────────────────────────────────────────────────
const SecretaryDashboard = ({ user, store }) => {
  const { practices, athletes, attendance, rides } = store;
  const upcoming = practices.filter(p => new Date(p.date) >= new Date());
  const confirmedAll = attendance.filter(a => a.status === "confirmed").length;
  const declinedAll = attendance.filter(a => a.status === "declined").length;
  const rideSheets = rides.length;

  return (
    <div>
      <div className="page-header"><h2>Secretary Dashboard</h2><p>Team management overview</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="label">Athletes</div><div className="value accent">{athletes.length}</div></div>
        <div className="stat-card"><div className="label">Upcoming</div><div className="value accent">{upcoming.length}</div></div>
        <div className="stat-card"><div className="label">Confirmed</div><div className="value green">{confirmedAll}</div></div>
        <div className="stat-card"><div className="label">Declined</div><div className="value red">{declinedAll}</div></div>
        <div className="stat-card"><div className="label">Ride Sheets</div><div className="value gold">{rideSheets}</div></div>
      </div>
      <div className="card">
        <div className="card-title"><i className="ti ti-activity"></i>Quick attendance — next practice</div>
        {upcoming[0] ? <AttendanceMini practice={upcoming[0]} store={store} /> : <p style={{ color: "var(--text2)", fontSize: "0.82rem" }}>No upcoming practices</p>}
      </div>
    </div>
  );
};

const AttendanceMini = ({ practice, store }) => {
  const { athletes, getAttendance, getUser } = store;
  const confirmed = athletes.filter(a => getAttendance(practice.id, a.id)?.status === "confirmed");
  const declined = athletes.filter(a => getAttendance(practice.id, a.id)?.status === "declined");
  const none = athletes.filter(a => !getAttendance(practice.id, a.id) || getAttendance(practice.id, a.id)?.status === "no_response");
  return (
    <div>
      <p style={{ fontSize: "0.8rem", color: "var(--text2)", marginBottom: "0.75rem" }}>{fmtDate(practice.date)} — {practice.location}</p>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <div><div style={{ fontSize: "0.68rem", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>✓ Confirmed ({confirmed.length})</div>
          {confirmed.map(a => <div key={a.id} style={{ fontSize: "0.78rem", marginBottom: "2px" }}>{a.name}</div>)}
        </div>
        <div><div style={{ fontSize: "0.68rem", color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>✗ Declined ({declined.length})</div>
          {declined.map(a => <div key={a.id} style={{ fontSize: "0.78rem", marginBottom: "2px" }}>{a.name}</div>)}
        </div>
        <div><div style={{ fontSize: "0.68rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>? No response ({none.length})</div>
          {none.map(a => <div key={a.id} style={{ fontSize: "0.78rem", marginBottom: "2px" }}>{a.name}</div>)}
        </div>
      </div>
    </div>
  );
};

// ─── SEC TEAM MEMBERS ─────────────────────────────────────────────────────────
const SecTeam = ({ store, show }) => {
  const { users, setUsers, athletes } = store;
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", housingLocation: "", isDriver: false, carCapacity: 0, role: "athlete", password: "pass123" });

  const openAdd = () => { setEditing(null); setForm({ name: "", email: "", phone: "", housingLocation: "", isDriver: false, carCapacity: 0, role: "athlete", password: "pass123" }); setShowModal(true); };
  const openEdit = (u) => { setEditing(u); setForm({ ...u, password: "" }); setShowModal(true); };
  const save = async () => {
    if (!form.name || !form.email) return;
    const normalized = {
      ...form,
      name: sanitizeString(form.name),
      email: sanitizeString(form.email).toLowerCase(),
      phone: sanitizeString(form.phone),
      housingLocation: sanitizeString(form.housingLocation),
      role: sanitizeString(form.role),
      isDriver: Boolean(form.isDriver),
      carCapacity: Number(form.carCapacity),
    };
    if (form.password) {
      normalized.password = await hashPassword(sanitizeString(form.password));
    } else if (editing) {
      delete normalized.password;
    }
    if (editing) {
      setUsers(prev => prev.map(u => u.id === editing.id ? { ...u, ...normalized } : u));
      show("Athlete updated");
    } else {
      setUsers(prev => [...prev, { ...normalized, id: `u${Date.now()}` }]);
      show("Athlete added");
    }
    setShowModal(false);
  };
  const remove = (id) => { setUsers(prev => prev.filter(u => u.id !== id)); show("Removed"); };

  const displayUsers = users.filter(u => u.role === "athlete" || u.role === "secretary");

  return (
    <div>
      <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div><h2>Team Members</h2><p>Manage athletes and staff</p></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="ti ti-plus"></i>Add athlete</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Housing</th><th>Driver</th><th>Cap</th><th>Role</th><th></th></tr></thead>
            <tbody>
              {displayUsers.map(u => (
                <tr key={u.id}>
                  <td><div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div className="avatar avatar-sm" style={{ background: avatarColor(u.id), color: "white" }}>{initials(u.name)}</div>
                    {u.name}
                  </div></td>
                  <td style={{ color: "var(--text2)" }}>{u.email}</td>
                  <td style={{ color: "var(--text2)" }}>{u.housingLocation || "—"}</td>
                  <td>{u.isDriver ? <span className="badge badge-green"><i className="ti ti-check"></i>Yes</span> : <span className="badge badge-muted">No</span>}</td>
                  <td>{u.isDriver ? u.carCapacity : "—"}</td>
                  <td><span className="badge badge-accent" style={{ textTransform: "capitalize" }}>{u.role}</span></td>
                  <td style={{ display: "flex", gap: "0.35rem" }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}><i className="ti ti-edit"></i></button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(u.id)}><i className="ti ti-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <Modal title={editing ? "Edit member" : "Add athlete"} onClose={() => setShowModal(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>Save</button></>}>
          <div className="form-row">
            <div className="form-group"><label>Name</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="form-group"><label>Email</label><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div className="form-group"><label>Role</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="athlete">Athlete</option><option value="secretary">Secretary</option>
              </select>
            </div>
          </div>
          <div className="form-group"><label>Housing location</label><input value={form.housingLocation} onChange={e => setForm(f => ({ ...f, housingLocation: e.target.value }))} /></div>
          <div className="form-group">
            <div className="toggle-wrap">
              <label className="toggle">
                <input type="checkbox" checked={form.isDriver} onChange={e => setForm(f => ({ ...f, isDriver: e.target.checked }))} />
                <span className="toggle-slider"></span>
              </label>
              <span style={{ fontSize: "0.82rem" }}>Available driver</span>
            </div>
          </div>
          {form.isDriver && <div className="form-group"><label>Car capacity</label><input type="number" min={1} max={9} value={form.carCapacity} onChange={e => setForm(f => ({ ...f, carCapacity: e.target.value }))} /></div>}
        </Modal>
      )}
    </div>
  );
};

// ─── SEC ATTENDANCE ───────────────────────────────────────────────────────────
const SecAttendance = ({ store }) => {
  const { practices, athletes, getAttendance } = store;
  const [selectedPractice, setSelectedPractice] = useState(practices[0]?.id || "");
  const practice = practices.find(p => p.id === selectedPractice);

  const confirmed = athletes.filter(a => getAttendance(selectedPractice, a.id)?.status === "confirmed");
  const declined = athletes.filter(a => getAttendance(selectedPractice, a.id)?.status === "declined");
  const none = athletes.filter(a => { const att = getAttendance(selectedPractice, a.id); return !att || att.status === "no_response"; });

  return (
    <div>
      <div className="page-header"><h2>Attendance Overview</h2><p>See who's confirmed for each practice</p></div>
      <div className="card card-sm">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Select practice</label>
          <select value={selectedPractice} onChange={e => setSelectedPractice(e.target.value)}>
            {practices.map(p => <option key={p.id} value={p.id}>{fmtDate(p.date)} — {p.location}</option>)}
          </select>
        </div>
      </div>
      {practice && (
        <div className="stats-row">
          <div className="stat-card"><div className="label">Confirmed</div><div className="value green">{confirmed.length}</div></div>
          <div className="stat-card"><div className="label">Declined</div><div className="value red">{declined.length}</div></div>
          <div className="stat-card"><div className="label">No response</div><div className="value gold">{none.length}</div></div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {[["Confirmed", confirmed, "badge-green", "ti-check"], ["Declined", declined, "badge-red", "ti-x"], ["No response", none, "badge-muted", "ti-clock"]].map(([label, list, badge, icon]) => (
          <div className="card" key={label}>
            <div className="card-title"><i className={`ti ${icon}`}></i>{label}</div>
            {list.length === 0 && <p style={{ fontSize: "0.8rem", color: "var(--text2)" }}>None</p>}
            {list.map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <div className="avatar avatar-sm" style={{ background: avatarColor(a.id), color: "white" }}>{initials(a.name)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.82rem" }}>{a.name}</div>
                  {label === "Declined" && getAttendance(selectedPractice, a.id)?.reason && <div style={{ fontSize: "0.7rem", color: "var(--text2)" }}>{getAttendance(selectedPractice, a.id).reason}</div>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SEC RIDES ────────────────────────────────────────────────────────────────
const SecRides = ({ store, show }) => {
  const { practices, athletes, getAttendance, rides, setRides, getUser } = store;
  const [selectedPractice, setSelectedPractice] = useState(practices[0]?.id || "");
  const [warning, setWarning] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editRide, setEditRide] = useState(null);

  const existingSheet = rides.find(r => r.practiceId === selectedPractice);

  const generate = () => {
    const confirmed = athletes.filter(a => getAttendance(selectedPractice, a.id)?.status === "confirmed");
    const drivers = confirmed.filter(a => a.isDriver && a.carCapacity > 0);
    const passengers = confirmed.filter(a => !a.isDriver);

    let totalCap = drivers.reduce((s, d) => s + d.carCapacity, 0);
    let warn = "";
    if (drivers.length === 0) { setWarning("No available drivers among confirmed athletes."); return; }
    if (totalCap < passengers.length) warn = `Warning: only ${totalCap} seats for ${passengers.length} passengers.`;

    // group passengers by location
    const remaining = [...passengers];
    const newRides = drivers.map(driver => {
      const cap = driver.carCapacity;
      const pass = [];
      // prefer same location
      const sameLocation = remaining.filter(p => p.housingLocation === driver.housingLocation);
      for (const p of sameLocation) {
        if (pass.length >= cap) break;
        pass.push(p); remaining.splice(remaining.indexOf(p), 1);
      }
      while (pass.length < cap && remaining.length > 0) pass.push(remaining.shift());
      return {
        driverId: driver.id,
        passengerIds: pass.map(p => p.id),
        pickupLocation: [driver.housingLocation, ...pass.map(p => p.housingLocation)].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(" / "),
        pickupTime: "05:30 AM",
      };
    });

    const sheet = { id: `r${Date.now()}`, practiceId: selectedPractice, rides: newRides };
    setRides(prev => [...prev.filter(r => r.practiceId !== selectedPractice), sheet]);
    setWarning(warn);
    show("Ride sheet generated!");
  };

  return (
    <div>
      <div className="page-header"><h2>Ride Sheets</h2><p>Generate and manage transportation</p></div>
      <div className="card card-sm" style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
        <div className="form-group" style={{ flex: 1, marginBottom: 0, minWidth: "180px" }}>
          <label>Practice</label>
          <select value={selectedPractice} onChange={e => { setSelectedPractice(e.target.value); setWarning(""); }}>
            {practices.map(p => <option key={p.id} value={p.id}>{fmtDate(p.date)} — {p.location}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={generate}><i className="ti ti-wand"></i>Generate ride sheet</button>
      </div>
      {warning && <div style={{ background: "rgba(255,167,38,0.12)", border: "1px solid rgba(255,167,38,0.3)", borderRadius: "var(--radius)", padding: "0.75rem 1rem", fontSize: "0.82rem", color: "var(--orange)", marginBottom: "1rem" }}><i className="ti ti-alert-triangle"></i> {warning}</div>}
      {!existingSheet && <div className="empty-state"><i className="ti ti-car-garage"></i><p>No ride sheet yet. Generate one above.</p></div>}
      {existingSheet && existingSheet.rides.map((ride, i) => {
        const driver = getUser(ride.driverId);
        return (
          <div key={i} className="ride-card">
            <div className="ride-card-header">
              <div className="avatar" style={{ background: avatarColor(ride.driverId), color: "white" }}>{initials(driver?.name)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{driver?.name} <span style={{ fontWeight: 400, color: "var(--text2)", fontSize: "0.78rem" }}>(driver)</span></div>
                <div style={{ fontSize: "0.72rem", color: "var(--text2)" }}>Capacity: {driver?.carCapacity}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => { setEditIdx(i); setEditRide({ ...ride, passengerIds: [...ride.passengerIds] }); }}><i className="ti ti-edit"></i>Edit</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.82rem", marginBottom: "0.75rem" }}>
              <div><span style={{ color: "var(--text2)" }}>Pickup</span><div>{ride.pickupLocation}</div></div>
              <div><span style={{ color: "var(--text2)" }}>Time</span><div>{ride.pickupTime}</div></div>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>Passengers</div>
            {ride.passengerIds.length === 0 && <p style={{ fontSize: "0.78rem", color: "var(--text3)" }}>No passengers assigned</p>}
            {ride.passengerIds.map(pid => (
              <div key={pid} className="passenger-row">
                <div className="avatar avatar-sm" style={{ background: avatarColor(pid), color: "white" }}>{initials(getUser(pid)?.name)}</div>
                {getUser(pid)?.name} <span style={{ fontSize: "0.72rem", color: "var(--text2)" }}>— {getUser(pid)?.housingLocation}</span>
              </div>
            ))}
          </div>
        );
      })}
      {editRide && (
        <Modal title="Edit ride assignment" onClose={() => setEditIdx(null)}
          footer={<>
            <button className="btn btn-ghost" onClick={() => setEditIdx(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => {
              setRides(prev => prev.map(sheet =>
                sheet.practiceId === selectedPractice
                  ? { ...sheet, rides: sheet.rides.map((r, i) => i === editIdx ? editRide : r) }
                  : sheet
              ));
              setEditIdx(null); show("Ride updated");
            }}>Save</button>
          </>}>
          <div className="form-group"><label>Pickup location</label>
            <input value={editRide.pickupLocation} onChange={e => setEditRide(r => ({ ...r, pickupLocation: e.target.value }))} />
          </div>
          <div className="form-group"><label>Pickup time</label>
            <input value={editRide.pickupTime} onChange={e => setEditRide(r => ({ ...r, pickupTime: e.target.value }))} />
          </div>
          <div className="form-group"><label>Passengers (select)</label>
            <select multiple value={editRide.passengerIds} style={{ height: "120px" }}
              onChange={e => setEditRide(r => ({ ...r, passengerIds: Array.from(e.target.selectedOptions).map(o => o.value) }))}>
              {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── ANNOUNCEMENTS (shared) ───────────────────────────────────────────────────
const AnnouncementsPage = ({ user, store, show }) => {
  const { announcements, setAnnouncements, getUser } = store;
  const [msg, setMsg] = useState("");
  const [group, setGroup] = useState("entire_team");
  const canSend = user.role === "secretary" || user.role === "coach";
  const sorted = [...announcements].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const send = () => {
    if (!msg.trim()) return;
    setAnnouncements(prev => [...prev, { id: `an${Date.now()}`, senderId: user.id, message: sanitizeString(msg), recipientGroup: sanitizeString(group), timestamp: new Date().toISOString() }]);
    setMsg(""); show("Announcement sent!");
  };

  const groupLabel = { entire_team: "Entire team", confirmed: "Confirmed athletes", drivers: "Drivers only", specific_boat: "Specific boat" };

  return (
    <div>
      <div className="page-header"><h2>Announcements</h2><p>Team-wide messages</p></div>
      {canSend && (
        <div className="card">
          <div className="card-title"><i className="ti ti-speakerphone"></i>Send announcement</div>
          <div className="form-group"><label>Message</label>
            <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Write your message..." />
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div className="form-group" style={{ flex: 1, minWidth: "160px", marginBottom: 0 }}>
              <label>Recipients</label>
              <select value={group} onChange={e => setGroup(e.target.value)}>
                <option value="entire_team">Entire team</option>
                <option value="confirmed">Confirmed athletes</option>
                <option value="drivers">Drivers only</option>
                <option value="specific_boat">Specific boat lineup</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={send} disabled={!msg.trim()}><i className="ti ti-send"></i>Send</button>
          </div>
        </div>
      )}
      <div className="section">
        <p className="section-title">Recent announcements</p>
        {sorted.length === 0 && <div className="empty-state"><i className="ti ti-message-off"></i><p>No announcements yet</p></div>}
        {sorted.map(a => {
          const sender = getUser(a.senderId);
          return (
            <div key={a.id} className="announcement-item">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <div className="avatar avatar-sm" style={{ background: avatarColor(a.senderId), color: "white" }}>{initials(sender?.name)}</div>
                <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>{sender?.name}</span>
                <span className="badge badge-muted" style={{ marginLeft: "auto" }}>{groupLabel[a.recipientGroup]}</span>
              </div>
              <p>{a.message}</p>
              <div className="meta">{fmtTs(a.timestamp)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── COACH DASHBOARD ──────────────────────────────────────────────────────────
const CoachDashboard = ({ user, store }) => {
  const { practices, athletes, attendance, lineups, boats } = store;
  const upcoming = practices.filter(p => new Date(p.date) >= new Date());
  const confirmed = attendance.filter(a => a.status === "confirmed").length;
  return (
    <div>
      <div className="page-header"><h2>Coach Dashboard</h2><p>Practice management overview</p></div>
      <div className="stats-row">
        <div className="stat-card"><div className="label">Upcoming</div><div className="value accent">{upcoming.length}</div></div>
        <div className="stat-card"><div className="label">Athletes</div><div className="value accent">{athletes.length}</div></div>
        <div className="stat-card"><div className="label">Confirmed</div><div className="value green">{confirmed}</div></div>
        <div className="stat-card"><div className="label">Boats</div><div className="value gold">{boats.length}</div></div>
        <div className="stat-card"><div className="label">Lineups</div><div className="value accent">{lineups.length}</div></div>
      </div>
      <div className="section">
        <p className="section-title">Upcoming practices</p>
        {upcoming.slice(0, 2).map(p => {
          const conf = athletes.filter(a => attendance.find(att => att.practiceId === p.id && att.athleteId === a.id && att.status === "confirmed")).length;
          const dec = athletes.filter(a => attendance.find(att => att.practiceId === p.id && att.athleteId === a.id && att.status === "declined")).length;
          return (
            <div key={p.id} className="practice-card">
              <div className="practice-card-header">
                <div>
                  <div style={{ fontWeight: 600 }}>{fmtDate(p.date)}</div>
                  <div className="practice-card-meta">
                    <span className="practice-meta-item"><i className="ti ti-clock"></i>{fmtTime(p.time)}</span>
                    <span className="practice-meta-item"><i className="ti ti-map-pin"></i>{p.location}</span>
                  </div>
                </div>
                <div className="att-dots">
                  {athletes.map(a => {
                    const att = attendance.find(att => att.practiceId === p.id && att.athleteId === a.id);
                    return <div key={a.id} className={`att-dot ${att?.status === "confirmed" ? "att-dot-green" : att?.status === "declined" ? "att-dot-red" : "att-dot-muted"}`} title={`${a.name}: ${att?.status || "no_response"}`}></div>;
                  })}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <span className="badge badge-green"><i className="ti ti-check"></i>{conf}</span>
                <span className="badge badge-red"><i className="ti ti-x"></i>{dec}</span>
                <span className="badge badge-muted"><i className="ti ti-clock"></i>{athletes.length - conf - dec}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── COACH PRACTICES ──────────────────────────────────────────────────────────
const CoachPractices = ({ user, store, show }) => {
  const { practices, setPractices, athletes, attendance, getAttendance } = store;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ date: "", time: "06:00", location: "Riverside Boathouse", notes: "" });

  const create = () => {
    if (!form.date) return;
    const p = { id: `p${Date.now()}`, ...form, location: sanitizeString(form.location), notes: sanitizeString(form.notes), createdBy: user.id };
    setPractices(prev => [...prev, p]);
    setForm({ date: "", time: "06:00", location: "Riverside Boathouse", notes: "" });
    setShowModal(false); show("Practice created!");
  };
  const remove = (id) => { setPractices(prev => prev.filter(p => p.id !== id)); show("Practice removed"); };

  const sorted = [...practices].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div><h2>Practice Schedule</h2><p>Create and manage practices</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><i className="ti ti-plus"></i>New practice</button>
      </div>
      {sorted.map(p => {
        const isPast = new Date(p.date) < new Date();
        const conf = athletes.filter(a => getAttendance(p.id, a.id)?.status === "confirmed");
        const dec = athletes.filter(a => getAttendance(p.id, a.id)?.status === "declined");
        const none = athletes.filter(a => { const att = getAttendance(p.id, a.id); return !att || att.status === "no_response"; });
        return (
          <div key={p.id} className="practice-card" style={isPast ? { opacity: 0.6 } : {}}>
            <div className="practice-card-header">
              <div>
                <div style={{ fontWeight: 600 }}>{fmtDate(p.date)} {isPast && <span className="badge badge-muted">Past</span>}</div>
                <div className="practice-card-meta">
                  <span className="practice-meta-item"><i className="ti ti-clock"></i>{fmtTime(p.time)}</span>
                  <span className="practice-meta-item"><i className="ti ti-map-pin"></i>{p.location}</span>
                </div>
                {p.notes && <p style={{ fontSize: "0.78rem", color: "var(--text2)", marginTop: "0.3rem" }}>{p.notes}</p>}
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => remove(p.id)}><i className="ti ti-trash"></i></button>
            </div>
            <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
              {[["Confirmed", conf, "var(--green)"], ["Declined", dec, "var(--red)"], ["No response", none, "var(--text3)"]].map(([label, list, color]) => (
                <div key={label}>
                  <div style={{ fontSize: "0.65rem", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>{label} ({list.length})</div>
                  <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                    {list.map(a => <div key={a.id} className="att-dot" style={{ background: color }} title={a.name}></div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {showModal && (
        <Modal title="New practice" onClose={() => setShowModal(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={create}>Create</button></>}>
          <div className="form-row">
            <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="form-group"><label>Time</label><input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></div>
          </div>
          <div className="form-group"><label>Location</label><input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
          <div className="form-group"><label>Notes</label><textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Practice plan..." /></div>
        </Modal>
      )}
    </div>
  );
};

// ─── COACH BOATS ──────────────────────────────────────────────────────────────
const CoachBoats = ({ store, show }) => {
  const { boats, setBoats } = store;
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", type: "Eight", seatCount: 8, requiresCoxswain: true });

  const openEdit = (b) => { setEditing(b); setForm({ ...b }); setShowModal(true); };
  const openAdd = () => { setEditing(null); setForm({ name: "", type: "Eight", seatCount: 8, requiresCoxswain: true }); setShowModal(true); };
  const save = () => {
    if (!form.name) return;
    const safeBoat = { ...form, name: sanitizeString(form.name), type: sanitizeString(form.type), seatCount: Number(form.seatCount) };
    if (editing) setBoats(prev => prev.map(b => b.id === editing.id ? { ...b, ...safeBoat } : b));
    else setBoats(prev => [...prev, { ...safeBoat, id: `b${Date.now()}` }]);
    setShowModal(false); show(editing ? "Boat updated" : "Boat added");
  };
  const remove = (id) => { setBoats(prev => prev.filter(b => b.id !== id)); show("Boat removed"); };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div><h2>Boats</h2><p>Manage available boats</p></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="ti ti-plus"></i>Add boat</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Type</th><th>Seats</th><th>Coxswain</th><th></th></tr></thead>
            <tbody>
              {boats.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 500 }}>{b.name}</td>
                  <td>{b.type}</td>
                  <td>{b.seatCount}</td>
                  <td>{b.requiresCoxswain ? <span className="badge badge-green">Required</span> : <span className="badge badge-muted">No</span>}</td>
                  <td style={{ display: "flex", gap: "0.35rem" }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(b)}><i className="ti ti-edit"></i></button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(b.id)}><i className="ti ti-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <Modal title={editing ? "Edit boat" : "Add boat"} onClose={() => setShowModal(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>Save</button></>}>
          <div className="form-group"><label>Boat name</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Varsity 8+" /></div>
          <div className="form-row">
            <div className="form-group"><label>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {["Eight", "Four", "Pair", "Double", "Single", "Quad"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Seat count</label><input type="number" min={1} max={9} value={form.seatCount} onChange={e => setForm(f => ({ ...f, seatCount: Number(e.target.value) }))} /></div>
          </div>
          <div className="form-group">
            <div className="toggle-wrap">
              <label className="toggle"><input type="checkbox" checked={form.requiresCoxswain} onChange={e => setForm(f => ({ ...f, requiresCoxswain: e.target.checked }))} /><span className="toggle-slider"></span></label>
              <span style={{ fontSize: "0.82rem" }}>Requires coxswain</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── COACH LINEUP BUILDER ─────────────────────────────────────────────────────
const CoachLineup = ({ user, store, show }) => {
  const { practices, boats, athletes, getAttendance, lineups, setLineups } = store;
  const [selectedPractice, setSelectedPractice] = useState(practices[0]?.id || "");
  const [selectedBoat, setSelectedBoat] = useState(boats[0]?.id || "");
  const [assignments, setAssignments] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [dragAthlete, setDragAthlete] = useState(null);

  const practice = practices.find(p => p.id === selectedPractice);
  const boat = boats.find(b => b.id === selectedBoat);
  const seatLabels = getSeatLabels(boat);

  useEffect(() => {
    const existing = lineups.find(l => l.practiceId === selectedPractice && l.boatId === selectedBoat);
    if (existing) {
      const map = {};
      existing.assignments.forEach(a => { map[a.seat] = a.athleteId; });
      setAssignments(map);
    } else {
      setAssignments({});
    }
  }, [selectedPractice, selectedBoat]);

  const availableAthletes = athletes.filter(a =>
    showAll || getAttendance(selectedPractice, a.id)?.status === "confirmed"
  );
  const assignedIds = Object.values(assignments);

  const saveLineup = () => {
    const assgArr = seatLabels.map(s => ({ seat: s, athleteId: assignments[s] || "" }));
    const existing = lineups.find(l => l.practiceId === selectedPractice && l.boatId === selectedBoat);
    if (existing) setLineups(prev => prev.map(l => l.practiceId === selectedPractice && l.boatId === selectedBoat ? { ...l, assignments: assgArr } : l));
    else setLineups(prev => [...prev, { id: `l${Date.now()}`, practiceId: selectedPractice, boatId: selectedBoat, assignments: assgArr }]);
    show("Lineup saved!");
  };

  return (
    <div>
      <div className="page-header"><h2>Lineup Builder</h2><p>Assign athletes to boat seats</p></div>
      <div className="card card-sm" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <div className="form-group" style={{ flex: 1, marginBottom: 0, minWidth: "150px" }}>
          <label>Practice</label>
          <select value={selectedPractice} onChange={e => setSelectedPractice(e.target.value)}>
            {practices.map(p => <option key={p.id} value={p.id}>{fmtDate(p.date)}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1, marginBottom: 0, minWidth: "150px" }}>
          <label>Boat</label>
          <select value={selectedBoat} onChange={e => setSelectedBoat(e.target.value)}>
            {boats.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "1rem" }}>
        <div className="card">
          <div className="card-title"><i className="ti ti-rowing"></i>Boat seats — {boat?.name}</div>
          {seatLabels.map(seat => (
            <div key={seat} className="seat-row"
              onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("drag-over"); }}
              onDragLeave={e => e.currentTarget.classList.remove("drag-over")}
              onDrop={e => {
                e.currentTarget.classList.remove("drag-over");
                if (dragAthlete) setAssignments(prev => ({ ...prev, [seat]: dragAthlete }));
              }}>
              <span className="seat-label">{seat}</span>
              <span className="seat-athlete">
                {assignments[seat]
                  ? <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <div className="avatar avatar-sm" style={{ background: avatarColor(assignments[seat]), color: "white" }}>{initials(athletes.find(a => a.id === assignments[seat])?.name)}</div>
                    {athletes.find(a => a.id === assignments[seat])?.name}
                  </span>
                  : <span className="seat-empty">Drop athlete here</span>}
              </span>
              {assignments[seat] && (
                <button className="btn btn-ghost btn-sm" onClick={() => setAssignments(prev => { const n = { ...prev }; delete n[seat]; return n; })}><i className="ti ti-x"></i></button>
              )}
            </div>
          ))}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={saveLineup}><i className="ti ti-device-floppy"></i>Save lineup</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setAssignments({})}><i className="ti ti-eraser"></i>Clear</button>
          </div>
        </div>
        <div className="card" style={{ height: "fit-content" }}>
          <div className="card-title" style={{ justifyContent: "space-between" }}>
            <span><i className="ti ti-users"></i>Athletes</span>
            <label className="toggle" style={{ width: 32 }}>
              <input type="checkbox" checked={showAll} onChange={e => setShowAll(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <p style={{ fontSize: "0.68rem", color: "var(--text2)", marginBottom: "0.75rem" }}>{showAll ? "All athletes" : "Confirmed only"}</p>
          {availableAthletes.map(a => {
            const assigned = assignedIds.includes(a.id);
            return (
              <div key={a.id} draggable
                onDragStart={() => setDragAthlete(a.id)}
                onDragEnd={() => setDragAthlete(null)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.45rem 0.6rem", borderRadius: "var(--radius)",
                  marginBottom: "0.3rem", cursor: "grab",
                  background: assigned ? "rgba(79,195,247,0.08)" : "var(--card2)",
                  border: `1px solid ${assigned ? "var(--accent)" : "var(--border)"}`,
                  opacity: assigned ? 0.6 : 1,
                  fontSize: "0.8rem",
                }}>
                <div className="avatar avatar-sm" style={{ background: avatarColor(a.id), color: "white" }}>{initials(a.name)}</div>
                <span style={{ flex: 1 }}>{a.name}</span>
                {assigned && <i className="ti ti-check" style={{ color: "var(--accent)", fontSize: "0.75rem" }}></i>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── LINEUP TEMPLATES ─────────────────────────────────────────────────────────
const LineupTemplates = ({ user, store, show }) => {
  const { templates, setTemplates, lineups, boats, athletes } = store;
  const [showSave, setShowSave] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveLineupId, setSaveLineupId] = useState(lineups[0]?.id || "");

  const saveTemplate = () => {
    const lineup = lineups.find(l => l.id === saveLineupId);
    if (!lineup || !saveName) return;
    setTemplates(prev => [...prev, { id: `t${Date.now()}`, name: saveName, boatId: lineup.boatId, assignments: lineup.assignments, createdBy: user.id }]);
    setSaveName(""); setShowSave(false); show("Template saved!");
  };
  const deleteTemplate = (id) => { setTemplates(prev => prev.filter(t => t.id !== id)); show("Template deleted"); };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div><h2>Lineup Templates</h2><p>Save and reuse lineup configurations</p></div>
        <button className="btn btn-primary" onClick={() => setShowSave(true)}><i className="ti ti-bookmark"></i>Save current lineup</button>
      </div>
      {templates.length === 0 && <div className="empty-state"><i className="ti ti-template"></i><p>No templates yet. Build a lineup and save it as a template.</p></div>}
      {templates.map(t => {
        const boat = boats.find(b => b.id === t.boatId);
        return (
          <div key={t.id} className="card">
            <div className="card-title" style={{ justifyContent: "space-between" }}>
              <span><i className="ti ti-template"></i>{t.name}</span>
              <button className="btn btn-danger btn-sm" onClick={() => deleteTemplate(t.id)}><i className="ti ti-trash"></i></button>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text2)", marginBottom: "0.75rem" }}>{boat?.name}</p>
            {t.assignments.filter(a => a.athleteId).map(a => (
              <div key={a.seat} style={{ display: "flex", gap: "0.75rem", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                <span style={{ color: "var(--text2)", width: "70px" }}>{a.seat}</span>
                <span>{athletes.find(at => at.id === a.athleteId)?.name || "—"}</span>
              </div>
            ))}
          </div>
        );
      })}
      {showSave && (
        <Modal title="Save lineup as template" onClose={() => setShowSave(false)}
          footer={<><button className="btn btn-ghost" onClick={() => setShowSave(false)}>Cancel</button><button className="btn btn-primary" onClick={saveTemplate}>Save</button></>}>
          <div className="form-group"><label>Template name</label><input value={saveName} onChange={e => setSaveName(e.target.value)} placeholder="e.g. Varsity A lineup" /></div>
          <div className="form-group"><label>Lineup</label>
            <select value={saveLineupId} onChange={e => setSaveLineupId(e.target.value)}>
              {lineups.map(l => { const boat = boats.find(b => b.id === l.boatId); return <option key={l.id} value={l.id}>{boat?.name || l.id}</option>; })}
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const store = useStore();
  const { toast, show } = useToast();

  const logout = () => { setCurrentUser(null); setPage("home"); };
  const login = (user) => { setCurrentUser(user); setPage("home"); };

  // sync user changes back to currentUser
  useEffect(() => {
    if (currentUser) {
      const updated = store.users.find(u => u.id === currentUser.id);
      if (updated) setCurrentUser(updated);
    }
  }, [store.users]);

  const renderPage = () => {
    if (!currentUser) return null;
    const role = currentUser.role;

    // Athlete pages
    if (role === "athlete") {
      switch (page) {
        case "home": return <AthleteDashboard user={currentUser} store={store} show={show} />;
        case "practices": return <AthletePractices user={currentUser} store={store} show={show} />;
        case "lineup": return <AthleteLineup user={currentUser} store={store} />;
        case "ride": return <AthleteRide user={currentUser} store={store} />;
        case "housing": return <AthleteHousing user={currentUser} store={store} show={show} />;
        case "announcements": return <AnnouncementsPage user={currentUser} store={store} show={show} />;
        case "report": return <AthleteReport user={currentUser} store={store} show={show} />;
        default: return null;
      }
    }

    // Secretary pages
    if (role === "secretary") {
      switch (page) {
        case "home": return <SecretaryDashboard user={currentUser} store={store} />;
        case "team": return <SecTeam store={store} show={show} />;
        case "attendance": return <SecAttendance store={store} />;
        case "rides": return <SecRides store={store} show={show} />;
        case "announcements": return <AnnouncementsPage user={currentUser} store={store} show={show} />;
        default: return null;
      }
    }

    // Coach pages
    if (role === "coach") {
      switch (page) {
        case "home": return <CoachDashboard user={currentUser} store={store} />;
        case "practices": return <CoachPractices user={currentUser} store={store} show={show} />;
        case "boats": return <CoachBoats store={store} show={show} />;
        case "lineup": return <CoachLineup user={currentUser} store={store} show={show} />;
        case "templates": return <LineupTemplates user={currentUser} store={store} show={show} />;
        case "announcements": return <AnnouncementsPage user={currentUser} store={store} show={show} />;
        default: return null;
      }
    }
  };

  const mobileNavItems = currentUser ? (navByRole[currentUser.role] || []).slice(0, 5) : [];

  return (
    <>
      <style>{css}</style>
      {!currentUser ? (
        <LoginPage onLogin={login} users={store.users} />
      ) : (
        <div className="app">
          {sidebarOpen && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 99 }} onClick={() => setSidebarOpen(false)} />}
          <button className="hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Menu">
            <i className="ti ti-menu-2"></i>
          </button>
          <Sidebar user={currentUser} page={page} setPage={setPage} onLogout={logout} open={sidebarOpen} setOpen={setSidebarOpen} />
          <main className="main">
            {renderPage()}
          </main>
          <nav className="mobile-nav">
            <div className="mobile-nav-inner">
              {mobileNavItems.map(item => (
                <button key={item.key} className={`mobile-nav-btn ${page === item.key ? "active" : ""}`} onClick={() => setPage(item.key)}>
                  <i className={`ti ${item.icon}`}></i>
                  <span>{item.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
      <Toast toast={toast} />
    </>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root')); root.render(<App />);
