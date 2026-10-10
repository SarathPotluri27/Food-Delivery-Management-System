# Using database
USE food_delivery;

# WHERE Clause
-- records of users with even user_id number
SELECT * FROM users
WHERE user_id%2 = 0;

-- Records of restaurant with rating above 4
SELECT restaurant_name, location
FROM restaurant
WHERE rating > 4.0;

-- WHERE clause with AND, OR, NOT
-- Records of success payments with UPI 
SELECT payment_id, payment_timestamp, amount
FROM payment
WHERE payment_mode='UPI' AND payment_status="SUCCESS";

-- Record of delivery_partners with bikes or scooters
SELECT * FROM delivery_partner
WHERE vehicle_type="bike" OR vehicle_type='scooter';

-- Record of deliveries which are not delivered(pending or cancelled)
SELECT  delivery_id, pickup_time, delivery_time
FROM delivery
WHERE NOT delivery_status = "DELIVERED";

-- ORDER BY clause 
-- Record of addresses order by city and state in ASC
SELECT * FROM address
ORDER BY state, city;

-- Record of order_items order by order_price DESC 
SELECT order_item_id, item_name, order_price
FROM order_item
ORDER BY order_price DESC;

-- LIMIT clause
-- Records of order_items with top 5 prices
SELECT order_item_id, item_name, order_price
FROM order_item
HAVING order_price > 200
ORDER BY order_price desc
LIMIT 5;

-- Records of 1st 10 users 
SELECT * FROM users 
LIMIT 10;

-- Aggregate functions
-- Records of deliveries with min distance
SELECT delivery_id, delivery_fee, distance_km
FROM delivery
WHERE distance_km =( SELECT MIN(distance_km) FROM delivery);

-- Records of costly item in the restaurants
SELECT item_name, price
FROM menu_item
WHERE price = (SELECT MAX(price) FROM menu_item);

-- Count of orders from restaurants
SELECT r.restaurant_name, r.location, COUNT(DISTINCT o.order_id) AS Total_orders
FROM restaurant r
 JOIN menu_item mi ON r.restaurant_id = mi.restaurant_id
 JOIN order_item oi ON mi.menu_item_id = oi.menu_item_id
 JOIN orders o ON oi.order_id = o.order_id
 GROUP BY r.restaurant_id, r.restaurant_name;
 
 -- Average delivery time
 SELECT CONCAT(FLOOR(AVG(TIMESTAMPDIFF(MINUTE, pickup_time, delivery_time))), ' min') AS Avg_delivery_time
 FROM delivery
 WHERE delivery_status = "DELIVERED";

-- Revenue of restaurants
 SELECT r.restaurant_name, r.location, SUM(o.total_amount) AS Revenue
 FROM restaurant r
 JOIN menu_item mi ON r.restaurant_id = mi.restaurant_id
 JOIN order_item oi ON mi.menu_item_id = oi.menu_item_id
 JOIN orders o ON oi.order_id = o.order_id
 GROUP BY r.restaurant_id, r.restaurant_name;
 
-- SELECT LENGTH(user_name) FROM users;
-- SELECT CHAR_LENGTH(user_name) FROM users;

-- String funtions 
-- Concatenation of columns in address table into a single column
SELECT concat(street, city, state, pincode) AS address
FROM address;

-- Concatenation users attributes with separator
SELECT CONCAT_WS(' | ', user_name, email, phone) AS details
FROM users;

-- Length of user_name with LENGTH function
SELECT user_name, LENGTH(user_name) AS Len_Username
FROM users;

-- Length of user_name with CHAR_LENGTH function
SELECT user_name, CHAR_LENGTH(user_name) AS Len_username
FROM users;

-- UPPER function
SELECT UPPER(item_name) FROM menu_item;

-- LOWER function
SELECT LOWER(item_name) FROM menu_item;

-- SUBSTRING()
SELECT SUBSTRING(delivery_status, 1 , 3) FROM delivery;

-- LEFT() and RIGHT()
SELECT LEFT(phone, 3) FROM users;   -- first 3 digits
SELECT RIGHT(phone, 4) FROM users;  -- last 4 digits

-- REPLACE() 
SELECT REPLACE(order_timestamp, '-', '/') FROM orders;

-- TRIM(), RTRIM(), LTRIM()
SELECT TRIM(user_name) FROM users;
SELECT RTRIM(user_name) FROM users;
SELECT LTRIM(user_name) FROM users;

-- LIKE()
SELECT * FROM users
WHERE user_name LIKE '%Sharma';

-- combining user_name with gmail.com
SELECT UPPER(CONCAT(user_name, '(', SUBSTRING(email, LOCATE('@', email)+1), ')')) AS 'MAIL_ID'
FROM users;

-- Users ordering from restaurants
SELECT CONCAT(u.user_name, ' ordered from ', upper(substring(r.restaurant_name,1 , 3))) AS Order_statments
FROM users u
JOIN orders o ON u.user_id = o.user_id
JOIN order_item oi ON o.order_id = oi.order_id
JOIN menu_item mi ON oi.menu_item_id = mi.menu_item_id
JOIN restaurant r ON mi.restaurant_id = r.restaurant_id;

-- Returns current date and time 
SELECT NOW() AS 'Current_date&time';

-- Returns user_name with uppercase letters
select UPPER(user_name) AS USER_NAME
from users;

-- Creating email_id for user 
select concat(user_name, '@', substring(email, locate('@', email)+1)) AS Email_id
from users;

-- Returns first 3 letters of restaurant_name
select substring(restaurant_name, 1, 3) from restaurant;

-- select substring(email, locate('@', email)+1) from users;

-- Returns phone_numbers like 1234****90
select concat(left(phone, 4), '****', right(phone,2)) AS Phone_no
from users;

-- Returns first 3 letters of restaurant_name with rating
select concat(substring(restaurant_name, 1, 3), '(', rating, ')') AS Restaurant_with_rating
from restaurant;

-- select * from users
-- where email like '%gmail.com';

-- Returns year, month, day, hour in separate columns 
SELECT YEAR(order_timestamp)AS Year,
 MONTH(order_timestamp)  AS Month,
 DAY(order_timestamp) AS Day,
 HOUR(order_timestamp)  AS Hour
FROM orders;

-- Adding 5 days to the bottom of the orders table
SELECT DATE_ADD(order_timestamp, INTERVAL 5 DAY)
FROM orders;

-- Difference between the pickup_date and delivery_date
SELECT DATEDIFF(delivery_time, pickup_time)
FROM delivery;

-- Returns the order_timestamp in %d-%m-%Y format
SELECT DATE_FORMAT(order_timestamp, '%d-%m-%Y') AS 'Date'
FROM orders;

-- Returns the orders at that time
select * from orders where order_timestamp="2026-02-02 09:00:00";

SELECT * FROM orders
WHERE order_timestamp BETWEEN DATE_SUB(CURDATE(), INTERVAL 7 DAY)
AND NOW();

-- It helps us to drop the SP if exists
DROP PROCEDURE IF EXISTS delivery_partner_details;

-- Creating a SP to retrive the delivery_partner details
DELIMITER //
CREATE PROCEDURE delivery_partner_details()
BEGIN 
SELECT * FROM delivery_partner;
END //
DELIMITER ;

-- Calling the procedure
CALL delivery_partner_details();

-- Creating a SP to retrive the order details of a user
DELIMITER //
CREATE PROCEDURE get_orders_by_user(IN uid INT)
BEGIN
    SELECT * 
    FROM orders
    WHERE user_id = uid;
END //
DELIMITER ;

-- Calling the procedure
CALL get_orders_by_user(5);
 
-- Creating SP to Retrive the status of the delivery
DELIMITER //

CREATE PROCEDURE check_delivery_status(IN del_id INT)
BEGIN
    DECLARE d_status VARCHAR(20);

    SELECT delivery_status
    INTO d_status
    FROM delivery
    WHERE delivery_id = del_id;

    IF d_status = 'DELIVERED' THEN
        SELECT 'Order Delivered' AS Delivery_status;
    ELSEIF d_status = 'PENDING' THEN
        SELECT 'Order Pending' AS Delivery_status;
    ELSE
        SELECT 'Order Cancelled' AS Delivery_status;
    END IF;
END //

DELIMITER ;
 DROP PROCEDURE IF EXISTS check_delivery_status;

-- Calling the procedure
CALL check_delivery_status(1);

-- Creating SP to retrive the count of orders by user
DELIMITER //
CREATE PROCEDURE user_total_orders(IN userid INT)
BEGIN
 SELECT user_id, COUNT(order_id) AS Total_orders
 FROM orders
 WHERE user_id = userid
 GROUP BY user_id;
END //
DELIMITER ;

-- Calling the procedure
CALL user_total_orders(1);

-- Creating SP to retrive the avg_time if delivery
DELIMITER //

CREATE PROCEDURE avg_delivery_time(OUT avg_time INT)
BEGIN
    SELECT AVG(TIMESTAMPDIFF(MINUTE, pickup_time, delivery_time))
    INTO avg_time 
    FROM delivery
    WHERE delivery_status = 'DELIVERED';
END //

DELIMITER ;

-- Calling the procedure
CALL avg_delivery_time(@avg);
SELECT @avg AS Avg_time; -- Display the result

-- Creating function to calculate the tax
DELIMITER //

CREATE FUNCTION calculate_tax(amount DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
	RETURN amount*0.18;
END //

DELIMITER ;

-- Using the above function to return taxes along with order details
SELECT order_id, total_amount, calculate_tax(total_amount) AS tax
FROM orders;

-- Creating function to return the duration of the delivery
DELIMITER //

CREATE FUNCTION delivery_duration(pickup DATETIME, delivery DATETIME)
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN TIMESTAMPDIFF(MINUTE, pickup, delivery);
END //

DELIMITER ;

-- Using the above function to return the delivery duration 
SELECT delivery_id, delivery_duration(pickup_time, delivery_time) AS minutes
FROM delivery;

-- Creating function to divide the orders into categories
DELIMITER //

CREATE FUNCTION order_category(amount DECIMAL(10,2))
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
	IF amount > 300 THEN
	RETURN "HIGH VALUE";
	ELSE
	RETURN "NORMAL";
	END IF;
END //

DELIMITER ;

-- Using the above function to return orders with categories
SELECT order_id, total_amount, order_category(total_amount) as Category
FROM orders;

