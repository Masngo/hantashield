Product Requirements Document (PRD)

1. Overview
Product name: HantaShield (working)
Positioning: Global hantavirus intelligence, prevention, and outbreak-operations platform with role-based experiences for public users, clinicians, researchers, and public health agencies.

2. Goals
* Reduce preventable exposure through actionable prevention workflows.
* Improve early recognition and escalation through exposure-aware triage and clinician guidance.
* Provide trustworthy, source-transparent situational awareness (not misleading case-count maps).
* Enable agencies to manage intake, line lists, and cluster investigations where appropriate.
* Provide researchers with curated datasets + provenance and reproducible exports.

3. Non-goals (v1)
* Real-time contact tracing for the general public.
* Fine-grained “cases near you” mapping that could identify individuals.
* User-reported symptom surveillance (feature-flagged for later pilot only).

4. Target audiences & experiences
* Public (Web + Mobile): prevention hub, risk map, advisories, exposure-aware triage, watchlists + alerts.
* Clinicians (Web): clinical advisories, case-definition aids, differential prompts, testing/reporting workflow prompts.
* Public Health (Web Console): secure case intake + line list, dashboards, cluster investigation tools (role/policy gated).
* Researchers (Web): export center (CSV/API), geospatial layers, metadata/provenance and versioning.

5. Guiding principles
* Separation of truth layers: official surveillance vs bulletins vs environmental indicators vs modeled risk.
* Source transparency everywhere: show provenance, retrieval time, confidence, and licensing.
* Privacy-first geographies: default to admin1 (state/province) for official data when required.
* Role-based clarity: the same underlying data, different UX and permissions.

6. Success metrics (KPIs)
* Public: prevention checklist completion rate, saved locations, alert subscription rate, triage completion rate.
* Clinician: advisory engagement, reporting workflow usage, “share summary” usage.
* Agency: time-to-intake completion, data completeness score, cluster workflow adoption.
* Research: exports per month, API key activations, dataset citation/usage.

---

### Epics & User Stories (Build Plan)
* **Epic A — Identity, Access, and Audit**
  * As a public user, I can use the app without an account (read-only) and optionally create an account to save locations.
  * As an agency admin, I can assign roles and restrict data access.
  * As a system admin, I can view an audit log of sensitive actions.
* **Epic B — Data ingestion + provenance**
  * As a system admin, I can register a data source (CDC/WHO/state bulletin feed) with licensing and retrieval settings.
  * As the system, I can ingest and version datasets on a schedule.
  * As any user, I can view a “source panel” explaining where a number/layer came from.
* **Epic C — Situation & Advisory Center**
  * As a public user, I can see current advisories for my saved locations.
  * As a clinician, I can see clinical advisories scoped to my region.
  * As an editor, I can draft, review, and publish advisories with effective dates and target roles.
* **Epic D — Risk Map (layered)**
  * As a user, I can toggle layers (official surveillance, bulletins, environmental, modeled risk).
  * As a user, I can change geography level (global → country → admin1).
  * As a user, I can see data completeness/confidence indicators.
* **Epic E — Exposure-aware triage**
  * As a public user, I can answer symptoms + exposure questions and get an action recommendation.
  * As a user, I can generate a “what to tell a clinician” summary.
  * As a clinician, I can view an expanded decision support view (policy gated).
* **Epic F — Prevention Hub (workflow-based)**
  * As a public user, I can follow a step-by-step safe cleanup workflow.
  * As a user, I can complete rodent-proofing checklists by setting (home/work/campsite).
  * As a user, I can download offline field cards.
* **Epic G — Alerts & Watchlists**
  * As a user, I can save locations and subscribe to alerts.
  * As a clinician, I can subscribe to clinical bulletins.
  * As an agency user, I can create an incident trigger and notify a defined audience.
* **Epic H — Agency Console: intake + line list**
  * As an agency user, I can create a case record and track status (suspected/probable/confirmed).
  * As an agency user, I can track lab status and exposure classification.
  * As an agency user, I can view dashboards by region and time.
* **Epic I — Research export**
  * As a researcher, I can export curated datasets with metadata and version tags.
  * As a researcher, I can request an API key and query endpoints with rate limits.

---

### Data Model (PostgreSQL + PostGIS)
* **Conventions:** Every record displayed includes `source_id`, `source_url`, `retrieved_at`, `license`, `confidence`, `version_id`. Geography precision policy: `geo_precision ∈ {global, country, admin1, admin2, point_approx}`.
* **Core Tables:** `users`, `roles`, `audit_log`, `data_sources`, `ingestion_runs`, `dataset_versions`, `official_observations`, `bulletins`, `environmental_signals`, `risk_estimates`, `advisories`, `saved_locations`, `alert_subscriptions`, `notifications`, `triage_sessions`.
* **Restricted Tables (ops schema):** `agency_cases`, `case_events`, `lab_results`, `cluster_investigations`.

---

### API Design (v1)
* **Auth:** `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
* **Public Content & Data:** `GET /v1/situation`, `GET /v1/advisories`, `GET /v1/map/layers`, `GET /v1/map/official`, `GET /v1/map/bulletins`, `GET /v1/map/environmental`, `GET /v1/map/risk`
* **Triage:** `POST /v1/triage/sessions`, `POST /v1/triage/sessions/{id}/answers`, `GET /v1/triage/sessions/{id}/result`
* **Prevention & Alerts:** `GET /v1/prevention/guides`, `POST /v1/locations`, `POST /v1/alerts/subscriptions`
* **Agency Console:** `POST /v1/ops/cases`, `PATCH /v1/ops/cases/{id}`, `GET /v1/ops/cases`, `POST /v1/ops/cases/{id}/lab-results`, `GET /v1/ops/dashboards/summary`
* **Research:** `POST /v1/research/api-keys`, `GET /v1/research/datasets`, `GET /v1/research/datasets/{id}/export?format=csv`

---

### Milestones
* **M1 (2–4 weeks):** PRD final + schemas + wireframe-ready specs + source inventory.
* **M2 (4–8 weeks):** Public MVP (situation, map v1, prevention, triage v1, alerts).
* **M3 (6–10 weeks):** Clinician portal + agency intake v1.
* **M4:** Research exports + offline mode + hardening.
