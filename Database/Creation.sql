# Using Database
use food_delivery;

# Creating Tables:
# User table creation
CREATE TABLE users (
    user_id INT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    
    # CHECK constraints
    CHECK (email LIKE '%@%.%'),
    CHECK (phone REGEXP '^[0-9]{10,15}$')

);

# Address table creation
CREATE TABLE Address (
    address_id INT PRIMARY KEY,
    street VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    user_id INT NOT NULL,

    # CHECK constraints
    CONSTRAINT chk_pincode_length
        CHECK (CHAR_LENGTH(pincode) BETWEEN 5 AND 10),

    # Foreign key
    CONSTRAINT fk_Address_Users
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
);

# Orders table creation
CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    order_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    user_id INT NOT NULL,
    address_id INT NOT NULL,

    # CHECK constraints
    CONSTRAINT chk_total_amount
        CHECK (total_amount > 0),

    # Foreign Keys
    CONSTRAINT fk_Orders_Users
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id),
        
    CONSTRAINT fk_Orders_Address
        FOREIGN KEY (address_id)
        REFERENCES Address(address_id)
);

# Payment table creation
CREATE TABLE Payment (
    payment_id INT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_mode VARCHAR(30) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    payment_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    # CHECK constraints
    CONSTRAINT chk_payment_amount
        CHECK (amount > 0),

    CONSTRAINT chk_payment_status
        CHECK (payment_status IN ('SUCCESS', 'FAILED', 'PENDING')),

    CONSTRAINT chk_payment_mode
        CHECK (payment_mode IN ('UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash')),

    # Foreign key
    CONSTRAINT fk_Payment_Orders
        FOREIGN KEY (order_id)
        REFERENCES Orders(order_id)
);

# Delivery_partner table creation
CREATE TABLE Delivery_Partner (
    partner_id INT PRIMARY KEY,
    partner_name VARCHAR(100) NOT NULL,
    phone_no VARCHAR(15) NOT NULL,
    vehicle_type VARCHAR(20) NOT NULL,
    rating DECIMAL(2,1),

    # CHECK constraints
    CONSTRAINT chk_partner_rating
        CHECK (rating BETWEEN 0 AND 5),

    CONSTRAINT chk_vehicle_type
        CHECK (vehicle_type IN ('Bike', 'Scooter', 'Bicycle')),

    CONSTRAINT chk_phone_length
        CHECK (phone_no REGEXP '^[0-9]{10,15}$')

);

# Delivery table creation
CREATE TABLE Delivery (
    delivery_id INT PRIMARY KEY,
    delivery_status VARCHAR(20) NOT NULL,
    delivery_fee DECIMAL(8,2) NOT NULL,
    distance_km DECIMAL(5,2) NOT NULL,
    pickup_time TIMESTAMP NULL,
    delivery_time TIMESTAMP NULL,
    order_id INT NOT NULL,
    partner_id INT NOT NULL,

    # CHECK constraints
    CONSTRAINT chk_delivery_status
        CHECK (delivery_status IN ('DELIVERED', 'PENDING', 'CANCELLED')),

    CONSTRAINT chk_delivery_fee
        CHECK (delivery_fee >= 0),

    CONSTRAINT chk_distance
        CHECK (distance_km >= 0),

    # Foreign keys
    CONSTRAINT fk_Delivery_Orders
        FOREIGN KEY (order_id)
        REFERENCES Orders(order_id),

    CONSTRAINT fk_Delivery_Partner
        FOREIGN KEY (partner_id)
        REFERENCES Delivery_Partner(partner_id)
);

# Restaurant table creation
CREATE TABLE Restaurant (
    restaurant_id INT PRIMARY KEY,
    restaurant_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    rating DECIMAL(2,1),

    # CHECK constraints
    CONSTRAINT chk_restaurant_rating
        CHECK (rating BETWEEN 0 AND 5)
);

# Menu_item table creation
CREATE TABLE Menu_Item (
    menu_item_id INT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    restaurant_id INT NOT NULL,

    # CHECK constraints
    CONSTRAINT chk_price
        CHECK (price > 0),

    # Foreign key
    CONSTRAINT fk_MenuItem_Restaurant
        FOREIGN KEY (restaurant_id)
        REFERENCES Restaurant(restaurant_id)
);

# Order_item table creation
CREATE TABLE Order_Item (
    order_item_id INT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    order_price DECIMAL(8,2) NOT NULL,

    # CHECK constraints
    CONSTRAINT chk_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_price_at_order
        CHECK (order_price > 0),

    # Foreign keys
    CONSTRAINT fk_OrderItem_Orders
        FOREIGN KEY (order_id)
        REFERENCES Orders(order_id),

    CONSTRAINT fk_OrderItem_MenuItem
        FOREIGN KEY (menu_item_id)
        REFERENCES Menu_Item(menu_item_id)
);

