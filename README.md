Markdown
# HantaShield // Global Biosecurity & Intelligence Platform

[![Status](https://img.shields.io/badge/Status-Active%20Development-cyan.svg)]()
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)]()
[![Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20Next.js%20%7C%20PostGIS-blue.svg)]()

**HantaShield** is an autonomous clinical decision support, outbreak-operations, and source-transparent biosecurity intelligence platform. Conceived to bridge the gap between fragmented official surveillance, environmental indicators, and rapid clinical response, the platform delivers tailored, role-based experiences for public users, clinicians, researchers, and public health agencies.

---

## Monorepo Structure

```text
hantashield/
├── backend/                # FastAPI backend server & clinical decision support engine
│   ├── main.py             # Core API routes (/api/diagnose, /v1/situation, /v1/triage/sessions)
│   └── requirements.txt    # Python dependencies (FastAPI, Uvicorn, Pydantic)
│
├── frontend/               # Next.js web application & interactive UI
│   ├── src/
│   │   └── app/
│   │       └── page.tsx    # Main dashboard, pathogen selector, & diagnostic matrices
│   ├── package.json        # Node.js dependencies & scripts
│   └── tailwind.config.js  # Tailwind CSS styling configurations
│
├── schemas/                # Database models and data layer specifications
│   └── database_schema.sql # PostgreSQL / PostGIS schema (tables, spatial extensions, provenance)
│
├── docs/                   # Platform architecture & product documentation
│   └── PRD.md              # Official Product Requirements Document (PRD v1, epics, data models)
│
└── README.md               # Project overview and instructions
Core Capabilities
Rule-Based Clinical Diagnostics: Instant protocol synthesis for high-consequence zoonotic and emerging pathogens (including Hantavirus, Cholera, Rift Valley Fever, Ebola, Marburg, and Avian Influenza). Generates differential diagnoses, confirmatory lab tests (RT-PCR, ELISA, TCBS agar), evidence-based therapeutics, and strict containment/PPE protocols.

Exposure-Aware Triage: Guided intake assessing symptoms and high-risk environmental exposures to generate structured clinician-ready summaries and actionable recommendations.

Source-Transparent Situation Center: Real-time telemetry endpoints tracking data completeness indicators, active public health advisories, and environmental risk layers.

Role-Based Access Control (RBAC): Secure architectural partitioning for public awareness tools, clinical decision support, secure agency intake lines, and research data exports.

Getting Started
1. Backend Service (FastAPI)
Navigate to the backend directory, install requirements, and launch the server:

Bash
cd backend
pip install fastapi uvicorn pydantic
python main.py
The API server initializes locally at http://127.0.0.1:8000.

2. Frontend Client (Next.js)
Navigate to the frontend directory, install dependencies, and start the development server:

Bash
cd frontend
npm install
npm run dev
The web dashboard is available at http://localhost:3000.

Documentation & Architecture
Full product vision, epics, user stories, security guidelines, and milestone roadmaps are cataloged under the docs/ folder, starting with docs/PRD.md.

License
This project is licensed under the MIT License. See the LICENSE file for details.
