from sqlalchemy.orm import Session
from models.cart import Cart
from models.product import Product  
from models.cart_item import CartItem
from fastapi import HTTPException, status

def get_cart_by_user(db: Session, user_id: int):
    cart =  db.query(Cart).filter(Cart.user_id == user_id).first()

    if not cart:
        return None

    
    db.commit()
    db.refresh(cart)    
    return cart
        

def create_cart(db: Session, user_id: int):
    cart = Cart(user_id=user_id)
    db.add(cart)
    db.commit()
    db.refresh(cart)
    return cart

def add_item_to_cart(db: Session, cart: Cart, product_id: int, quantity: int):

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="product not found")
    item = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id, CartItem.product_id == product_id)
        .first()
    )
    if item:
        item.quantity += quantity
    else:
        item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
        db.add(item)

    db.commit()
    db.refresh(item)
    return item

def update_cart_item(db: Session, item_id: int, quantity: int):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if item:
        if quantity==0:
            remove_cart_item(db,item_id)
        else:
            item.quantity = quantity
            product = db.query(Product).filter(Product.id == item.product_id).first()
            db.commit()
            db.refresh(item)
    return item

def remove_cart_item(db: Session, item_id: int):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if item:
        db.delete(item)
        db.commit()
    return item

def clear_cart(db: Session, cart: Cart):
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    
