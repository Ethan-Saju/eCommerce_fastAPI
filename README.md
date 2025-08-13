

# eCommerce FastAPI
A full-stack eCommerce web application that allows users to browse products, manage a shopping cart, and place orders. Built with FastAPI for the backend and React for the frontend.

## Features
- Browse products with detailed information
- Add products to a shopping cart
- Place orders 
- User authentication
- Responsive design for mobile and desktop

## Technologies Used
- **Backend:** FastAPI
- **Frontend:** React, JavaScript, Chakra UI
- **Database:** SQLite
- **Authentication:** JWT

## Installation / Setup

1. **Clone the repository**
```bash
git clone https://github.com/Ethan-Saju/eCommerce_fastAPI.git
cd eCommerce_fastAPI
```

2. **Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt

```
3. **Copy the environment file**
```bash
cp .env.example .env
# On Windows (PowerShell)
copy .env.example .env
```

4. **Configure the environment**

Edit the `.env` file and set the variables to your preference:

```env
DATABASE_URL=sqlite:///./ecommerce.db
DEBUG=True
SECRET_KEY=CHANGE_ME
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```
5. **Run the backend server**

You can start the server using either of the following commands:

**Option 1: Using Uvicorn**
```bash
uvicorn main:app --reload
```
**Option 2: Using Python**
```bash
python start.py
```
6. **Run the frontend**

Open another terminal and run the following commands

```bash
cd eCommerce_fastAPI
cd  frontend
npm install
npm run dev

```
7. **Access the application**

Once both backend and frontend are running, open your browser and go to: http://localhost:5173


You can log in using the sample user credentials:  

- **Email:** `user@example.com`  
- **Password:** `qwerty`

You should now see the app running locally.

## Documentation

The API documentation is available at:
http://localhost:8000/docs. 
You can use this to explore all available endpoints and test the backend.


## Future Work

Planned improvements and features for the app include:

- Adding an admin user role
- Creating categories and products (you can add your own in `database.py` in the backend)
- Adding an admin dashboard
- Implementing filtering, sorting, and pagination
- Supporting product images
- Adding address management for users


> **⚠️ Note:** The database is **not persistent** by default.  
> This is because the functions `reset_db` and `create_sample_data` in `database.py` run every time the server starts, resetting the database.  
> To make the data persistent, you should **remove or comment out** these function calls.
