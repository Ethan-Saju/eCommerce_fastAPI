from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker,Session
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ecommerce.db")

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} 
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Database reset: all tables dropped and recreated.")

from models import User, Cart, CartItem, Order, OrderItem, Product, Category
from utils import hash_password
def create_sample_data(db: Session):
  

    # 5 categories with unique products
    category_data = {
        "Electronics": [
            ("Wireless Bluetooth Earbuds", "Compact earbuds with noise cancellation and long battery life.", 2499.99),
            ("Smartphone X15", "6.5-inch AMOLED display with triple camera setup.", 39999.00),
            ("Gaming Laptop Pro", "High-performance laptop with RTX 4060 GPU and 16GB RAM.", 89999.00),
            ("4K Smart TV 55\"", "Ultra HD LED TV with built-in streaming apps.", 45999.00),
            ("Portable Power Bank 20000mAh", "Fast-charging portable power bank with dual USB output.", 1999.00),
        ],
        "Books": [
            ("The Art of Data Science", "A deep dive into data analysis techniques and real-world applications.", 599.00),
            ("Mystery of the Lost City", "A thrilling adventure novel full of twists.", 349.00),
            ("Mastering Python", "Comprehensive guide for beginners and experts in Python programming.", 799.00),
            ("History of Ancient Civilizations", "An exploration of the world's oldest cultures.", 499.00),
            ("Mindfulness for Beginners", "Practical guide to meditation and stress relief.", 299.00),
        ],
        "Clothing": [
            ("Men's Casual Denim Jacket", "Stylish blue denim jacket with a modern fit.", 1499.00),
            ("Women's Summer Dress", "Lightweight floral print dress for casual outings.", 1199.00),
            ("Sports Running Shoes", "Breathable and durable running shoes with cushioned sole.", 2999.00),
            ("Unisex Hoodie", "Comfortable cotton hoodie available in multiple colors.", 999.00),
            ("Formal Slim Fit Shirt", "Premium cotton shirt for office and formal events.", 1299.00),
        ],
        "Home & Kitchen": [
            ("Stainless Steel Cookware Set", "Durable 5-piece set for everyday cooking.", 2499.00),
            ("Memory Foam Pillow", "Ergonomic pillow for better sleep posture.", 899.00),
            ("Electric Kettle", "1.5L fast-boil kettle with auto shut-off.", 1299.00),
            ("Air Purifier", "Removes 99.9% of dust, pollen, and allergens.", 4999.00),
            ("LED Desk Lamp", "Energy-efficient lamp with adjustable brightness.", 799.00),
        ],
        "Sports": [
            ("Football Size 5", "Professional-grade football with durable stitching.", 799.00),
            ("Badminton Racket Set", "Lightweight rackets with high-tension strings.", 1299.00),
            ("Yoga Mat", "Non-slip mat with 6mm cushioning for yoga and workouts.", 699.00),
            ("Mountain Bicycle", "21-speed gear mountain bike with suspension fork.", 15999.00),
            ("Dumbbell Set 20kg", "Adjustable steel dumbbells for strength training.", 3499.00),
        ],
    }

    # Insert categories
    categories = [Category(name=cat_name) for cat_name in category_data.keys()]
    db.add_all(categories)
    db.commit()

    # Map category name to id
    categories = db.query(Category).all()
    category_map = {c.name: c.id for c in categories}

    # Insert products
    products = []
    for cat_name, product_list in category_data.items():
        for name, description, price in product_list:
            products.append(
                Product(
                    name=name,
                    description=description,
                    price=price,
                    category_id=category_map[cat_name]
                )
            )

    db.add_all(products)
    db.commit()
  
    users = [
        User(email="user@example.com", password_hash=hash_password("qwerty")), 
    ]

    db.add_all(users)
    db.commit()

