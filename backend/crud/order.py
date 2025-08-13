from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import Cart, Order, OrderItem
from crud.cart import clear_cart
from sqlalchemy import desc

def create_order(db: Session, user_id: int, cart_id: int):
    cart = db.query(Cart).filter(Cart.id == cart_id, Cart.user_id == user_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    if not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    order = Order(user_id=user_id)
    db.add(order)
    db.flush()  

    for item in cart.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
        )
        db.add(order_item)
    db.commit()
    db.refresh(order)

    clear_cart(db, cart)
    return order

def get_order(db: Session, order_id: int, user_id: int):
    return (
        db.query(Order)
        .filter(Order.id == order_id, Order.user_id == user_id)
        .first()
    )


def get_orders_by_user(db: Session, user_id: int):
    return (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())  
        .all()
    )


