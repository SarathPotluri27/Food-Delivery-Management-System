package com.foodapp;

// Importing array list to store cart items
import java.util.ArrayList;

public class Cart {

    ArrayList<CartItem> cartItems = new ArrayList<>();

    // Add item with quantity
    public void addToCart(Item item, int quantity) throws Exception {

        // Exception handling for invalid quantity
        if (quantity <= 0) {

            throw new Exception("Quantity must be greater than 0");
        }

        // If item already exists update quantity
        for (CartItem cartItem : cartItems) {

            if (cartItem.item.id == item.id) {

                cartItem.quantity += quantity;

                System.out.println("Quantity Updated");

                return;
            }
        }

        // Add new item to cart
        cartItems.add(new CartItem(item, quantity));

        System.out.println(item.name + " added to cart");
    }

    // View cart items
    public void viewCart() {

        System.out.println("\n CART ");

        // Exception-like validation
        if (cartItems.isEmpty()) {

            System.out.println("Cart is Empty");

            return;
        }

        double total = 0;

        for (CartItem cartItem : cartItems) {

            System.out.println(
                    cartItem.item.name +
                    " x " + cartItem.quantity +
                    " = ₹" + cartItem.getSubtotal()
            );

            total += cartItem.getSubtotal();
        }

        System.out.println("Total Amount: ₹" + total);
    }

    // Remove item from cart
    public void removeItem(int itemId) throws Exception {

        for (CartItem cartItem : cartItems) {

            if (cartItem.item.id == itemId) {

                cartItems.remove(cartItem);

                System.out.println("Item Removed");

                return;
            }
        }

        // Exception handling for invalid item
        throw new Exception("Item Not Found In Cart");
    }

    // Clear cart after order
    public void clearCart() {

        cartItems.clear();
    }

    // Return cart items
    public ArrayList<CartItem> getCartItems() {

        return cartItems;
    }
}