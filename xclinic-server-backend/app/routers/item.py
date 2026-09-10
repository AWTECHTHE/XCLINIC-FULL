
from fastapi import APIRouter

router = APIRouter()

# NOTE: there is no Item domain model/table yet. This endpoint intentionally
# still returns static placeholder data until the Item entity is defined
# (fields, ownership, persistence). Track this before relying on it from a
# real client.
@router.get("/items/")
async def read_items():
    return [{"item_name": "item1"}, {"item_name": "item2"}]

# ...existing code...