from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Hantashield Biosecurity & Diagnostic Engine", version="1.2.0")

class DiagnosisRequest(BaseModel):
    pathogen_name: str
    symptoms: Optional[List[str]] = []
    severity_level: Optional[str] = "Moderate"

# Dummy dependency for authentication placeholder
def get_current_user():
    return "operator_alpha"

@app.post("/api/diagnose")
def generate_diagnosis(req: DiagnosisRequest, current_user: str = Depends(get_current_user)):
    pathogen = req.pathogen_name.lower()
    
    # Advanced rule-based clinical decision support matrix
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
