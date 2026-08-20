from sqlalchemy import Column, Integer, String, Text, Float
from src.database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    pathogen_name = Column(String, index=True, nullable=False)
    severity = Column(String, nullable=False)
    transmission_vector = Column(String, nullable=False)
    status = Column(String, nullable=False)
    location_coords = Column(String, nullable=True)
    risk_score = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
