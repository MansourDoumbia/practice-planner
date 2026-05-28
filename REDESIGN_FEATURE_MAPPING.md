# Kharon — Redesign Feature Mapping

Purpose: map every interactive element, data field, and persistence point in the existing site so visual redesign keeps 1:1 functionality.

---

## High-level pages / routes (keys used in app)
- Login: `LoginPage` (quick-login buttons + email/password form)
- Athlete: `home`, `practices`, `lineup`, `ride`, `housing`, `announcements`, `report`
- Secretary: `home`, `team`, `attendance`, `rides`, `announcements`
- Coach: `home`, `practices`, `boats`, `lineup`, `templates`, `announcements`

Each of those page keys is presented from the left `Sidebar` and mobile bar (first 5 items).

---

## Global interactive elements
- Left `Sidebar` navigation links (click sets `page`) and persistent across flows.
- `Logout` button (calls `logout` -> clears `currentUser`).
- Mobile bottom nav (subset of sidebar items).
- Global toasts via `useToast().show(msg)`.
- Modal component `Modal` used across create/edit flows — click outside closes.

---

## Data stores & persistence
- Client-side persistence only: `localStorage` key: `practicePlannerData` (see `STORAGE_KEY`).
- Load/save helpers: `loadAppData()`, `saveAppData(data)`; data sanitized via `sanitizeAll` before save.
- In-memory React store: `useStore()` exposes getters/setters for all collections and autosaves on change.
- Password hashing & migration: `hashPassword`, `verifyPassword`, `isHashedPassword`. `useEffect` migrates plain passwords to hashed values on first run.

---

## Primary data models and fields (exact schema)
- User (`users` array): { id, name, email, phone, role (athlete|secretary|coach), housingLocation, isDriver (bool), carCapacity (number), password }
- Practice (`practices`): { id, date (ISO), time (HH:MM), location, notes, createdBy }
- Attendance (`attendance`): { id, practiceId, athleteId, status (confirmed|declined|no_response), reason }
- Boats (`boats`): { id, name, type, seatCount, requiresCoxswain }
- Lineups (`lineups`): { id, practiceId, boatId, assignments: [{ seat, athleteId }] }
- Rides (`rides`): [{ id, practiceId, rides: [{ driverId, passengerIds: [], pickupLocation, pickupTime }] }]
- Announcements (`announcements`): { id, senderId, message, recipientGroup, timestamp }
- Templates (`templates`): { id, name, boatId, assignments, createdBy }
- Reports (`reports`): { id, practiceId, reportedByAthleteId, missingAthleteId, notes, timestamp }

All fields above must be preserved unchanged during redesign.

---

## Interactive elements by page (exact controls to preserve)
- LoginPage
  - Email input, Password input, Submit (`Sign in`), Quick-login buttons: Coach / Secretary / Athlete.

- Athlete Dashboard (`home`)
  - Practice cards: status badge, Confirm button, Decline button -> Decline shows inline reason input + Confirm decline.
  - Latest Announcement card (read-only).
  - Stats cards (Upcoming, Confirmed, Pending) — derived values.

- Practices (Athlete + Coach views)
  - Practice list rows (clickable controls in Coach view: create new, delete). Coach: New practice modal with Date/Time/Location/Notes.
  - Athlete: list of `PracticeCard`s with Confirm/Decline workflow.

- Lineup Builder (Coach)
  - Practice select, Boat select.
  - Drag+drop athlete items into seat slots (seat drop target), `Save lineup`, `Clear`.
  - Toggle: `Show all` vs `Confirmed only`.

- Lineups (Athlete view)
  - Read-only seat rows with `You` badge if assigned.

- Boats (Coach)
  - Add / Edit / Delete boat modal (name, type, seat count, requiresCoxswain).

- Team Members (Secretary)
  - Table with rows, Edit modal (name, email, phone, housing, role, driver toggle, cap, password field), Add athlete modal, Delete.

- Attendance (Secretary)
  - Practice selector dropdown, stat cards (Confirmed/Declined/No response), lists of athletes per status (readable rows).

- Ride Sheets (Secretary)
  - Practice selector, `Generate ride sheet` button (algorithm uses confirmed + drivers/capacity).
  - Per-ride edit modal (pickupLocation, pickupTime, passengers multi-select).

- Announcements
  - Textarea for message, Recipients select, `Send` button (permissioned to coach/secretary).
  - List of recent announcements (sender avatar, recipient badge, timestamp).

- Reports (Athlete)
  - Practice select, Missing teammate select, Notes textarea, Submit button.

- Housing & Transport (Athlete)
  - Housing input, Driver toggle, Car capacity numeric input, `Save` button.

- Templates
  - Save current lineup modal (name + lineup select), Delete template.

- Misc
  - Various small controls: toggles, select multiples, drag/drop, table row actions, toasts, inline reason input for decline.

---

## Derived metrics & where they appear
- Counts (Upcoming, Confirmed, Declined, Athletes, Boats, Lineups, Ride Sheets) — appear on dashboards and stat cards. These are computed client-side from arrays above.

---

## Current external API / network usage
- None. App is fully client-only; no network requests. Any server migration must implement endpoints that map 1:1 to client CRUD operations below.

Suggested minimal API endpoints to preserve functionality (one-to-one mapping):
- Auth: POST /auth/login (email+password) -> token/session
- Users: GET /users, POST /users, PUT /users/:id, DELETE /users/:id
- Practices: GET /practices, POST /practices, PUT /practices/:id, DELETE /practices/:id
- Attendance: GET /practices/:id/attendance, POST /attendance, PUT /attendance/:id
- Boats: GET/POST/PUT/DELETE /boats
- Lineups: GET /lineups, POST /lineups, PUT /lineups/:id
- Rides: GET /rides, POST /rides, PUT /rides/:id
- Announcements: GET /announcements, POST /announcements
- Templates: GET /templates, POST /templates, DELETE /templates/:id
- Reports: GET /reports, POST /reports

Auth considerations: keep password hashing server-side (bcrypt/argon2) and never return raw passwords. Current client uses SHA-256 only for migration; do not rely on client-side hashing for production authentication.

---

## Accessibility & behavior invariants to preserve
- All forms must preserve their inputs, validation and disabling behavior (e.g., `Submit` disabled when required fields empty).
- Modal close-on-backdrop, keyboard focusable controls, `draggable` items must remain keyboard operable (provide fallback keyboard seat assignment when implementing redesign).
- Do not remove or rename any field labels without explicit sign-off.

---

## Component mapping for redesign (visual placement suggestions)
- Keep a persistent left `Sidebar` with the same item set and order (small icon + label). This prevents changing user navigation paths.
- Convert stat cards to a high-density grid (3–5 per row) on dashboards.
- Convert `PracticeCard`, `RideCard`, `AnnouncementItem` into modular cards with strict spacing and high-contrast headers.
- Lineup builder: preserve drag/drop but add keyboard assignment controls and a compact seat-grid on wide screens.
- Team tables: switch to denser table rows, visible action buttons (Edit / Delete) always shown (no hidden menus).

---

## QA checklist / parity tests (sample test cases)
- Login: email+password and quick-login buttons authenticate to the expected role and land on appropriate dashboard.
- Create/Delete practice (Coach) persists and updates dashboards immediately.
- Athlete Confirm / Decline updates `attendance` and reflects in Secretary/Coach dashboards and counts.
- Generate Ride Sheet: with given confirmed drivers/passengers, seat assignment behavior matches current algorithm and persists.
- Lineup save/load: assignments saved and visible in Athlete `My Lineups`.
- Add/Edit Team Member: fields (including driver toggle + capacity) persist and affect ride generation.
- Announcements: create announcement as coach/secretary and verify display order and meta.

---

## Next deliverables I can produce now
1. Concrete component mapping file that ties each interactive control to a design token and new CSS class naming scheme.
2. High-level CSS palette & token file (dark slate + rowing-orange) to swap into current `:root` variables.
3. Keyboard-accessibility plan for drag/drop operations.

---

File generated from code inspection of `app.jsx` and `practice-planner.jsx` — every UI control listed corresponds to the component or function named in the source. Preserve exact field names and storage key `practicePlannerData` unless migrating to a server API (then map to the endpoints above).
