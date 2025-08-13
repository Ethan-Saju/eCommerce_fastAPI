from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from schemas.product import ProductRead  
from crud.product import get_products, get_products_by_category, get_products_by_keyword

from models.product import Product

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[ProductRead])
def read_products(db: Session = Depends(get_db)):
    return get_products(db)

@router.get("/category/", response_model=List[ProductRead])
def read_products_by_category(category: str = Query(...), db: Session = Depends(get_db)):
    return get_products_by_category(db, category)

@router.get("/search/", response_model=List[ProductRead])
def search_products(keyword: str = Query(...), db: Session = Depends(get_db)):
    return get_products_by_keyword(db, keyword)

@router.get("/{product_id}", response_model=ProductRead)
def read_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product