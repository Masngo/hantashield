from fastapi import APIRouter
from src.services.health_feed import fetch_global_health_alerts

router = APIRouter()

@router.get("/global-alerts")
def get_global_alerts():
    try:
        alerts = fetch_global_health_alerts()
        return {"status": "success", "data": alerts}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
