from pydantic import BaseModel
from typing import List
from datetime import datetime
from .order_item import OrderItemRead

class OrderBase(BaseModel):
    user_id: int

class OrderCreate(OrderBase):
    pass

class OrderRead(OrderBase):
    id: int
    created_at: datetime
    items: List[OrderItemRead] = []

    class Config:
        orm_mode = True