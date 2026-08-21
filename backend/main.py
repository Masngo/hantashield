from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid

app = FastAPI(title="Hantashield Biosecurity & Diagnostic Engine", version="1.3.1")

# Enable CORS for Next.js frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DiagnosisRequest(BaseModel):
    pathogen_name: str
    symptoms: Optional[List[str]] = []
    severity_level: Optional[str] = "Moderate"

class TriageSessionCreate(BaseModel):
    location_admin1: Optional[str] = "Global"
    symptoms: List[str]
    exposure_history: List[str]

triage_db = {}

def get_current_user():
    return "operator_alpha"

@app.post("/api/diagnose")
def generate_diagnosis(req: DiagnosisRequest, current_user: str = Depends(get_current_user)):
    pathogen = req.pathogen_name.lower()
    
    if "hantavirus" in pathogen:
        protocol = {
            "differential_diagnosis": ["Hantavirus Pulmonary Syndrome (HPS)", "Leptospirosis", "Severe Influenza Pneumonia", "Tularemia"],
            "confirmatory_tests": ["RT-PCR on blood/tissue", "IgM and IgG Enzyme-Linked Immunosorbent Assay (ELISA)", "Complete Blood Count (thrombocytopenia & hemoconcentration check)"],
            "therapeutics": ["Immediate ICU admission for aggressive hemodynamic monitoring", "Extracorporeal Membrane Oxygenation (ECMO) evaluation for severe pulmonary edema", "Strict avoidance of aggressive fluid resuscitation to prevent pulmonary worsening"],
            "containment_ppe": ["N95 or PAPR respiratory protection", "Full containment suit with double gloving", "Rodent-proofing field perimeter and decontamination with 10% bleach solution"]
        }
    elif "cholera" in pathogen:
        protocol = {
            "differential_diagnosis": ["Severe Enterotoxigenic E. coli (ETEC)", "Salmonellosis", "Shigellosis", "Viral Gastroenteritis"],
            "confirmatory_tests": ["Stool culture on TCBS agar", "Cholera rapid diagnostic tests (RDTs)", "Darkfield microscopy of stool"],
            "therapeutics": ["Immediate oral rehydration solution (ORS) for mild/moderate cases", "Rapid intravenous fluid resuscitation (Ringer's Lactate) for severe dehydration", "Targeted antibiotic therapy to shorten illness duration and reduce stool output"],
            "containment_ppe": ["Strict Water, Sanitation, and Hygiene (WASH) interventions", "Safe water monitoring and chlorination", "Standard contact precautions and safe burial protocols"]
        }
    elif "rift valley fever" in pathogen or "rvf" in pathogen:
        protocol = {
            "differential_diagnosis": ["Malaria", "Crimean-Congo Hemorrhagic Fever", "Yellow Fever", "Typhoid Fever"],
            "confirmatory_tests": ["Real-time Reverse Transcriptase-Polymerase Chain Reaction (RT-PCR)", "Serum IgM or IgG capture ELISA", "Liver Function Tests (LFTs) and Complete Blood Count"],
            "therapeutics": ["Early supportive care and strict fluid management", "Symptomatic treatment for hemorrhage or ocular complications", "Close monitoring for renal and hepatic impairment"],
            "containment_ppe": ["Personal protection against mosquito bites (bed nets, repellents)", "Gloves and protective gear when handling livestock or raw animal products", "Vector larviciding at confirmed breeding sites"]
        }
    elif "ebola" in pathogen or "marburg" in pathogen:
        protocol = {
            "differential_diagnosis": ["Viral Hemorrhagic Fever", "Severe Malaria", "Typhoid Fever", "Fulminant Lassa Fever"],
            "confirmatory_tests": ["Real-time RT-PCR assay", "Antigen-capture ELISA testing"],
            "therapeutics": ["Immediate isolation in BSL-4 facility", "Aggressive electrolyte and fluid replacement therapy", "Monoclonal antibody therapeutics (e.g., Inmazeb / Ebanga)"],
            "containment_ppe": ["Full-body hazmat suit with powered air-purifying respirator (PAPR)", "Strict barrier nursing procedures and biomedical waste incineration"]
        }
    elif "avian influenza" in pathogen or "h5n1" in pathogen:
        protocol = {
            "differential_diagnosis": ["Avian Influenza A(H5N1)", "Severe Seasonal Influenza A/B", "SARS-CoV-2 Pneumonia"],
            "confirmatory_tests": ["Nasopharyngeal swab RT-PCR", "Viral culture in specialized biosafety containment"],
            "therapeutics": ["Early administration of Neuraminidase inhibitors (Oseltamivir)", "Supportive respiratory ventilation and oxygen therapy"],
            "containment_ppe": ["Airborne precautions with N95 respirators, eye protection, gowns, and gloves"]
        }
    else:
        protocol = {
            "differential_diagnosis": ["Unidentified Pathogen Syndrome", "Emerging Zoonotic Infection", "Atypical Respiratory Pathogen"],
            "confirmatory_tests": ["Broad-panel Next-Generation Sequencing (NGS)", "Multiplex PCR respiratory and blood panels"],
            "therapeutics": ["Empirical broad-spectrum antimicrobial & antiviral coverage pending lab results", "Strict supportive care and vital signs monitoring"],
            "containment_ppe": ["Standard, contact, and airborne isolation precautions until vector is confirmed"]
        }

    return {
        "status": "success",
        "pathogen": req.pathogen_name,
        "clinical_assessment": protocol
    }

@app.get("/v1/situation")
def get_situation_overview():
    return {
        "status": "success",
        "completeness_score": 0.94,
        "active_advisories": [
            {
                "id": "adv-001",
                "title": "Zoonotic Surge Warning: Post-Rainfall Rodent Activity",
                "region": "Admin1-Level Global",
                "severity": "Moderate",
                "source": "WHO / CDC Bulletin Feed"
            }
        ]
    }

@app.post("/v1/triage/sessions")
def create_triage_session(data: TriageSessionCreate):
    session_id = str(uuid.uuid4())
    high_risk_exposure = any("rodent" in exp.lower() or "water" in exp.lower() or "livestock" in exp.lower() for exp in data.exposure_history)
    severe_symptom = any("breathing" in sym.lower() or "hemorrhage" in sym.lower() or "fever" in sym.lower() for sym in data.symptoms)
    
    if high_risk_exposure and severe_symptom:
        recommendation = "URGENT ESCALATION: Potential high-consequence zoonotic exposure detected. Contact local clinical provider immediately and bring this summary sheet."
        urgency = "High"
    else:
        recommendation = "Standard monitoring recommended. Isolate if symptoms worsen and maintain strict hygiene precautions."
        urgency = "Routine"

    session_record = {
        "session_id": session_id,
        "location": data.location_admin1,
        "symptoms": data.symptoms,
        "exposure_history": data.exposure_history,
        "recommendation": recommendation,
        "urgency": urgency,
        "provenance": {
            "source": "Hantashield Clinical Decision Support Engine v1",
            "confidence": 0.89
        }
    }
    
    triage_db[session_id] = session_record
    return {"status": "success", "session_id": session_id, "result": session_record}

@app.get("/v1/triage/sessions/{session_id}/result")
def get_triage_result(session_id: str):
    if session_id not in triage_db:
        raise HTTPException(status_code=404, detail="Triage session not found.")
    return {"status": "success", "data": triage_db[session_id]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
