# Using database
use food_delivery;

# 1.Display no of rows in each table
select 
(select count(*) from users) as User_count,
(select count(*) from address)as Addresses,
(select count(*) from orders)as Orders,
(select count(*) from order_item)as Order_items,
(select count(*) from delivery)as Deliveries,
(select count(*) from delivery_partner)as Delivery_partners,
(select count(*) from payment) as Payments,
(select count(*) from restaurant)as Restaurants,
(select count(*) from menu_item)as menu_items;

# 2.Customer and his orders
select u.user_name, o.order_id, o.total_amount
 from users u
 join orders o on u.user_id=o.user_id;
 
 # 3.Deliveried orders
 select order_id, delivery_status from delivery
 where delivery_status= "delivered";
 
 # 4.Restaurants and there menu_item with prices
 select r.restaurant_name, m.item_name, m.price 
 from menu_item m 
 join restaurant r on r.restaurant_id = m.restaurant_id;
 
 # 5.Order and its payment status
 select o.order_id, o.total_amount, p.payment_status
 from orders o
 join payment p on o.order_id=p.order_id;
 
 --
 # 6.Users ordered more than once
 select u.user_id, u.user_name, count(order_id) as total_orders
 from users u 
 join orders o on u.user_id = o.user_id
 group by u.user_id, u.user_name
 having count(o.order_id) > 1;
 
 # 7.Restaurant and there orders
 select r.restaurant_name, count(distinct o.order_id) as total_orders
 from restaurant r 
 join menu_item m on r.restaurant_id = m.restaurant_id
 join order_item oi on m.menu_item_id = oi.menu_item_id
 join orders o on oi.order_id = o.order_id
 group by r.restaurant_name
 order by total_orders desc;
 
 # 8.Failed payments
 select order_id, payment_mode, amount from payment
 where payment_status = "failed";
 
 # 9.Delivery_partner and his deliveries
 select dp.partner_name, count(d.delivery_id) as Deliveries, vehicle_type
 from delivery_partner dp
 join delivery d on d.partner_id = dp.partner_id
 group by dp.partner_id;
 
 # 10.Highly ordered item
 select item_name, sum(quantity) as total_ordered
 from order_item
 group by item_name
 order by total_ordered desc;
 
 # 11.Revenue of every restaurant
 select r.restaurant_name, sum(o.total_amount) as Revenue
 from restaurant r 
 join menu_item m on r.restaurant_id = m.menu_item_id
 join order_item oi on m.menu_item_id = oi.menu_item_id
 join orders o on oi.order_id = o.order_id
 group by r.restaurant_id
 order by Revenue desc;
 
 # 12.orders with payment retires
 select distinct p1.order_id
 from Payment p1
 join Payment p2 on p1.order_id = p2.order_id
 where p1.payment_status = 'FAILED'
 and p2.payment_status = 'SUCCESS';

 # 13.Average delivery time
 SELECT 
 CONCAT(
     FLOOR(AVG(TIMESTAMPDIFF(minute, pickup_time, delivery_time))), ' min ',
     MOD(FLOOR(AVG(TIMESTAMPDIFF(SECOND, pickup_time, delivery_time))), 60), ' sec'
 ) AS avg_delivery_time
 FROM Delivery
 WHERE delivery_status = 'DELIVERED';

 
 # 14.Users who spent a lot
 select o.order_id,u.user_name, sum(o.total_amount) as Total_spent
 from users u
 left join orders o on u.user_id = o.user_id
 group by u.user_id,o.order_id
 having (o.order_id) > 1
 order by Total_spent desc;
 
 
 # 15.Highest orders from cities
 select a.city, count(o.order_id) as Total_orders
 from address a 
 join orders o on a.address_id = o.address_id
 group by a.city
 having Total_orders > 1
 order by Total_orders desc;
 
 # 16 Costly order
 select order_id, max(total_amount) 
 from orders
 group by order_id;