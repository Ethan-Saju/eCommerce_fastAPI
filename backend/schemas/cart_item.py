from pydantic import BaseModel

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int


class CartItemRead(CartItemBase):
    id: int

    class Config:
        orm_mode = True
