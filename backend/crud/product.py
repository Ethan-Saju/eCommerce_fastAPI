from sqlalchemy.orm import Session
from models.product import Product
from models.category import Category
from typing import List
from sqlalchemy import or_

def get_products(db: Session) -> List[Product]:
    return db.query(Product).all()

def get_products_by_category(db: Session, category_name: str) -> List[Product]:
    category = db.query(Category).filter(Category.name == category_name).first()
    if not category:
        return []
    return db.query(Product).filter(Product.category_id == category.id).all()



def get_products_by_keyword(db: Session, keyword: str) -> List[Product]:
    keyword_like = f"%{keyword}%"
    
    return (
        db.query(Product)
        .join(Category)  
        .filter(
            or_(
                Product.name.ilike(keyword_like),
                Category.name.ilike(keyword_like)
            )
        )
        .all()
    )

