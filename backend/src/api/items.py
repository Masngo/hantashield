from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from src.database import get_db
from src.models.item import Item
from src.schemas.item import ItemCreate, ItemResponse

router = APIRouter()

@router.get("/items/", response_model=List[ItemResponse])
def get_items(
    search: Optional[str] = None,
    severity: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Item)
    if search:
        query = query.filter(Item.pathogen_name.ilike(f"%{search}%") | Item.notes.ilike(f"%{search}%"))
    if severity and severity != "All":
        query = query.filter(Item.severity == severity)
    return query.all()

@router.post("/items/", response_model=ItemResponse)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"status": "success"}
