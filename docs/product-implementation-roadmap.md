# Product Implementation Roadmap

This roadmap compares the current repository with the Georgia-first childcare compliance and cash-flow product scope.

Status reflects the frontend repository and its API contracts. It does not confirm that every referenced backend endpoint is deployed or behaves correctly.

## Status legend

- ✅ Implemented
- 🟡 Partial
- ⬜ Missing

## Pilot MVP / P0

| ID | Capability | Status | Already implemented | Still missing |
| --- | --- | --- | --- | --- |
| F1 | Authentication | 🟡 | Email/Google login, OTP verification, password reset, refresh handling, protected routes | Administrator MFA, session/device management |
| F2 | Organization and locations | ⬜ | Company ID exists in the auth token | Organization settings, locations, licensing configuration |
| F3 | Rooms/classrooms | ✅ | CRUD, capacity, age range, assigned children/staff, activation | Location association and licensed-capacity rules |
| F4 | Roles and permissions | 🟡 | Role and permission selection UI | Actual route, action and field-level enforcement |
| F5 | Immutable audit log | ⬜ | — | Central audit events, old/new values, actor, timestamp, reason |
| F6 | Imports and exports | ⬜ | — | CSV imports, validation, preview, rollback, general exports |
| E1 | Child profiles | ✅ | CRUD, personal details, room, medical information, absences | Retention/archive policy |
| E2 | Parent and guardian profiles | 🟡 | Contact information, relationship and PIN fields | Dedicated CRUD, invitation, identity verification |
| E3 | Pickup authorization | 🟡 | Guardians and parent PIN data | Authorized/prohibited distinction, custody restrictions, emergency pickup |
| E4 | Child documents | 🟡 | API-backed upload, update, delete, expiration and status | Correct child-document taxonomy, required-document rules and reminders |
| E5 | Digital enrollment | ⬜ | Basic child-creation form | Configurable packet, application workflow, required fields |
| E6 | E-signatures and consent | ⬜ | — | Policies, medical, transportation, photography and enrollment signatures |
| E7 | Immunizations | ⬜ | Placeholder tab | Records, expirations, exemptions and reminders |
| E8 | Record completeness | ⬜ | — | Complete/action-needed/expiring states and dashboard |
| A1 | Basic check-in/out | 🟡 | API endpoints and room actions | Guardian acknowledgment, pickup verification, timestamp history |
| A2 | Room transfers | ✅ | Student movement between rooms | Atomic backend operation and attendance-event history |
| A3 | Attendance correction | ⬜ | — | Mandatory reason, original value, new value and immutable history |
| A4 | Attendance reports | ⬜ | — | Daily roster, printable history and 12-month retention |
| A5 | Offline attendance | ⬜ | — | Offline queue, conflict handling and synchronization status |
| A6 | Kiosk/mobile attendance | ⬜ | — | Dedicated fast check-in experience |
| C1 | Versioned rules engine | ⬜ | — | Jurisdiction, provider type, effective dates, sources and verification |
| C2 | Georgia ratio engine | 🟡 | Manually configured ratio and generic status indicator | Age-aware rules, walking status, mixed ages, group limits, exceptions |
| C3 | Ratio warnings | ⬜ | Pass/fail room indicator | Early warning, violation alerts, explanation and suggested resolution |
| C4 | Staff profiles | 🟡 | Profile editing, role, schedule, certification, emergency and medical data | Creation API and termination/access workflow |
| C5 | Staff documents | ✅ | API-backed document listing, upload, deletion, status and expiration | Compliance requirement mapping belongs to C6 |
| C6 | Georgia staff compliance | ⬜ | — | KOALA, GAPS, NCPA/VCA, background checks, training hours, CPR/first aid rules |
| C7 | Incident reporting | ⬜ | Dashboard contains mock incident text only | Structured report, body map, signatures, notifications and acknowledgment |
| C8 | Medication workflow | ⬜ | Medication text field in profiles | Authorization, dosage, schedule, administration log and double-dose protection |
| C9 | Policy acknowledgments | ⬜ | — | Versioned policies, effective dates, signatures and re-acknowledgment |
| C10 | Emergency drills | ⬜ | Calendar can display generic events | Drill types, cadence, completion records, retention and corrective actions |
| C11 | Weekly menus | 🟡 | Meal scheduling, recurrence, allergens, rooms and notes | Real persistence, substitution log, six-month history and printing |
| C12 | DECAL inspection packet | ⬜ | — | One-click child, staff, attendance, drill and policy evidence bundle |
| P1 | Parent messaging | 🟡 | API-backed conversations, cursor-paginated history, sending, favorites, read state and WebSocket updates | Parent authentication/participation, delivery policy and granular permissions |
| P2 | Announcements/newsletters | 🟡 | Full editor, templates and preview | Save, schedule and send APIs |
| P3 | Urgent alerts | ⬜ | — | Priority delivery, acknowledgment and escalation |
| P4 | Parent incident acknowledgment | ⬜ | — | Secure link, signature, timestamp and reminder |
| S1 | Security baseline | 🟡 | Auth, protected routes, token infrastructure | MFA, enforced RBAC, audit log, retention and export/deletion controls |

## Commercial Version 1

| ID | Capability | Status | Already implemented | Still missing |
| --- | --- | --- | --- | --- |
| B1 | Billing ledger | ⬜ | Billing route and student tab placeholders | Charges, adjustments, immutable transactions and balances |
| B2 | Tuition plans | ⬜ | — | Weekly, biweekly, monthly and custom recurring charges |
| B3 | Family billing | ⬜ | Student-family relationships exist | Multiple children, sibling discounts and split payers |
| B4 | Fees and adjustments | ⬜ | — | Registration fees, late fees, credits, refunds and write-offs |
| B5 | Card and ACH payments | ⬜ | — | Processor integration, autopay, failures and refunds |
| B6 | Cash/check recording | ⬜ | — | Manual payment records and receipts |
| B7 | Statements and tax receipts | ⬜ | — | Family statements, annual receipts and exports |
| B8 | Settlement reconciliation | ⬜ | Dashboard contains mock finance totals | Payment settlement matching and discrepancies |
| CAPS1 | CAPS authorizations | ⬜ | — | Authorization periods, scholarship and copay mapping |
| CAPS2 | Attendance reconciliation | ⬜ | — | Attendance comparison and missing-day detection |
| CAPS3 | CAPS exception queue | ⬜ | — | Rate, duplicate, schedule and capacity warnings |
| CAPS4 | CAPS export/evidence | ⬜ | — | Operator-ready export and supporting evidence |
| O1 | Staff time clock | ⬜ | Staff can appear checked in from API data | Clock-in/out workflow and corrections |
| O2 | Staff scheduling | 🟡 | Weekly availability/profile schedule | Shift scheduling, breaks and coverage |
| O3 | Multi-location | ⬜ | — | Location switching, assignment and aggregate views |
| O4 | Migration tooling | ⬜ | — | Brightwheel/Procare imports, deduplication and audit reports |

## Existing lower-priority modules

| Module | Status | Notes |
| --- | --- | --- |
| Calendar | 🟡 | Polished recurring-event interface; currently mock-backed |
| Dashboard | 🟡 | Polished UI, but operational, ratio and finance metrics are static |
| Messages | 🟡 | Connected to the REST/WebSocket backend; parent accounts and delivery policy remain |
| Newsletters | 🟡 | Complete editor prototype; persistence and sending unfinished |
| Meals | 🟡 | Strong interface prototype; compliance history and persistence unfinished |
| Admissions | ⬜ | Placeholder |
| Reports | ⬜ | Placeholder |
| Analytics/insights | ⬜ | Placeholders |

## Recommended implementation order

1. Organization/location model, enforced role-based access, and immutable audit events.
2. Auditable attendance with pickup authorization and correction history.
3. Versioned Georgia ratio and group-size engine.
4. Child completeness and real staff-document compliance.
5. Incident, medication, drill, and policy workflows.
6. DECAL inspection packet and CSV migration/export.
7. Real parent alerts and acknowledgments.
8. Billing ledger, payments, and CAPS reconciliation.

The first implementation milestone is **F2–F5: organization/location foundation, enforced permissions, and immutable audit events**. Attendance, compliance, inspection exports, and billing depend on those foundations.
