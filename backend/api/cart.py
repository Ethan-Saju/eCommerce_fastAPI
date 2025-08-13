from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User  
from schemas.cart import CartRead
from schemas.cart_item import CartItemRead, CartItemCreate,CartItemUpdate
from crud import cart as crud_cart
from dependencies import get_current_user  

router = APIRouter(prefix="/cart", tags=["cart"])

@router.get("/", response_model=CartRead) #done
def get_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = crud_cart.get_cart_by_user(db, current_user.id)
    if not cart:
        cart = crud_cart.create_cart(db, current_user.id)
    return cart

@router.post("/items", response_model=CartItemRead) #done
def add_item(item: CartItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = crud_cart.get_cart_by_user(db, current_user.id)
    if not cart:
        cart = crud_cart.create_cart(db, current_user.id)
    return crud_cart.add_item_to_cart(db, cart, item.product_id, item.quantity)

@router.put("/items/{item_id}", response_model=CartItemRead)  #done
def update_item(item_id: int, item: CartItemUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = crud_cart.get_cart_by_user(db, current_user.id)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    updated_item = crud_cart.update_cart_item(db, item_id, item.quantity)
    if not updated_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return updated_item

@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT) #done
def delete_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = crud_cart.get_cart_by_user(db, current_user.id)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    deleted_item = crud_cart.remove_cart_item(db, item_id)
    if not deleted_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

@router.delete("/", status_code=status.HTTP_204_NO_CONTENT) #done
def clear_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart = crud_cart.get_cart_by_user(db, current_user.id)
    if cart:
        crud_cart.clear_cart(db, cart)