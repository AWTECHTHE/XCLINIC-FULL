
from fastapi import APIRouter

router = APIRouter()

@router.get("/items/")
async def read_items():
    return [{"item_name": "item1"}, {"item_name": "item2"}]

# ...existing code...