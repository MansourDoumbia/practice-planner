Act as a Lead Product Designer and Systems Architect. I am doing a comprehensive visual redesign of my rowing app website, Kharon. The primary objective is to transition away from a 'vibecoded,' abstract, or overly experimental aesthetic into a clean, high-information-density, professional athletic interface.

CRITICAL REQUIREMENT: This is an update to an existing, fully functional website. All current user workflows, features, and technical capabilities must be retained 1-to-1. Do not simplify, omit, or abstract away any existing interactive elements.

How to handle existing functionality during the visual update:

- Data & Metrics: Keep all existing data fields (Split, SPM, Watts, Heart Rate, Distance) exactly as they are mapped in the current system, but re-house them into clean, high-contrast modular cards with a strict grid layout.

- Interactive Elements: Every toggle, filter, dropdown, and historical workout log row must remain fully functional. Replace stylized or hidden 'vibey' UI controls with standard, highly visible, accessible form fields and buttons.

- Navigation & Architecture: Retain the exact same site hierarchy and user paths. If a user clicks 'History,' it must lead to the same data depth. However, flatten the navigation into a rigid, permanent layout (like a standard left sidebar or top header) rather than floating or hidden menus.

- Aesthetic Translation: Keep the existing features but wrap them in a premium, dark-mode athletic utility style (Slate, charcoal, crisp white typography, and sharp rowing-orange or gold accents). Use robust, readable sans-serif fonts suitable for a data-heavy dashboard.


DELIVERABLES EXPECTED FROM THE DESIGNER / TEAM / AI:

1. A mapping document that lists every existing interactive element, API call, and data field, and exactly where it will appear in the new layout.
2. High-fidelity mockups (dark-mode focused) for all core screens: Dashboard, Practices, Lineup, Ride Sheets, Team Members, Attendance, Boats, Templates, Announcements, Reports, and History.
3. A migration checklist that details DOM/JS changes required to preserve behaviors, including keyboard accessibility, role-based UI variations, and any client-side caching.
4. A small CSS/React component library (or design tokens) with the new palette, typography, spacing scale, and accessible component primitives.
5. An implementation plan that allows iterative rollout (feature-flagged) so visual changes can be tested without data migration risk.

NOTES FOR QA AND ACCEPTANCE:

- Acceptance requires parity testing against the existing site for every user flow; provide a test matrix and sample test cases.
- No user-facing text or field names may be removed or renamed without explicit sign-off.
- Any added analytics or tracking must be documented and optional (opt-in).

Tone & Constraints:

- Prioritize clarity over flourish. Every UI affordance should be immediately discoverable.
- Keep interactions snappy; preserve current performance characteristics.
- Do not change server-side APIs, DB schema, or export formats as part of the redesign.

Use this prompt exactly when briefing designers, agencies, or LLMs to prevent accidental feature loss during the redesign.