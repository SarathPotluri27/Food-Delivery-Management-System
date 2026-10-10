package com.foodapp;

// Importing Array list to store liked items
import java.util.ArrayList;

public class Customer {

    String username;
    String password;

    // Customer profile details
    String fullName;
    String email;
    String phoneNumber;
    String address;

    // Stores liked items
    ArrayList<Item> likedItems = new ArrayList<>();

    // Stores previous orders
    ArrayList<Order> orderHistory = new ArrayList<>();

    public Customer(String username,
                    String password,
                    String fullName,
                    String email,
                    String phoneNumber,
                    String address) {

        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    // Add item to liked list
    public void likeItem(Item item) {

        likedItems.add(item);

        System.out.println(item.name + " added to liked list");
    }

    // View liked items
    public void viewLikedItems() {

        System.out.println("\n LIKED ITEMS ");

        if (likedItems.isEmpty()) {

            System.out.println("No Liked Items");

            return;
        }

        for (Item item : likedItems) {

            item.display();
        }
    }

    // Add order to history
    public void addOrder(Order order) {

        orderHistory.add(order);
    }

    // View order history
    public void viewOrderHistory() {

        System.out.println("\n ORDER HISTORY ");

        if (orderHistory.isEmpty()) {

            System.out.println("No Previous Orders");

            return;
        }

        for (Order order : orderHistory) {

            order.displayOrder();
        }
    }

    // View customer profile
    public void viewProfile() {

        System.out.println("\n CUSTOMER PROFILE ");

        System.out.println("Name: " + fullName);
        System.out.println("Email: " + email);
        System.out.println("Phone: " + phoneNumber);
        System.out.println("Address: " + address);
    }
}