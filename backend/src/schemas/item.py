from pydantic import BaseModel
from typing import Optional

class ItemCreate(BaseModel):
    pathogen_name: str
    severity: str
    transmission_vector: str
    status: str
    location_coords: Optional[str] = None
    risk_score: Optional[float] = 5.0
    notes: Optional[str] = None

class ItemResponse(BaseModel):
    id: int
    pathogen_name: str
    severity: str
    transmission_vector: str
    status: str
    location_coords: Optional[str] = None
    risk_score: Optional[float] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True
