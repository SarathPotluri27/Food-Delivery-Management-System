package com.foodapp;

// Importing array list to store multiple items
import java.util.ArrayList;

// Importing scanner class for user input
import java.util.Scanner;

public class Menu {

    ArrayList<Item> items = new ArrayList<>();

    // Add item to menu
    public void addItem(Item item) {
        items.add(item);
    }

    // Admin adds item dynamically
    public void addItemDynamically(Scanner sc) {

        try {

            System.out.print("Enter Item ID: ");
            int id = sc.nextInt();
            sc.nextLine();

            System.out.print("Enter Item Name: ");
            String name = sc.nextLine();

            System.out.print("Enter Restaurant Name: ");
            String restaurant = sc.nextLine();

            System.out.print("Enter Item Price: ");
            double price = sc.nextDouble();

            items.add(new Item(id, name, restaurant, price));

            System.out.println("Item Added Successfully");

        } catch (Exception e) {
            System.out.println("Invalid Input");
            sc.nextLine();
        }
    }

    // Display all menu items
    public void displayMenu() {

        System.out.println("\n MENU ");

        for (Item item : items) {
            item.display();
        }
    }

    // Search item using ID
    public Item getItemById(int id) {

        for (Item item : items) {

            if (item.id == id) {
                return item;
            }
        }

        return null;
    }

    // Search item using name
    public void searchItem(String keyword) {

        boolean found = false;

        for (Item item : items) {

            if (item.name.toLowerCase().contains(keyword.toLowerCase())) {
                item.display();
                found = true;
            }
        }

        if (!found) {
            System.out.println("No Item Found");
        }
    }
}