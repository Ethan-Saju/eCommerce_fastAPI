from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db  
from schemas.order import OrderRead 
from crud.order import create_order, get_order, get_orders_by_user 

from models import User, Cart 
from dependencies import get_current_user 
router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def place_order(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    if not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    order = create_order(db, current_user.id, cart.id)
    if not order:
        raise HTTPException(status_code=400, detail="Order creation failed")
    return order

@router.get("/{order_id}", response_model=OrderRead)
def read_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = get_order(db, order_id, current_user.id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/", response_model=List[OrderRead])
def read_orders_by_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    orders = get_orders_by_user(db, current_user.id)
    return orders
