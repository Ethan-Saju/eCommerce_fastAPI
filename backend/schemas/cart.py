from pydantic import BaseModel
from typing import List
from .cart_item import CartItemRead

class CartBase(BaseModel):
    user_id: int

class CartCreate(CartBase):
    pass

class CartRead(CartBase):
    id: int
    items: List[CartItemRead] = []

    class Config:
        orm_mode = True