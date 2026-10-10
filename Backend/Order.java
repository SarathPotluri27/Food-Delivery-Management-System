package com.foodapp;

// Importing DateTime, DateTime formatter and array list
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

public class Order {

    static int orderCounter = 1;

    int orderId;

    String customerName;

    ArrayList<CartItem> orderedItems;

    double total;

    String status;
    
    Payment payment;

    // Stores order time
    LocalDateTime orderTime;

 // Constructor
    public Order(String customerName,
                 ArrayList<CartItem> orderedItems,
                 Payment payment) throws Exception {

        this.orderId = orderCounter++;

        this.customerName = customerName;

        this.orderedItems = orderedItems;

        this.payment = payment;

        this.status = "Placed";

        this.orderTime = LocalDateTime.now();

        // Prevent empty order
        if (orderedItems.isEmpty()) {

            throw new Exception("Cannot Place Order With Empty Cart");
        }

        calculateTotal();
    }

    // Calculate bill
    public void calculateTotal() {

        total = 0;

        for (CartItem cartItem : orderedItems) {

            total += cartItem.getSubtotal();
        }
    }

    // Display order
    public void displayOrder() {

        System.out.println("\n ORDER DETAILS ");

        System.out.println("Order ID: " + orderId);
        System.out.println("Customer: " + customerName);
        System.out.println("Status: " + status);
        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        System.out.println(
                "Order Date and Time: " +
                orderTime.format(formatter)
        );

        for (CartItem cartItem : orderedItems) {

            System.out.println(
                    cartItem.item.name +
                    " x " + cartItem.quantity +
                    " = ₹" + cartItem.getSubtotal()
            );
        }

        System.out.println("Total Bill: ₹" + total);
    }
    
 // Update order status
    public void updateStatus(String newStatus) {

        this.status = newStatus;

        System.out.println(
                "Order Status Updated Successfully"
        );
    }
}

