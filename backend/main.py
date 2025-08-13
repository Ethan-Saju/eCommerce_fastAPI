from fastapi import FastAPI
from api import user,cart,order,product
from fastapi.middleware.cors import CORSMiddleware
from database import reset_database,create_sample_data,SessionLocal
from sqlalchemy.orm import Session

from models import User,Cart,CartItem,Order,OrderItem,Product,Category

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)


reset_database()  
db = SessionLocal()   
try:
    create_sample_data(db)
finally:
    db.close()  

app.include_router(user.router)
app.include_router(cart.router)
app.include_router(order.router)
app.include_router(product.router)